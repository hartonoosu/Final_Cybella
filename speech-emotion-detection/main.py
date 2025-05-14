from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from predict_emotion import predict_emotion_from_audio
from preprocess_audio import preprocess_audio
import os
import subprocess
import time
from datetime import datetime
from dotenv import load_dotenv
import requests

# Explicitly specify the .env file path
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URI = os.getenv("MONGODB_URI")

# Initialize MongoDB connection status
mongo_status = "Not Connected"
try:
    client = MongoClient(MONGO_URI)
    db = client["emotion_db"]
    collection = db["voice_prediction"]

    # Test MongoDB connection
    client.admin.command("ping")
    mongo_status = "Connected"
    print("MongoDB connection established.")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    mongo_status = f"Error: {str(e)}"

# Function to get public IP
def get_public_ip():
    try:
        response = requests.get("https://api64.ipify.org?format=json")
        return response.json()["ip"]
    except Exception as e:
        print(f"Error detecting public IP: {e}")
        return "127.0.0.1"

# Endpoint to verify backend and MongoDB connection
@app.get("/ping")
async def ping():
    public_ip = get_public_ip()
    return {
        "message": "Backend is connected and running!",
        "ip": public_ip,
        "mongo_status": mongo_status
    }

# Convert .webm to .wav using ffmpeg
def convert_webm_to_wav(input_path, output_path="converted.wav"):
    command = [
        "ffmpeg",
        "-y",
        "-i", input_path,
        "-ar", "16000",
        "-ac", "1",
        output_path
    ]
    try:
        subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        print(f"FFmpeg conversion error: {e}")
        raise Exception("Audio conversion failed.")
    return output_path

# Handle voice prediction via upload
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    if file.content_type != "audio/webm":
        return JSONResponse(status_code=400, content={"error": "Unsupported file format. Only .webm is accepted."})

    file_path = f"static/{file.filename}"
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Convert webm to wav
        wav_path = convert_webm_to_wav(file_path)
        cleaned_path = preprocess_audio(wav_path, output_path="cleaned_input.wav")

        # Predict emotion
        result = predict_emotion_from_audio(cleaned_path)

        if not result or "emotion" not in result:
            return JSONResponse(status_code=500, content={"error": "Emotion detection failed"})

        # Store in MongoDB
        prediction_data = {
            "filename": file.filename,
            "emotion": result["emotion"],
            "confidence": result.get("confidence", 0),
            "timestamp": datetime.utcnow()
        }
        collection.insert_one(prediction_data)

        # Include response
        response = {
            "emotion": result["emotion"],
            "confidence": result.get("confidence", 0),
            "message": "Emotion detected successfully"
        }
        return response

    except Exception as e:
        print(f"Prediction error: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

    finally:
        time.sleep(0.5)
        try:
            os.remove(file_path)
            os.remove(wav_path)
        except Exception as e:
            print(f"Error cleaning up files: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)

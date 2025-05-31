import numpy as np
import librosa
import joblib
import tensorflow as tf
from transformers import Wav2Vec2Processor, Wav2Vec2Model
import torch

# Load saved model and tools
model = tf.keras.models.load_model("emotion_model_wav2vec_pytorch.h5")
label_encoder = joblib.load("label_encoder_pytorch.pkl")
scaler = joblib.load("scaler_pytorch.pkl")

# Load Wav2Vec2 processor and model
processor = Wav2Vec2Processor.from_pretrained("audeering/wav2vec2-large-robust-12-ft-emotion-msp-dim")
wav2vec_model = Wav2Vec2Model.from_pretrained("audeering/wav2vec2-large-robust-12-ft-emotion-msp-dim")

SAMPLE_RATE = 16000
WINDOW_DURATION = 3  # seconds
WINDOW_LENGTH = SAMPLE_RATE * WINDOW_DURATION
STEP_SIZE = SAMPLE_RATE * 1  # 1-second step (overlap)
MAX_ANALYSIS_DURATION = 9 * SAMPLE_RATE  # only use first 9 seconds

# Thresholds for quality checks
VOLUME_THRESHOLD = 0.0025 # the higher the less sensitive
PEAK_THRESHOLD = 0.02
ENERGY_STD_THRESHOLD = 0.005  # detect constant loud noise

def extract_embedding(audio_np):
    inputs = processor(audio_np, sampling_rate=SAMPLE_RATE, return_tensors="pt", padding=True)
    with torch.no_grad():
        outputs = wav2vec_model(**inputs)
        mean_embedding = outputs.last_hidden_state.mean(dim=1).squeeze().numpy()
    return mean_embedding

def predict_emotion_from_audio(path):
    y, sr = librosa.load(path, sr=SAMPLE_RATE)
    if len(y.shape) > 1:
        y = y.mean(axis=1)

    # Trim only the end (not the start)
    non_silent = librosa.effects.split(y, top_db=20)
    if len(non_silent) > 0:
        end_idx = non_silent[-1][1]
        if len(y) - end_idx > SAMPLE_RATE:  # Only trim if silence is > 1s
            y = y[:end_idx]

    duration = len(y) / SAMPLE_RATE
    print("Duration (s):", duration)
    
    if duration < 1.0:
        return {"emotion": "too_short", "confidence": 0.0}

    volume = np.mean(np.abs(y))
    peak = np.max(np.abs(y))
    print("🔊 Volume:", volume)
    print("📈 Peak:", peak)
    if volume < VOLUME_THRESHOLD:
        return {"emotion": "too_soft", "confidence": 0.0}
    if peak < PEAK_THRESHOLD:
        return {"emotion": "too_noisy", "confidence": 0.0}
    
    energy = librosa.feature.rms(y=y)[0]
    energy_std = np.std(energy)
    print("Energy STD:", energy_std)
    if energy_std < ENERGY_STD_THRESHOLD:
        return {"emotion": "too_noisy", "confidence": 0.0}

    # Trim last 2 seconds if total duration is long enough
    if len(y) > SAMPLE_RATE * 5:  # Only trim if audio is at least 5 seconds
        y = y[: -SAMPLE_RATE * 1]  # Remove last 2 seconds
    else:
        y = y[:MAX_ANALYSIS_DURATION]  # Keep normal behavior for short clips
    total_len = len(y)

    # Calculate number of full 3s windows
    full_windows = total_len // WINDOW_LENGTH
    remainder = total_len % WINDOW_LENGTH

    # Include remainder if it's >= 2s
    if remainder >= SAMPLE_RATE:
        total_segments = full_windows + 1
    else:
        total_segments = full_windows

    predictions = []
    print("\n🧠 Segment-wise prediction:")
    for i in range(total_segments):
        start = i * WINDOW_LENGTH
        end = min(start + WINDOW_LENGTH, total_len)
        segment = y[start:end]

        embedding = extract_embedding(segment)
        scaled = scaler.transform([embedding])
        probs = model.predict(scaled)[0]
        predictions.append(probs)

        # Print per segment result
        pred_idx = np.argmax(probs)
        pred_label = label_encoder.inverse_transform([pred_idx])[0]
        conf = float(round(probs[pred_idx], 4))
        print(f"⏱️ Segment {i} ({round(start/SAMPLE_RATE, 1)}-{round(end/SAMPLE_RATE, 1)}s): {pred_label} ({conf})")

    if len(predictions) == 0:
        return {"emotion": "too_short", "confidence": 0.0}

    predictions = np.array(predictions)

    USE_AVERAGE = True  # ← Toggle this flag to switch strategies

    if USE_AVERAGE:
        avg_probs = np.mean(predictions, axis=0)
        predicted_index = int(np.argmax(avg_probs))
        predicted_label = label_encoder.inverse_transform([predicted_index])[0]
        
        # Normalize inconsistent labels
        if predicted_label.lower() == "fear":
            predicted_label = "fearful"

        top3 = sorted(zip(avg_probs, label_encoder.classes_), reverse=True)[:3]
        print("\n Top 3 (average across segments):", [(label, round(p, 2)) for p, label in top3])
    else:
        max_conf_idx = np.argmax(np.max(predictions, axis=1))
        best_probs = predictions[max_conf_idx]
        predicted_index = int(np.argmax(best_probs))
        predicted_label = label_encoder.inverse_transform([predicted_index])[0]
        top3 = sorted(zip(best_probs, label_encoder.classes_), reverse=True)[:3]
        print("\n Top 3 (best segment only):", [(label, round(p, 2)) for p, label in top3])

    print("Final Top 3 Emotions:", [(label, round(prob, 3)) for prob, label in top3])

    
    # Segment-wise results to include in response (each 3s window)
    segment_results = []
    for i, probs in enumerate(predictions):
        pred_idx = int(np.argmax(probs))
        pred_label = label_encoder.inverse_transform([pred_idx])[0]
        conf = float(round(probs[pred_idx], 4))

        if pred_label.lower() == "fear":
            pred_label = "fearful"

        start_sec = round(i * WINDOW_DURATION, 1)
        end_sec = round(start_sec + WINDOW_DURATION, 1)

        segment_results.append({
            "start": start_sec,
            "end": end_sec,
            "emotion": pred_label.lower(),
            "confidence": conf
        })

    print("\n Segment results to be returned to frontend:")
    for seg in segment_results:
        print(f"  - {seg['start']}s to {seg['end']}s → {seg['emotion']} ({seg['confidence']})")


    return {
    "emotion": predicted_label.lower(),
    "confidence": float(round((avg_probs if USE_AVERAGE else best_probs)[predicted_index], 4)),
    "top3": [
        {
            "emotion": label.lower(),
            "confidence": float(round(prob, 4))
        }
        for prob, label in top3
    ],
    "segments": segment_results 
}


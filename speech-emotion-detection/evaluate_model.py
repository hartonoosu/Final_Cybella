from predict_emotion import predict_emotion_from_audio
import os
from sklearn.metrics import accuracy_score, classification_report

# Dataset root
base_path = r"C:\Users\win en\Desktop\archive"

# Label map from filename
emotion_map = {
    "02": "calm",
    "03": "happy",
    "04": "sad",
    "05": "angry",
    "06": "fearful",
    "07": "disgust",   
    "08": "surprised"   
}


valid_ids = set(emotion_map.keys())

def get_emotion_from_filename(filename):
    parts = filename.split("-")
    emotion_id = parts[2]
    return emotion_map.get(emotion_id, None) if emotion_id in valid_ids else None

# Evaluation
y_true = []
y_pred = []

# actor_folders = ["Actor_01", "Actor_02"]
actor_folders = [f for f in os.listdir(base_path) if f.startswith("Actor_")]


print("Starting evaluation...")

for actor in actor_folders:
    root = os.path.join(base_path, actor)
    print(f"\n Scanning folder: {root}")

    if not os.path.exists(root):
        print(" Path does NOT exist!")
        continue

    files = os.listdir(root)
    print("Contents:", files)

    for file in files:
        if file.endswith(".wav"):
            full_path = os.path.join(root, file)
            true_label = get_emotion_from_filename(file)

            if true_label is None:
                continue 

            # Normalize both labels to lowercase to avoid mismatch
            true_label = true_label.lower()
            predicted = predict_emotion_from_audio(full_path).lower()

            y_true.append(true_label)
            y_pred.append(predicted)
            print(f"{file} → True: {true_label}, Predicted: {predicted}")



# Show results
print(f"\n Total evaluated: {len(y_pred)}")
print("\n Accuracy:", accuracy_score(y_true, y_pred))
print("\n Classification Report:\n", classification_report(y_true, y_pred))
from collections import Counter
print(" Label distribution (true):", Counter(y_true))
print(" Label distribution (pred):", Counter(y_pred))

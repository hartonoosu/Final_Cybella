import pytest
import httpx
import os

# Define test audio paths and expected results
TEST_CASES = [
    ("happy_sample.webm", "happy"),
    ("sad_sample.webm", "sad"),
    ("angry_sample.webm", "angry"),
    ("calm_sample.webm", "calm"),
    ("disgust_sample.webm", "disgust"),
    ("fearful_sample.webm", "fearful"),
    ("neutral_sample.webm", "neutral"),
    ("surprised_sample.webm", "surprised"),
    ("soft_sample.webm", "too_soft"),
    ("noisy_sample.webm", "too_noisy"),
    ("short_sample.webm", "too_short"),
]

# Tracking summary
results_summary = []

# This will be the base test function used for each file
@pytest.mark.asyncio
@pytest.mark.parametrize("filename,expected_emotion", TEST_CASES)
async def test_predict_emotion(filename, expected_emotion):
    test_file_path = f"tests/test_audio/{filename}"

    assert os.path.exists(test_file_path), f"Test file not found: {test_file_path}"

    async with httpx.AsyncClient(base_url="http://localhost:5000") as client:
        with open(test_file_path, "rb") as f:
            files = {"file": (filename, f, "audio/webm")}
            response = await client.post("/predict/", files=files)

    assert response.status_code == 200, f"Failed for {filename}"
    data = response.json()

    predicted = data.get("emotion", "N/A")
    confidence = data.get("confidence", 0)


    # Store result summary
    results_summary.append((filename, expected_emotion, predicted, confidence))

    # Show immediate result
    print() 
    print(f"\n   {filename}")
    print(f"   Expected:  {expected_emotion}")
    print(f"   Predicted: {predicted}")
    print(f"   Confidence: {round(confidence, 4)}")

    assert predicted == expected_emotion, f"{filename}: Expected {expected_emotion}, got {predicted}"

def pytest_sessionfinish(session, exitstatus):
    # Print a clean summary after all tests
    print("\n\n========== FINAL EMOTION TEST SUMMARY ==========")
    for fname, expected, predicted, conf, icon in results_summary:
        print(f"{icon} {fname:25} | Expected: {expected:10} | Got: {predicted:10} | Confidence: {round(conf, 4)}")
    print("===============================================\n")

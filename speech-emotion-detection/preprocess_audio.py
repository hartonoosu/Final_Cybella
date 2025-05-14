import numpy as np
import scipy.io.wavfile as wav
import noisereduce as nr
import librosa
import soundfile as sf

def preprocess_audio(input_path, output_path="cleaned_input.wav"):
    # Load audio
    # y, sr = librosa.load(input_path, sr=None)
    y, sr = sf.read(input_path)


    # Normalize volume
    y = y / np.max(np.abs(y))

    # Denoise
    reduced_noise = nr.reduce_noise(y=y, sr=sr)

    # Save cleaned audio
    sf.write(output_path, reduced_noise, sr)
    return output_path

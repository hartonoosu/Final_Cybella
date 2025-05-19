export async function getRealVoiceEmotion(
  audioBlob: Blob
): Promise<{ emotion: string; confidence: number, top3?: { emotion: string; confidence: number }[]; segments?: {
    start: number;
    end: number;
    emotion: string;
    confidence: number;
  }[]; }> {
  const formData = new FormData();
  formData.append("file", audioBlob, "voice.wav");

  try {
    const response = await fetch("http://localhost:5000/predict/", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Backend response:", data);

    // // Try downloading cleaned file with retries
    // let retries = 3;
    // let downloaded = false;

    // while (retries-- > 0 && !downloaded) {
    //   await new Promise((r) => setTimeout(r, 500)); // wait before each try

    //   try {
    //     const testResp = await fetch("http://localhost:8000/static/download_cleaned.wav");
    //     if (testResp.ok) {
    //       const a = document.createElement("a");
    //       a.href = "http://localhost:8000/static/download_cleaned.wav";
    //       a.download = "cleaned_voice.wav";
    //       a.click();
    //       downloaded = true;
    //     } else {
    //       console.warn("Cleaned file not ready, retrying...");
    //     }
    //   } catch (e) {
    //     console.warn("Error during retry:", e);
    //   }
    // }

    return {
      emotion: data.emotion,
      confidence: Number(data.confidence),
      top3: data.top3,
      segments: data.segments //return segment data
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      emotion: "neutral",
      confidence: 0,
    };
  }
}
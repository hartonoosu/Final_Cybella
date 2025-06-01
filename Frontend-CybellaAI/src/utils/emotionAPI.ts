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

    return {
      emotion: data.emotion,
      confidence: Number(data.confidence),
      top3: data.top3,
      segments: data.segments
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      emotion: "neutral",
      confidence: 0,
    };
  }
}
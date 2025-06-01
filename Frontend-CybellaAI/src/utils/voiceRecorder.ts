let recording = false;
declare global {
  interface Window {
    manualStop?: boolean;
  }
}


export async function recordVoice(): Promise<{ blob: Blob; duration: number }> {
  window.manualStop = false; 
  if (recording) {
    console.warn("Already recording — skipping this call");
    return { blob: new Blob(), duration: 0 }; // return empty blob if recording is already active
  }

  recording = true;

  const startTrigger = Date.now();
  console.log("User triggered recording at:", new Date(startTrigger).toLocaleTimeString());

  console.log("Cancelling any AI speech...");
  window.speechSynthesis.cancel();

  console.log("Requesting mic access...");
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  console.log("Mic access granted.");

  const chunks: Blob[] = [];
  const mediaRecorder = new MediaRecorder(stream);


  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  source.connect(analyser);

  let silenceStartTime: number | null = null;
  let hasStopped = false;
  let startTime: number; // actual mic start

  // background noise calibration
  let baselineVolume = 0;
  let calibrationFrames = 0;
  const calibrationLimit = 20;

  const stopRecording = () => {
    if (!hasStopped && mediaRecorder.state === "recording") {
      const reason = window.manualStop ? "Manual Stop Button" : "Auto/AI/Silence";
      console.log(`Calling mediaRecorder.stop() — Reason: ${reason} — at`, new Date().toLocaleTimeString());
      mediaRecorder.stop();
      clearInterval(volumeInterval);
      source.disconnect();
      analyser.disconnect();
      hasStopped = true;
    }
  };

  if (typeof window !== "undefined" && !document.getElementById("force-stop-recording")) {
    const stopButton = document.createElement("button");
    stopButton.id = "force-stop-recording";
    stopButton.style.display = "none";
    stopButton.onclick = () => {
      console.log(" Manual stop button clicked by user");
      window.manualStop = true;
      stopRecording();
    };
    document.body.appendChild(stopButton);
}


  // Start volume check loop
  const checkVolume = () => {
    analyser.getByteFrequencyData(dataArray);
    const currentVolume = dataArray.reduce((a, b) => a + b) / bufferLength;

    if (window.manualStop) {
      console.log(" Manual stop detected inside recorder");
      window.manualStop = false;
      stopRecording();
      return;
    }

    if (calibrationFrames < calibrationLimit) {
      baselineVolume += currentVolume;
      calibrationFrames++;
      return;
    }
    const averageBaseline = baselineVolume / calibrationLimit;
    const dynamicThreshold = Math.min(Math.max(averageBaseline * 2.5, 1.5), 8);
    console.log(`[Volume Check] Volume: ${currentVolume.toFixed(2)} | Threshold: ${dynamicThreshold.toFixed(2)}`);

    if (currentVolume < dynamicThreshold) {
      if (silenceStartTime === null) {
        silenceStartTime = Date.now();
        console.log("Silence started at:", new Date().toLocaleTimeString());
      } else if (Date.now() - silenceStartTime > 2000) {
        console.log("Detected 2 seconds of silence — stopping...");
        stopRecording();
      }
    } else {
      silenceStartTime = null;
    }
  };

  let volumeInterval: NodeJS.Timeout;

  
  return new Promise((resolve) => {
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        console.log("Chunk received:", e.data.size, "bytes");
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      console.log("Mic stream closed.");

      const stopTime = new Date();
      const duration = stopTime.getTime() - startTime;
      const blob = new Blob(chunks, { type: "audio/webm" });
      console.log("Recording stopped at:", stopTime.toLocaleTimeString(), "| Final blob size:", blob.size);

      // Download for debug
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "recorded_voice_debug.webm";
      // a.style.display = "none";
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      // console.log("Voice downloaded for debug.");

      analyser.disconnect();
      source.disconnect();
      audioContext.close();

      clearInterval(volumeInterval);

      recording = false;
      resolve({blob, duration});
      window.manualStop = false;

    };

    console.log("Warming up mic — please wait 0.3 second before speaking...");
    setTimeout(() => {
      mediaRecorder.start();
      const aiSpeakingCheck = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          console.log("Detected AI speaking – stopping recording...");
          stopRecording();
          clearInterval(aiSpeakingCheck);
        }
      }, 200);

      startTime = Date.now();
      console.log("Recording actually started at:", new Date(startTime).toLocaleTimeString(), "| Delay from trigger:", startTime - startTrigger, "ms");

      volumeInterval = setInterval(checkVolume, 50); // check volume every 50ms
      
      setTimeout(() => {
        if (!hasStopped) {
          console.log("Auto-stopping recording after 60 sec...");
          stopRecording();
        }
      }, 60000);
    }, 300); // wait for 0.3 sec
  });
}
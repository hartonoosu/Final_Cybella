
// Speech recognition utility

// Speech recognition options
export interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}

// Create a type for the speech recognition result handler
export type SpeechRecognitionResultHandler = (
  transcript: string,
  isFinal: boolean
) => void;

// Create a class to handle speech recognition
export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private onResultCallback: SpeechRecognitionResultHandler | null = null;
  private onEndCallback: (() => void) | null = null;
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private audioDataArray: Uint8Array | null = null;

  constructor() {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      // Set default options
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  // Set up event handlers for speech recognition
  private setupRecognitionEvents() {
    if (!this.recognition) return;

    this.recognition.onresult = (event) => {
      if (this.onResultCallback && event.results.length > 0) {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        const isFinal = result.isFinal;
        this.onResultCallback(transcript, isFinal);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
    };
  }

  // Configure the recognition service
  public configure(options: SpeechRecognitionOptions = {}) {
    if (!this.recognition) return;

    if (options.continuous !== undefined) {
      this.recognition.continuous = options.continuous;
    }
    if (options.interimResults !== undefined) {
      this.recognition.interimResults = options.interimResults;
    }
    if (options.language) {
      this.recognition.lang = options.language;
    }
  }

  // Start listening
  public async start() {
    if (!this.recognition || this.isListening) return;

    try {
      // Set up audio visualization if not already done
      if (!this.audioContext) {
        await this.setupAudioAnalyzer();
      }
      
      this.setupRecognitionEvents();
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  }

  // Stop listening
  public stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
    
    // Clean up audio resources
    if (this.microphone) {
      this.microphone.disconnect();
    }
  }

  // Set result handler
  public onResult(callback: SpeechRecognitionResultHandler) {
    this.onResultCallback = callback;
  }

  // Set end handler
  public onEnd(callback: () => void) {
    this.onEndCallback = callback;
  }

  // Set up audio analyzer for visualization
  private async setupAudioAnalyzer() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      this.analyzer = this.audioContext.createAnalyser();
      this.analyzer.fftSize = 256;
      
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyzer);
      
      const bufferLength = this.analyzer.frequencyBinCount;
      this.audioDataArray = new Uint8Array(bufferLength);
    } catch (error) {
      console.error('Error setting up audio analyzer:', error);
    }
  }

  // Get audio data for visualizer
  public getAudioData(): Uint8Array | null {
    if (this.analyzer && this.audioDataArray && this.isListening) {
      this.analyzer.getByteFrequencyData(this.audioDataArray);
      return this.audioDataArray;
    }
    return null;
  }

  // Check if browser supports speech recognition - static method
  public static isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
}

// Export singleton instance
export const speechRecognition = new SpeechRecognitionService();


import { Emotion } from '@/components/EmotionDisplay';

// Speech recognition singleton
class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private audioData: Uint8Array | null = null;
  private resultCallback: ((text: string, isFinal: boolean) => void) | null = null;
  private endCallback: (() => void) | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window !== 'undefined') {
      // Initialize Web Speech API
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        this.recognition = new SpeechRecognitionAPI();
        this.configureRecognition();
      }
      
      // Initialize AudioContext for visualization
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.analyzer = this.audioContext.createAnalyser();
        this.analyzer.fftSize = 256;
        const bufferLength = this.analyzer.frequencyBinCount;
        this.audioData = new Uint8Array(bufferLength);
      } catch (error) {
        console.error('Audio context initialization failed:', error);
      }
    }
  }

  private configureRecognition() {
    if (!this.recognition) return;
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    
    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      const resultText = finalTranscript || interimTranscript;
      const isFinal = !!finalTranscript;
      
      if (this.resultCallback) {
        this.resultCallback(resultText, isFinal);
      }
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      if (this.endCallback) {
        this.endCallback();
      }
    };
  }

  public configure(options: {
    continuous?: boolean;
    interimResults?: boolean;
    language?: string;
  }) {
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

  public async start() {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }
    
    if (this.isListening) {
      this.stop();
      // Small delay to ensure recognition has stopped
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      throw error;
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public onResult(callback: (text: string, isFinal: boolean) => void) {
    this.resultCallback = callback;
  }

  public onEnd(callback: () => void) {
    this.endCallback = callback;
  }

  public getAudioData(): Uint8Array | null {
    if (this.analyzer && this.audioData) {
      this.analyzer.getByteFrequencyData(this.audioData);
      return this.audioData;
    }
    
    return null;
  }
}

export const speechRecognition = new SpeechRecognitionService();

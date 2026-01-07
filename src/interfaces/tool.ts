// @/interfaces/tool.ts

export interface Tool {
  id: string | number;
  name: string;
  category: string;
  description: string;
  score: number;
  url: string;
  logo_url: string;
  [key: string]: any;
}

export interface ToolForPartialUpdate {
  id: string | number;
  name: string;
  category: string;
  description: string;
  score: number;
  url: string;
  logo_url: string;
}

export interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

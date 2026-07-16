export type TranscriptLine = {
  id: string;
  start: number; // in seconds
  end: number;
  text: string;
  isFocusWord?: string[]; // words to highlight
};

export const MOCK_TRANSCRIPT: TranscriptLine[] = [
  { id: "1", start: 0, end: 4.5, text: "Hello everyone, and welcome back to the channel." },
  { id: "2", start: 4.5, end: 11, text: "Today we are going to learn how to speak English more naturally.", isFocusWord: ["naturally"] },
  { id: "3", start: 11, end: 17, text: "It's not just about knowing the grammar rules or vocabulary." },
  { id: "4", start: 17, end: 23, text: "It involves mastering rhythm, intonation, and connected speech.", isFocusWord: ["rhythm,", "intonation,", "connected", "speech."] },
  { id: "5", start: 23, end: 31, text: "So, grab a notebook, listen closely, and let's dive into the first technique together right now." },
  { id: "6", start: 31, end: 38, text: "Notice how native speakers link their words." }
];

export const MOCK_VIDEO_ID = "H14bBuluwB8"; // Julian Treasure: How to speak so that people want to listen

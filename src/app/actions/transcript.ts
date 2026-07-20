"use server";

import { YoutubeTranscript } from "youtube-transcript";
import { TranscriptLine } from "@/lib/mockData"; // reuse the type

export async function getYouTubeTranscript(videoId: string): Promise<TranscriptLine[] | null> {
  try {
    const rawTranscript = await YoutubeTranscript.fetchTranscript(videoId, { 
      lang: 'en',
      fetch: (url, init) => {
        const headers = new Headers(init?.headers);
        // Bypass YouTube consent page and IP blocks
        headers.set('Cookie', 'CONSENT=YES+cb');
        headers.set('Accept-Language', 'en-US,en;q=0.9');
        headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        return fetch(url, { ...init, headers });
      }
    });
    
    if (!rawTranscript || rawTranscript.length === 0) {
      return null;
    }

    // Map to our TranscriptLine format
    return rawTranscript.map((item, index) => {
      // duration and offset are in milliseconds
      const start = item.offset / 1000;
      const end = (item.offset + item.duration) / 1000;
      
      // decode HTML entities if any (like &#39; -> ')
      const text = item.text.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

      return {
        id: `t_${index}`,
        start,
        end,
        text,
      };
    });
  } catch (error) {
    console.error("Failed to fetch transcript:", error);
    return null;
  }
}

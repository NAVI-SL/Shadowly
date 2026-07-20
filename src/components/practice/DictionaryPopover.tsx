"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, Volume2, BookOpen } from "lucide-react";

interface DictionaryPopoverProps {
  word: string;
  children: React.ReactNode;
}

interface DictionaryData {
  word: string;
  phonetic?: string;
  phonetics: { text?: string; audio?: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

export function DictionaryPopover({ word, children }: DictionaryPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<DictionaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // Clean up punctuation to query the API correctly
  const cleanWord = word.replace(/[^a-zA-Z]/g, "").toLowerCase();

  useEffect(() => {
    if (isOpen && !data && !error && cleanWord) {
      setIsLoading(true);
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then((json) => {
          setData(json[0]);
          setIsLoading(false);
        })
        .catch(() => {
          setError(true);
          setIsLoading(false);
        });
    }
  }, [isOpen, data, error, cleanWord]);

  const playAudio = (url?: string) => {
    if (!url) return;
    const audio = new Audio(url);
    audio.play();
  };

  // Find the first available phonetic audio
  const phoneticWithAudio = data?.phonetics.find((p) => p.audio && p.audio.length > 0);
  const phoneticText = data?.phonetic || data?.phonetics.find(p => p.text)?.text;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="focus:outline-none hover:bg-primary/10 transition-colors rounded">
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 shadow-lg border-border rounded-xl overflow-hidden z-50" 
        sideOffset={5}
      >
        {isLoading ? (
          <div className="p-6 flex flex-col items-center justify-center text-muted-foreground space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm">Looking up &quot;{cleanWord}&quot;...</p>
          </div>
        ) : error || !data ? (
          <div className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-border mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No definition found for &quot;{cleanWord}&quot;.</p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="bg-muted p-4 border-b border-border flex items-start justify-between">
              <div>
                <h4 className="text-lg font-playfair font-bold text-foreground capitalize">{data.word}</h4>
                {phoneticText && (
                  <p className="text-sm text-primary font-mono mt-1">{phoneticText}</p>
                )}
              </div>
              {phoneticWithAudio && (
                <button 
                  onClick={() => playAudio(phoneticWithAudio.audio)}
                  className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors flex-shrink-0"
                  title="Listen to pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Body */}
            <div className="p-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-border">
              {data.meanings.slice(0, 2).map((meaning, idx) => (
                <div key={idx} className="mb-4 last:mb-0">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    {meaning.partOfSpeech}
                  </div>
                  <ul className="space-y-3">
                    {meaning.definitions.slice(0, 2).map((def, dIdx) => (
                      <li key={dIdx} className="text-sm text-foreground">
                        <p className="leading-relaxed">{def.definition}</p>
                        {def.example && (
                          <p className="text-muted-foreground italic mt-1 border-l-2 border-primary pl-2">
                            &quot;{def.example}&quot;
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

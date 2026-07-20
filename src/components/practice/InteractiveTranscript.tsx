import { Search, Languages, BookmarkPlus, Play } from "lucide-react";

import { TranscriptLine } from "@/lib/mockData";
import { useAppStore } from "@/store/useAppStore";
import { useRef, useEffect } from "react";

interface InteractiveTranscriptProps {
  transcript: TranscriptLine[];
  activeId: string | null;
  onLineClick: (id: string, startTime: number) => void;
}

export function InteractiveTranscript({ transcript, activeId, onLineClick }: InteractiveTranscriptProps) {
  const { addVocabulary } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBookmark = (e: React.MouseEvent, text: string) => {
    e.stopPropagation(); // prevent line click
    addVocabulary({
      word: "New Phrase", // Mock extraction
      definition: "Definition to be added.",
      exampleSentence: text,
      sourceVideoId: "mock_video",
    });
    alert("Saved to vocabulary!");
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm flex flex-col h-[600px]">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
            Interactive Transcript
          </h3>
          <div className="flex gap-2 text-muted-foreground">
            <button className="hover:text-foreground p-1"><Languages className="w-5 h-5" /></button>
            <button className="hover:text-foreground p-1"><Search className="w-5 h-5" /></button>
          </div>
        </div>
        
        {/* Simple search input mock */}
        {/* <Input placeholder="Search transcript..." className="h-9 text-sm bg-muted border-none" /> */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-border min-h-0" ref={scrollRef}>
        <div className="space-y-2">
          {transcript.map((line) => {
            const isActive = activeId === line.id;
            return (
              <div
                key={line.id}
                ref={isActive ? activeLineRef : null}
                onClick={() => onLineClick(line.id, line.start)}
                className={`flex gap-4 p-3 rounded-lg cursor-pointer transition-colors group ${
                  isActive 
                    ? "bg-primary/10 border-l-2 border-l-primary" 
                    : "hover:bg-muted border-l-2 border-l-transparent"
                }`}
              >
                <span className={`text-sm mt-1 shrink-0 ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {formatTime(line.start)}
                </span>
                
                <div className="flex-1">
                  <p className={`text-[15px] leading-relaxed ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {line.text}
                  </p>
                </div>

                <div className={`flex flex-col gap-2 shrink-0 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                  <button 
                    className="p-1.5 rounded bg-card text-card-foreground shadow-sm text-primary hover:bg-primary text-primary-foreground hover:text-white transition-colors"
                    onClick={(e) => { e.stopPropagation(); onLineClick(line.id, line.start); }}
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    className="p-1.5 rounded bg-card text-card-foreground shadow-sm text-muted-foreground hover:text-primary transition-colors"
                    onClick={(e) => handleBookmark(e, line.text)}
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

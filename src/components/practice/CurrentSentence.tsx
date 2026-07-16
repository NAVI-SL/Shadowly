import { Play, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TranscriptLine } from "@/lib/mockData";
import { DictionaryPopover } from "./DictionaryPopover";

interface CurrentSentenceProps {
  sentence: TranscriptLine;
  currentTime: number;
  onListen: () => void;
  onPractice: () => void;
}

export function CurrentSentence({ sentence, currentTime, onListen, onPractice }: CurrentSentenceProps) {
  // Approximate word-level sync by interpolating time across the sentence length
  const renderSentence = () => {
    const words = sentence.text.replace(/\n/g, ' ').split(' ').filter(w => w.length > 0);
    const duration = sentence.end - sentence.start;
    const timePerWord = duration > 0 ? duration / Math.max(words.length, 1) : 0;

    return words.map((word, index) => {
      const wordStart = sentence.start + (index * timePerWord);
      const wordEnd = wordStart + timePerWord;
      
      const isActive = currentTime >= wordStart && currentTime < wordEnd;
      const isFocus = sentence.isFocusWord?.some(fw => fw.toLowerCase() === word.toLowerCase().replace(/[^a-z]/g, ''));

      let classes = "transition-colors duration-150 ";
      if (isActive) {
        classes += "text-primary font-bold bg-primary/10 rounded px-1 -mx-1 ";
      } else if (isFocus) {
        classes += "text-primary font-semibold border-b-2 border-dashed border-primary ";
      }

      return (
        <span key={index}>
          <DictionaryPopover word={word}>
            <span className={classes}>
              {word}
            </span>
          </DictionaryPopover>
          {" "}
        </span>
      );
    });
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6 border-l-4 border-l-primary mb-8">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary text-primary-foreground"></div>
        </div>
        <span className="text-xs font-bold text-primary tracking-wider uppercase">
          Current Sentence Focus
        </span>
      </div>
      
      <p className="text-2xl font-playfair text-foreground mb-6 leading-relaxed">
        {renderSentence()}
      </p>

      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          className="bg-blue-50 dark:bg-blue-900/20 border-none text-foreground hover:bg-blue-100 px-6"
          onClick={onListen}
        >
          <Play className="w-4 h-4 mr-2" />
          Listen
        </Button>
        <Button 
          className="bg-primary/10 border-none text-primary hover:bg-border px-6"
          onClick={onPractice}
        >
          <Mic className="w-4 h-4 mr-2" />
          Practice
        </Button>
      </div>
    </div>
  );
}

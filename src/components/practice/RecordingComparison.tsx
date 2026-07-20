import { useState, useRef, useEffect } from "react";
import { Play, Square, Loader2 } from "lucide-react";

interface RecordingComparisonProps {
  isRecordingMode: boolean;
  onStopRecording: () => void;
}

export function RecordingComparison({ isRecordingMode, onStopRecording }: RecordingComparisonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Mock waveform visualizer bars
  const renderWaveform = (isActive: boolean = false, isUser: boolean = false) => {
    return (
      <div className={`flex items-center gap-[2px] h-10 flex-1 px-4 ${isUser && !hasRecorded ? 'opacity-20' : 'opacity-100'}`}>
        {Array.from({ length: 40 }).map((_, i) => {
          const height = Math.random() * 80 + 20; // 20% to 100%
          return (
            <div 
              key={i} 
              className={`w-1 rounded-full ${isActive ? 'bg-primary text-primary-foreground' : 'bg-[#D9E2DC]'}`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    if (isRecordingMode && !isRecording && !hasRecorded) {
      startRecording();
    }
  }, [isRecordingMode, isRecording, hasRecorded]);

  const startRecording = () => {
    setIsRecording(true);
    setHasRecorded(false);
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Simulate analyzing state
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasRecorded(true);
      onStopRecording();
    }, 1500);
  };

  if (!isRecordingMode && !hasRecorded) return null;

  return (
    <div className="bg-card text-card-foreground rounded-2xl p-6 border border-border shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
          Your Shadowing Practice
        </h3>
        
        {isRecording && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-medium animate-pulse">
            <div className="w-2 h-2 rounded-full bg-destructive text-destructive-foreground"></div>
            Recording 00:0{timer}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Original Waveform */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground w-16 text-right">Original</span>
          <div className="flex-1 bg-muted rounded-xl flex items-center relative overflow-hidden">
            {renderWaveform(false, false)}
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-foreground"></div>
          </div>
          <button className="text-muted-foreground hover:text-foreground p-2">
            <Play className="w-5 h-5" />
          </button>
        </div>

        {/* User Waveform */}
        <div className="flex items-center gap-4">
          <span className={`text-sm font-bold w-16 text-right ${isRecording ? 'text-destructive' : 'text-primary'}`}>
            Your Take
          </span>
          <div className="flex-1 bg-muted rounded-xl flex items-center relative overflow-hidden border border-transparent hover:border-border transition-colors">
            {isAnalyzing ? (
              <div className="flex items-center justify-center w-full h-10 gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing pronunciation...
              </div>
            ) : isRecording ? (
              <div className="flex items-center justify-center w-full h-10 text-destructive">
                {/* Active recording animation mock */}
                <div className="flex gap-1 h-6 items-center">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-1 bg-destructive text-destructive-foreground rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s`, height: `${Math.max(20, Math.random() * 100)}%` }}></div>
                  ))}
                </div>
              </div>
            ) : (
              renderWaveform(true, true)
            )}
          </div>
          
          {isRecording ? (
            <button 
              onClick={stopRecording}
              className="bg-destructive text-destructive-foreground text-white p-2 rounded-full hover:bg-destructive/90 shadow-sm"
            >
              <Square className="w-5 h-5 fill-current" />
            </button>
          ) : (
            <button 
              disabled={!hasRecorded || isAnalyzing}
              className={`p-2 rounded-full shadow-sm ${
                hasRecorded && !isAnalyzing 
                  ? 'bg-primary/10 text-primary hover:bg-border' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <Play className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Feedback Badges */}
      {hasRecorded && !isAnalyzing && (
        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-border">
            85% Match - Good Pacing
          </span>
          <span className="bg-card text-card-foreground text-muted-foreground px-3 py-1 rounded-full text-sm border border-border">
            Pronunciation: 82%
          </span>
          <span className="bg-card text-card-foreground text-muted-foreground px-3 py-1 rounded-full text-sm border border-border">
            Rhythm: 88%
          </span>
        </div>
      )}
    </div>
  );
}

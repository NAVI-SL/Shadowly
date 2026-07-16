import { useAppStore } from "@/store/useAppStore";
import { Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SessionProgressProps {
  elapsedMinutes: number;
  completedSentences: number;
  totalSentences: number;
}

export function SessionProgress({ elapsedMinutes, completedSentences, totalSentences }: SessionProgressProps) {
  const { streak } = useAppStore();
  const percentage = totalSentences > 0 ? Math.round((completedSentences / totalSentences) * 100) : 0;

  return (
    <div className="bg-card text-card-foreground rounded-2xl p-5 border border-border shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground">Session Progress</h3>
        <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-border">
          <Flame className="w-4 h-4" />
          <span>{streak} Day Streak</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 border border-muted-foreground rounded-full flex items-center justify-center text-[10px]">⏱</span>
          <span>{elapsedMinutes} min elapsed</span>
        </div>
        <span className="font-bold text-primary">{percentage}%</span>
      </div>
      
      <Progress value={percentage} className="h-2 bg-primary/10" />
    </div>
  );
}

import { useState } from "react";
import { Link as LinkIcon, PlaySquare, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onLoadVideo: (url: string) => void;
  isLoading: boolean;
  externalError?: string | null;
}

export function EmptyState({ onLoadVideo, isLoading, externalError }: EmptyStateProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      setError("Please enter a valid YouTube URL.");
      return;
    }
    setError("");
    onLoadVideo(url);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-12">
      <div className="text-center mb-10 w-full">
        <h1 className="font-playfair text-4xl font-bold text-foreground mb-4">
          Practice English with Real Videos
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Paste any YouTube URL below to generate an interactive transcript and start shadowing.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl mx-auto">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full pl-12 h-14 text-lg border-border rounded-xl focus-visible:ring-primary"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-white rounded-xl text-lg w-full sm:w-auto"
            disabled={isLoading || !url}
          >
            {isLoading ? "Loading..." : "Load Video"}
          </Button>
        </form>
        {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
      </div>

      <div className="w-full bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-16 flex flex-col items-center justify-center min-h-[400px]">
        {externalError ? (
          <>
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Transcript Not Found</h2>
            <p className="text-muted-foreground text-center max-w-md">
              {externalError}
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
              <PlaySquare className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Start Your Shadowing Practice</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Paste a YouTube link above to load a video and begin practicing. The interactive transcript will appear here.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

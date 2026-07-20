import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import YouTube, { YouTubeProps, YouTubePlayer } from "react-youtube";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw, Mic, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface VideoPlayerRef {
  seekTo: (time: number) => void;
  play: () => void;
  pause: () => void;
}

interface VideoPlayerProps {
  videoId: string;
  onTimeUpdate: (time: number) => void;
  onPlayNext: () => void;
  onPlayPrev: () => void;
  onRecord: () => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({ videoId, onTimeUpdate, onPlayNext, onPlayPrev, onRecord }, ref) => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useImperativeHandle(ref, () => ({
    seekTo: (time: number) => {
      if (player) player.seekTo(time, true);
    },
    play: () => {
      if (player) player.playVideo();
    },
    pause: () => {
      if (player) player.pauseVideo();
    }
  }), [player]);

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      disablekb: 1,
    },
  };

  const startTrackingTime = (p: YouTubePlayer) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      try {
        const time = await p.getCurrentTime();
        onTimeUpdate(time);
      } catch {}
    }, 200); // 5 times a second
  };

  const stopTrackingTime = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
    event.target.unMute();
    event.target.setVolume(50);
    setVolume(50);
    setIsMuted(false);
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    // 1 is PLAYING, 2 is PAUSED, 0 is ENDED
    if (event.data === 1) {
      setIsPlaying(true);
      startTrackingTime(event.target);
    } else {
      setIsPlaying(false);
      stopTrackingTime();
    }
  };

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) player.pauseVideo();
    else player.playVideo();
  };

  const handleVolumeChange = (val: number) => {
    if (!player) return;
    setVolume(val);
    player.setVolume(val);
    if (val > 0 && isMuted) {
      player.unMute();
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
      if (volume === 0) {
        setVolume(100);
        player.setVolume(100);
      }
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  // Removed handleRateChange

  return (
    <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden mb-8">
      {/* Video Container */}
      <div className="relative w-full aspect-video bg-black">
        <YouTube 
          videoId={videoId} 
          opts={opts} 
          onReady={onReady} 
          onStateChange={onStateChange}
          className="absolute top-0 left-0 w-full h-full"
          iframeClassName="w-full h-full"
        />
      </div>

      {/* Controls Container */}
      <div className="p-4 sm:p-6 grid grid-cols-3 items-center gap-4">
        
        {/* Left Side: Volume Controls */}
        <div 
          className="flex items-center"
          onMouseEnter={() => setShowVolume(true)}
          onMouseLeave={() => setShowVolume(false)}
        >
          <button 
            className="p-2 text-muted-foreground hover:text-foreground bg-muted hover:bg-primary/10 rounded-full transition-colors z-10 shrink-0"
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          
          {/* Horizontal Volume Slider */}
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center ${
              showVolume ? "w-24 opacity-100 ml-3" : "w-0 opacity-0 ml-0"
            }`}
          >
            <input 
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full h-1.5 bg-[#D9E2DC] rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary transition-all outline-none"
            />
          </div>
        </div>

        {/* Center: Main Playback Controls */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <button 
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={onPlayPrev}
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button 
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => player?.seekTo(player.getCurrentTime() - 5, true)}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>

          <button 
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => player?.seekTo(player.getCurrentTime() + 5, true)}
            title="Skip forward 5 seconds"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          <button 
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={onPlayNext}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Right Side: Record Shortcut */}
        <div className="flex justify-end">
          <Button 
            variant="outline"
            className="rounded-full border-destructive text-destructive hover:bg-destructive/10 text-destructive hover:text-destructive flex items-center justify-center h-10 w-10 p-0 sm:w-auto sm:px-4"
            onClick={onRecord}
          >
            <Mic className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Record</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

VideoPlayer.displayName = "VideoPlayer";


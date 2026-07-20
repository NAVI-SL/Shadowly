"use client";

import { useState, useEffect, useRef } from "react";
import { EmptyState } from "@/components/practice/EmptyState";
import { VideoPlayer, VideoPlayerRef } from "@/components/practice/VideoPlayer";
import { CurrentSentence } from "@/components/practice/CurrentSentence";
import { RecordingComparison } from "@/components/practice/RecordingComparison";
import { SessionProgress } from "@/components/practice/SessionProgress";
import { InteractiveTranscript } from "@/components/practice/InteractiveTranscript";
import { MOCK_TRANSCRIPT, TranscriptLine } from "@/lib/mockData";
import { useAppStore } from "@/store/useAppStore";
import { getYouTubeTranscript } from "@/app/actions/transcript";

export default function PracticePage() {
  const playerRef = useRef<VideoPlayerRef>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [activeSentenceId, setActiveSentenceId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptLine[]>(MOCK_TRANSCRIPT);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);

  const { addPracticeTime } = useAppStore();

  const handleLoadVideo = async (url: string) => {
    setIsLoading(true);
    setTranscriptError(null);

    // Extract the video ID from the YouTube URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const extractedId = (match && match[2].length === 11) ? match[2] : null;

    if (!extractedId) {
      setTranscriptError("Could not extract a valid YouTube video ID from the URL provided.");
      setIsLoading(false);
      return;
    }

    // Fetch real transcript
    const fetchedTranscript = await getYouTubeTranscript(extractedId);
    
    if (fetchedTranscript) {
      setTranscript(fetchedTranscript);
      setActiveSentenceId(fetchedTranscript[0].id);
      setVideoId(extractedId);
      setIsLoaded(true);
      setSessionStartTime(new Date());
    } else {
      setTranscriptError("We couldn't find an English transcript (including auto-generated captions) for this video. Shadowing practice requires English text. Please try another video.");
      setIsLoaded(false);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!sessionStartTime) return;
    const interval = setInterval(() => {
      const now = new Date();
      const diffInMs = now.getTime() - sessionStartTime.getTime();
      setElapsedMinutes(Math.floor(diffInMs / 60000));
    }, 60000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  // Clean up and save time on unmount if session existed
  useEffect(() => {
    return () => {
      if (elapsedMinutes > 0) {
        addPracticeTime(elapsedMinutes);
      }
    };
  }, [elapsedMinutes, addPracticeTime]);

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
    if (isRecordingMode) return; // Don't auto-scroll while recording
    // Find the most recent sentence that has started
    let currentIndex = -1;
    for (let i = 0; i < transcript.length; i++) {
      if (time >= transcript[i].start) {
        currentIndex = i;
      } else {
        break; // Since the transcript is ordered by start time
      }
    }
    const current = currentIndex >= 0 ? transcript[currentIndex] : undefined;
    if (current && current.id !== activeSentenceId) {
      setActiveSentenceId(current.id);
    }
  };

  const handleLineClick = (id: string, startTime: number) => {
    setActiveSentenceId(id);
    if (playerRef.current) {
      playerRef.current.seekTo(startTime);
      playerRef.current.play();
    }
  };

  const activeSentenceIndex = transcript.findIndex(t => t.id === activeSentenceId);
  const activeSentence = transcript[activeSentenceIndex] || transcript[0];

  const handlePlayNext = () => {
    if (activeSentenceIndex < transcript.length - 1) {
      const nextSentence = transcript[activeSentenceIndex + 1];
      setActiveSentenceId(nextSentence.id);
      if (playerRef.current) {
        playerRef.current.seekTo(nextSentence.start);
      }
    }
  };

  const handlePlayPrev = () => {
    if (activeSentenceIndex > 0) {
      const prevSentence = transcript[activeSentenceIndex - 1];
      setActiveSentenceId(prevSentence.id);
      if (playerRef.current) {
        playerRef.current.seekTo(prevSentence.start);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 min-h-[calc(100vh-64px)] flex items-center">
        <EmptyState onLoadVideo={handleLoadVideo} isLoading={isLoading} externalError={transcriptError} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column (65%) */}
        <div className="w-full lg:w-[65%] flex flex-col">
          <VideoPlayer 
            ref={playerRef}
            videoId={videoId} 
            onTimeUpdate={handleTimeUpdate}
            onPlayNext={handlePlayNext}
            onPlayPrev={handlePlayPrev}
            onRecord={() => setIsRecordingMode(true)}
          />

          <CurrentSentence 
            sentence={activeSentence}
            currentTime={currentTime}
            onListen={() => {
              setIsRecordingMode(false);
              if (playerRef.current) {
                playerRef.current.seekTo(activeSentence.start);
                playerRef.current.play();
              }
            }}
            onPractice={() => setIsRecordingMode(true)}
          />

          <RecordingComparison 
            isRecordingMode={isRecordingMode} 
            onStopRecording={() => setIsRecordingMode(false)} 
          />
        </div>

        {/* Right Column (35%) */}
        <div className="w-full lg:w-[35%] flex flex-col">
          <SessionProgress 
            elapsedMinutes={elapsedMinutes}
            completedSentences={Math.max(0, activeSentenceIndex)}
            totalSentences={transcript.length}
          />
          
          <div className="sticky top-24 h-[calc(100vh-12rem)]">
            <InteractiveTranscript 
              transcript={transcript}
              activeId={activeSentenceId}
              onLineClick={handleLineClick}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

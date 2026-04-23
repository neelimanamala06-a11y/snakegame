import { useState, useEffect, useCallback } from 'react';
import { Track } from '../types';
import { DUMMY_TRACKS } from '../constants';

export function useMockAudio() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  // Simulate playback progress
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentTrack.duration) {
            // Auto-skip to next track when finished
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.duration, currentTrackIndex]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setCurrentTime(0);
    setIsPlaying(true);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setCurrentTime(0);
    setIsPlaying(true);
  }, []);

  const seek = useCallback((time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, currentTrack.duration)));
  }, [currentTrack.duration]);

  return {
    currentTrack,
    isPlaying,
    currentTime,
    togglePlay,
    handleNext,
    handlePrev,
    seek
  };
}

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { useMockAudio } from '../hooks/useMockAudio';
import { NeonCard } from './NeonCard';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const MusicPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    togglePlay,
    handleNext,
    handlePrev,
    seek
  } = useMockAudio();

  const progressPercent = (currentTime / currentTrack.duration) * 100;

  return (
    <NeonCard color="pink" className="w-full max-w-md flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-neon-pink">
          <Music size={20} className="animate-pulse" />
          <h2 className="font-mono font-bold tracking-widest uppercase text-sm">Now Playing</h2>
        </div>
        <Volume2 size={18} className="text-gray-400" />
      </div>

      {/* Track Info & Visualizer Mock */}
      <div className="flex items-center gap-4">
        <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${currentTrack.coverColor} shadow-lg flex items-center justify-center relative overflow-hidden`}>
           {isPlaying && (
             <div className="absolute inset-0 bg-black/20 flex items-end justify-around p-2 gap-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-2 bg-white/80 rounded-t-sm animate-pulse"
                    style={{ 
                      height: `${Math.random() * 100}%`,
                      animationDuration: `${0.5 + Math.random()}s`
                    }}
                  />
                ))}
             </div>
           )}
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-xl font-bold text-white truncate">{currentTrack.title}</h3>
          <p className="text-neon-cyan text-sm truncate">{currentTrack.artist}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-neon-pink px-2 py-0.5 rounded-full border border-neon-pink/50 bg-neon-pink/10">
              AI Generated
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div 
          className="h-2 bg-gray-800 rounded-full overflow-hidden cursor-pointer relative"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            seek(percentage * currentTrack.duration);
          }}
        >
          <div 
            className="h-full bg-gradient-to-r from-neon-pink to-neon-purple transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-mono text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={handlePrev}
          className="p-2 text-gray-300 hover:text-neon-cyan transition-colors"
        >
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-neon-pink text-white shadow-neon-pink hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        
        <button 
          onClick={handleNext}
          className="p-2 text-gray-300 hover:text-neon-cyan transition-colors"
        >
          <SkipForward size={24} />
        </button>
      </div>
    </NeonCard>
  );
};

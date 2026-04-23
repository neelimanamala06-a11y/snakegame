import React from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex items-center justify-center p-4 md:p-8">
      
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-cyan/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid overlay for retro feel */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
          transformOrigin: 'top center'
        }}
      />

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
        
        {/* Left Column: Music Player */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1">
          <div className="text-center lg:text-left mb-4">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-pink drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] tracking-tighter">
              SYNTH<br/>SNAKE
            </h1>
            <p className="text-gray-400 font-mono text-sm mt-2">v1.0.0 // ONLINE</p>
          </div>
          
          <MusicPlayer />
          
          <div className="hidden lg:block mt-8 p-4 border border-gray-800 rounded-lg bg-black/40 backdrop-blur-sm">
            <h3 className="text-neon-purple font-mono text-sm mb-2 uppercase tracking-widest">System Log</h3>
            <div className="font-mono text-xs text-gray-500 space-y-1">
              <p>> Initializing neural audio engine...</p>
              <p>> Loading dummy AI tracks...</p>
              <p className="text-neon-cyan">> Audio subsystem ready.</p>
              <p>> Booting snake protocol...</p>
              <p className="text-neon-cyan">> Game engine ready.</p>
              <p className="animate-pulse text-white">> Awaiting user input_</p>
            </div>
          </div>
        </div>

        {/* Right Column: Game */}
        <div className="w-full lg:w-2/3 flex justify-center order-1 lg:order-2">
          <SnakeGame />
        </div>

      </div>
    </div>
  );
};

export default App;

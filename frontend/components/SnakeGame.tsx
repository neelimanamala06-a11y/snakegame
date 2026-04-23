import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';
import { NeonCard } from './NeonCard';
import { Trophy, RotateCcw, Play } from 'lucide-react';
import { useInterval } from '../hooks/useInterval';

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SNAKE_SPEED);
  const [hasStarted, setHasStarted] = useState(false);

  // Use refs to access latest state in event listeners without causing re-renders
  const directionRef = useRef(direction);
  const nextDirectionRef = useRef(direction); // Prevents rapid double-turn suicide

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection(Direction.UP);
    nextDirectionRef.current = Direction.UP;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SNAKE_SPEED);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setHasStarted(true);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default scrolling for arrow keys and space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' && hasStarted) {
      setIsPaused(prev => !prev);
      return;
    }

    if (isPaused || gameOver) return;

    const currentDir = nextDirectionRef.current;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir !== Direction.DOWN) nextDirectionRef.current = Direction.UP;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir !== Direction.UP) nextDirectionRef.current = Direction.DOWN;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir !== Direction.RIGHT) nextDirectionRef.current = Direction.LEFT;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir !== Direction.LEFT) nextDirectionRef.current = Direction.RIGHT;
        break;
    }
  }, [isPaused, gameOver, hasStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const currentDir = nextDirectionRef.current;
      setDirection(currentDir); // Sync state with ref for rendering if needed

      const newHead = { ...head };

      switch (currentDir) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      // Check wall collision
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
        setFood(generateFood(newSnake));
        // Don't pop the tail, so it grows
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [isPaused, gameOver, food, score, highScore]);

  useInterval(gameLoop, isPaused || gameOver ? null : speed);

  return (
    <NeonCard color="cyan" className="flex flex-col items-center gap-6 w-full max-w-2xl">
      {/* Header / Scoreboard */}
      <div className="w-full flex justify-between items-center px-4">
        <div className="flex flex-col">
          <span className="text-neon-cyan font-mono text-sm uppercase tracking-wider">Score</span>
          <span className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(5,217,232,0.8)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-neon-purple font-mono text-sm uppercase tracking-wider flex items-center gap-1">
            <Trophy size={14} /> High Score
          </span>
          <span className="text-xl font-bold text-gray-300">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative bg-black/50 border-2 border-gray-800 rounded-lg p-2 shadow-inner">
        {/* The Grid */}
        <div 
          className="relative bg-gray-950/80 rounded overflow-hidden"
          style={{
            width: '400px',
            height: '400px',
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {/* Render Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`
                  ${isHead ? 'bg-neon-cyan shadow-neon-cyan z-10 rounded-sm' : 'bg-cyan-700/80 rounded-sm scale-90'}
                  transition-all duration-75
                `}
                style={{
                  gridColumnStart: segment.x + 1,
                  gridRowStart: segment.y + 1,
                }}
              />
            );
          })}

          {/* Render Food */}
          <div
            className="bg-neon-pink shadow-neon-pink rounded-full animate-pulse scale-75"
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
            }}
          />
        </div>

        {/* Overlays */}
        {(!hasStarted || gameOver || (isPaused && hasStarted && !gameOver)) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-20">
            {!hasStarted ? (
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-neon-cyan drop-shadow-[0_0_10px_rgba(5,217,232,0.8)] mb-2">
                  NEON SNAKE
                </h2>
                <p className="text-gray-400 font-mono text-sm mb-6">Use Arrow Keys or WASD to move</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan rounded-full hover:bg-neon-cyan hover:text-black transition-all shadow-[0_0_15px_rgba(5,217,232,0.4)] hover:shadow-[0_0_25px_rgba(5,217,232,0.8)] font-bold tracking-wider"
                >
                  <Play size={20} fill="currentColor" /> START GAME
                </button>
              </div>
            ) : gameOver ? (
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-neon-pink drop-shadow-[0_0_10px_rgba(255,42,109,0.8)] mb-2">
                  SYSTEM FAILURE
                </h2>
                <p className="text-gray-300 font-mono text-lg">Final Score: {score}</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-neon-pink/20 border border-neon-pink text-neon-pink rounded-full hover:bg-neon-pink hover:text-white transition-all shadow-[0_0_15px_rgba(255,42,109,0.4)] hover:shadow-[0_0_25px_rgba(255,42,109,0.8)] font-bold tracking-wider"
                >
                  <RotateCcw size={20} /> REBOOT
                </button>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white tracking-widest mb-4">PAUSED</h2>
                <p className="text-gray-400 font-mono text-sm">Press SPACE to resume</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="text-gray-500 font-mono text-xs flex gap-4">
        <span>[SPACE] Pause/Resume</span>
        <span>[WASD/ARROWS] Move</span>
      </div>
    </NeonCard>
  );
};

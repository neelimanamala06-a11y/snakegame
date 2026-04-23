import { Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SNAKE_SPEED = 150; // ms per frame
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 50;

export const DUMMY_TRACKS: Track[] = [
  {
    id: 'trk-1',
    title: 'Neon Overdrive',
    artist: 'AI Synthwave Gen',
    duration: 185, // 3:05
    coverColor: 'from-neon-pink to-neon-purple'
  },
  {
    id: 'trk-2',
    title: 'Cybernetic Pulse',
    artist: 'Neural Network Audio',
    duration: 242, // 4:02
    coverColor: 'from-neon-cyan to-blue-600'
  },
  {
    id: 'trk-3',
    title: 'Digital Horizon',
    artist: 'Algorithm & Blues',
    duration: 210, // 3:30
    coverColor: 'from-neon-purple to-neon-cyan'
  }
];

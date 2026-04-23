import React from 'react';

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  color?: 'pink' | 'cyan' | 'purple';
}

export const NeonCard: React.FC<NeonCardProps> = ({ 
  children, 
  className = '', 
  color = 'cyan' 
}) => {
  const borderColors = {
    pink: 'border-neon-pink shadow-neon-pink',
    cyan: 'border-neon-cyan shadow-neon-cyan',
    purple: 'border-neon-purple shadow-neon-purple',
  };

  return (
    <div className={`
      bg-neon-dark/80 backdrop-blur-md 
      border-2 rounded-xl p-6
      ${borderColors[color]}
      ${className}
    `}>
      {children}
    </div>
  );
};

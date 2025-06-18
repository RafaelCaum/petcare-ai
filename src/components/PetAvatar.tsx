
import React from 'react';

interface PetAvatarProps {
  petType: 'dog' | 'cat';
  petName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PetAvatar: React.FC<PetAvatarProps> = ({ petType, petName, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl'
  };

  const emoji = petType === 'dog' ? '🐕' : '🐱';

  return (
    <div className={`pet-avatar ${sizeClasses[size]} ${className}`}>
      <span>{emoji}</span>
    </div>
  );
};

export default PetAvatar;

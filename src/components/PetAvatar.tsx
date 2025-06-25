
import React from 'react';
import { Pet } from '../types/pet';

interface PetAvatarProps {
  pet: Pet;
  size?: 'small' | 'medium' | 'large';
}

const PetAvatar: React.FC<PetAvatarProps> = ({ pet, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-lg',
    medium: 'w-12 h-12 text-2xl',
    large: 'w-16 h-16 text-3xl'
  };

  const defaultEmoji = pet.type === 'dog' ? '🐕' : '🐱';

  if (pet.photoUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex-shrink-0`}>
        <img
          src={pet.photoUrl}
          alt={pet.name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0`}>
      <span className="text-primary">{defaultEmoji}</span>
    </div>
  );
};

export default PetAvatar;

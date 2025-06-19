
import React from 'react';

interface PetAvatarProps {
  petType: 'dog' | 'cat';
  petName: string;
  size?: 'sm' | 'md' | 'lg';
  photoUrl?: string;
}

const PetAvatar: React.FC<PetAvatarProps> = ({ petType, petName, size = 'md', photoUrl }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl'
  };

  const defaultEmoji = petType === 'dog' ? '🐕' : '🐱';

  if (photoUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex-shrink-0`}>
        <img
          src={photoUrl}
          alt={petName}
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

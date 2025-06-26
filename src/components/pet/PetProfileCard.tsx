
import React from 'react';
import { Pet } from '../../types/pet';
import PetAvatar from '../PetAvatar';
import { Calendar, Weight, Palette, Users } from 'lucide-react';

interface PetProfileCardProps {
  pet: Pet;
}

const PetProfileCard: React.FC<PetProfileCardProps> = ({ pet }) => {
  const formatAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
    
    if (ageInMonths < 12) {
      return `${ageInMonths} meses`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const remainingMonths = ageInMonths % 12;
      if (remainingMonths === 0) {
        return `${years} ano${years > 1 ? 's' : ''}`;
      }
      return `${years} ano${years > 1 ? 's' : ''} e ${remainingMonths} meses`;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex items-center space-x-4 mb-4">
        <PetAvatar pet={pet} size="large" />
        <div>
          <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
            {pet.type === 'dog' ? '🐕 Cão' : '🐱 Gato'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 text-sm">
        {pet.birthDate && (
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2 text-blue-500" />
            <span>Idade: {formatAge(pet.birthDate)}</span>
          </div>
        )}
        
        {pet.breed && (
          <div className="flex items-center text-gray-600">
            <Users size={16} className="mr-2 text-green-500" />
            <span>Raça: {pet.breed}</span>
          </div>
        )}
        
        {pet.weight && (
          <div className="flex items-center text-gray-600">
            <Weight size={16} className="mr-2 text-purple-500" />
            <span>Peso: {pet.weight} kg</span>
          </div>
        )}
        
        {pet.color && (
          <div className="flex items-center text-gray-600">
            <Palette size={16} className="mr-2 text-orange-500" />
            <span>Cor: {pet.color}</span>
          </div>
        )}
        
        {pet.gender && (
          <div className="flex items-center text-gray-600">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
              pet.gender === 'male' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-pink-100 text-pink-800'
            }`}>
              {pet.gender === 'male' ? '♂ Macho' : '♀ Fêmea'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetProfileCard;

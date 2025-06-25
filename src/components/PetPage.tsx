
import React from 'react';
import { Pet } from '../types/pet';
import PetAvatar from './PetAvatar';
import { Calendar, Weight, Palette, Users } from 'lucide-react';

interface PetPageProps {
  pets: Pet[];
  onEditPet: (pet: Pet) => void;
}

const PetPage: React.FC<PetPageProps> = ({ pets, onEditPet }) => {
  console.log('PetPage rendering with pets:', pets);

  if (pets.length === 0) {
    return (
      <div className="space-y-6 pb-20 animate-fade-in">
        <div className="bg-gray-100 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">🐕</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Nenhum pet cadastrado</h2>
          <p className="text-gray-500">Adicione seu primeiro pet para começar!</p>
        </div>
      </div>
    );
  }

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
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Meus Pets</h1>
        <p className="text-gray-600">Gerencie as informações dos seus pets</p>
      </div>

      <div className="grid gap-4">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onEditPet(pet)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <PetAvatar pet={pet} size="large" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800 truncate">
                    {pet.name}
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {pet.type === 'dog' ? '🐕 Cão' : '🐱 Gato'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {pet.birthDate && (
                    <div className="flex items-center text-gray-600">
                      <Calendar size={16} className="mr-2 text-blue-500" />
                      <span>{formatAge(pet.birthDate)}</span>
                    </div>
                  )}
                  
                  {pet.breed && (
                    <div className="flex items-center text-gray-600">
                      <Users size={16} className="mr-2 text-green-500" />
                      <span className="truncate">{pet.breed}</span>
                    </div>
                  )}
                  
                  {pet.weight && (
                    <div className="flex items-center text-gray-600">
                      <Weight size={16} className="mr-2 text-purple-500" />
                      <span>{pet.weight} kg</span>
                    </div>
                  )}
                  
                  {pet.color && (
                    <div className="flex items-center text-gray-600">
                      <Palette size={16} className="mr-2 text-orange-500" />
                      <span className="truncate">{pet.color}</span>
                    </div>
                  )}
                </div>
                
                {pet.gender && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      pet.gender === 'male' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-pink-100 text-pink-800'
                    }`}>
                      {pet.gender === 'male' ? '♂ Macho' : '♀ Fêmea'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-shrink-0 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetPage;


import React, { useState } from 'react';
import { Pet, Vaccination } from '../types/pet';
import PetAvatar from './PetAvatar';
import PetProfileCard from './pet/PetProfileCard';
import PetVaccinationsTab from './pet/PetVaccinationsTab';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface PetPageProps {
  pets: Pet[];
  vaccinations: Vaccination[];
  onEditPet: (pet?: Pet) => void;
  onAddVaccination: () => void;
  onDeleteVaccination: (vaccinationId: string) => Promise<void>;
  onDeletePet: (petId: string) => Promise<void>;
}

const PetPage: React.FC<PetPageProps> = ({ 
  pets, 
  vaccinations,
  onEditPet,
  onAddVaccination,
  onDeleteVaccination,
  onDeletePet
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(pets[0] || null);

  const handleDeletePet = async (pet: Pet, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir ${pet.name}?`)) {
      await onDeletePet(pet.id);
    }
  };

  const handleEditPet = (pet: Pet, e: React.MouseEvent) => {
    e.stopPropagation();
    onEditPet(pet);
  };

  const petVaccinations = selectedPet ? vaccinations.filter(v => v.petId === selectedPet.id) : [];

  if (pets.length === 0) {
    return (
      <div className="space-y-6 pb-20 animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Meus Pets</h1>
          <p className="text-gray-600">Gerencie as informações dos seus pets</p>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => onEditPet()}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Add Pet
          </button>
        </div>

        <div className="bg-gray-100 rounded-2xl p-8 text-center shadow-lg">
          <div className="text-6xl mb-4">🐕</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Nenhum pet cadastrado</h2>
          <p className="text-gray-500">Adicione seu primeiro pet para começar!</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    if (!selectedPet) return null;

    switch (activeTab) {
      case 'profile':
        return <PetProfileCard pet={selectedPet} />;
      case 'vaccinations':
        return (
          <PetVaccinationsTab
            vaccinations={petVaccinations}
            onAddVaccination={onAddVaccination}
            onDeleteVaccination={onDeleteVaccination}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Meus Pets</h1>
        <p className="text-gray-600">Gerencie as informações dos seus pets</p>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => onEditPet()}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Add Pet
        </button>
        {selectedPet && (
          <>
            <button
              onClick={(e) => handleEditPet(selectedPet, e)}
              className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Edit size={20} />
              Edit
            </button>
            <button
              onClick={(e) => handleDeletePet(selectedPet, e)}
              className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Trash2 size={20} />
              Delete
            </button>
          </>
        )}
      </div>

      <div className="grid gap-4 mb-6">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className={`bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer border ${
              selectedPet?.id === pet.id 
                ? 'border-blue-500 ring-2 ring-blue-200 shadow-xl' 
                : 'border-gray-100'
            }`}
            onClick={() => setSelectedPet(pet)}
          >
            <div className="flex items-center space-x-4">
              <PetAvatar pet={pet} size="medium" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{pet.name}</h3>
                <p className="text-sm text-gray-500">
                  {pet.type === 'dog' ? '🐕 Cão' : '🐱 Gato'}
                  {pet.breed && ` • ${pet.breed}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPet && (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'vaccinations', label: 'Vaccinations', icon: '💉' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          
          <div>
            {renderTabContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default PetPage;

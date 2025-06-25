
import React, { useState } from 'react';
import { Pet } from '../types/pet';
import PetAvatar from './PetAvatar';
import { Calendar, Weight, Palette, Users, Plus, Edit, Trash2 } from 'lucide-react';

interface PetPageProps {
  pets: Pet[];
  onEditPet: (pet?: Pet) => void;
  onAddVaccination: () => void;
  onDeleteVaccination: (vaccinationId: string) => Promise<void>;
  onDeletePet: (petId: string) => Promise<void>;
}

const PetPage: React.FC<PetPageProps> = ({ 
  pets, 
  onEditPet,
  onAddVaccination,
  onDeleteVaccination,
  onDeletePet
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(pets[0] || null);

  console.log('PetPage rendering with pets:', pets);

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

  if (pets.length === 0) {
    return (
      <div className="space-y-6 pb-20 animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Meus Pets</h1>
          <p className="text-gray-600">Gerencie as informações dos seus pets</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => onEditPet()}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Pet
          </button>
        </div>

        <div className="bg-gray-100 rounded-2xl p-8 text-center">
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
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4 mb-4">
              <PetAvatar pet={selectedPet} size="large" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedPet.name}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {selectedPet.type === 'dog' ? '🐕 Cão' : '🐱 Gato'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 text-sm">
              {selectedPet.birthDate && (
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2 text-blue-500" />
                  <span>Idade: {formatAge(selectedPet.birthDate)}</span>
                </div>
              )}
              
              {selectedPet.breed && (
                <div className="flex items-center text-gray-600">
                  <Users size={16} className="mr-2 text-green-500" />
                  <span>Raça: {selectedPet.breed}</span>
                </div>
              )}
              
              {selectedPet.weight && (
                <div className="flex items-center text-gray-600">
                  <Weight size={16} className="mr-2 text-purple-500" />
                  <span>Peso: {selectedPet.weight} kg</span>
                </div>
              )}
              
              {selectedPet.color && (
                <div className="flex items-center text-gray-600">
                  <Palette size={16} className="mr-2 text-orange-500" />
                  <span>Cor: {selectedPet.color}</span>
                </div>
              )}
              
              {selectedPet.gender && (
                <div className="flex items-center text-gray-600">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    selectedPet.gender === 'male' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-pink-100 text-pink-800'
                  }`}>
                    {selectedPet.gender === 'male' ? '♂ Macho' : '♀ Fêmea'}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'vaccinations':
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vacinações</h3>
            <div className="text-center py-8">
              <div className="text-4xl mb-2">💉</div>
              <p className="text-gray-500">Nenhuma vacinação registrada</p>
              <button
                onClick={onAddVaccination}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar Vacinação
              </button>
            </div>
          </div>
        );
      
      case 'vet-directory':
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Diretório Veterinário</h3>
            <div className="space-y-4">
              {[
                { name: 'Clínica Veterinária PetCare', address: 'Rua das Flores, 123', phone: '(11) 1234-5678', emergency: true },
                { name: 'Hospital Veterinário Animal Life', address: 'Av. Principal, 456', phone: '(11) 2345-6789', emergency: true },
                { name: 'Vet Center 24h', address: 'Rua do Pet, 789', phone: '(11) 3456-7890', emergency: true }
              ].map((vet, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{vet.name}</h4>
                    {vet.emergency && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        24h
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{vet.address}</p>
                  <p className="text-sm text-blue-600">{vet.phone}</p>
                </div>
              ))}
            </div>
          </div>
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

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => onEditPet()}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Pet
        </button>
        {selectedPet && (
          <>
            <button
              onClick={(e) => handleEditPet(selectedPet, e)}
              className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <Edit size={20} />
              Edit
            </button>
            <button
              onClick={(e) => handleDeletePet(selectedPet, e)}
              className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={20} />
              Delete
            </button>
          </>
        )}
      </div>

      {/* Pet Cards */}
      <div className="grid gap-4 mb-6">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className={`bg-white rounded-2xl p-4 shadow-sm border transition-all cursor-pointer ${
              selectedPet?.id === pet.id 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : 'border-gray-100 hover:shadow-md'
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

      {/* Tabs */}
      {selectedPet && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'vaccinations', label: 'Vaccinations', icon: '💉' },
              { id: 'vet-directory', label: 'Vet Directory', icon: '🏥' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default PetPage;

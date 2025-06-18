
import React, { useState } from 'react';
import { Edit, Plus, Calendar, MapPin, Book } from 'lucide-react';
import PetAvatar from './PetAvatar';
import { Pet, Vaccination } from '../types/pet';

interface PetPageProps {
  pet: Pet | null;
  vaccinations: Vaccination[];
  onEditPet: () => void;
  onAddVaccination: () => void;
}

const PetPage: React.FC<PetPageProps> = ({ pet, vaccinations, onEditPet, onAddVaccination }) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'vaccinations' | 'directory'>('profile');

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    
    if (ageInMonths < 12) {
      return `${ageInMonths} months`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      return months > 0 ? `${years} years, ${months} months` : `${years} years`;
    }
  };

  const getVaccinationStatus = (vaccination: Vaccination) => {
    const nextDue = new Date(vaccination.nextDueDate);
    const today = new Date();
    const daysDiff = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return { status: 'overdue', color: 'text-danger' };
    if (daysDiff <= 30) return { status: 'due soon', color: 'text-warning' };
    return { status: 'up to date', color: 'text-success' };
  };

  if (!pet) {
    return (
      <div className="flex items-center justify-center h-64 pb-20">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-xl font-semibold mb-2">No Pet Profile</h2>
          <p className="text-gray-600 mb-4">Create your pet's profile to get started</p>
          <button
            onClick={onEditPet}
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
          >
            Create Pet Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Navigation Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveSection('profile')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeSection === 'profile' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveSection('vaccinations')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeSection === 'vaccinations' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Vaccinations
        </button>
        <button
          onClick={() => setActiveSection('directory')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeSection === 'directory' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Vet Directory
        </button>
      </div>

      {/* Pet Profile Section */}
      {activeSection === 'profile' && (
        <div className="space-y-6">
          {/* Pet Info Card */}
          <div className="pet-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Pet Profile</h2>
              <button
                onClick={onEditPet}
                className="flex items-center text-primary hover:text-primary-dark transition-colors"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </button>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <PetAvatar petType={pet.type} petName={pet.name} size="lg" />
              <div>
                <h3 className="text-xl font-bold">{pet.name}</h3>
                <p className="text-gray-600 capitalize">{pet.type} • {pet.breed}</p>
                <p className="text-sm text-gray-500">{calculateAge(pet.birthDate)} old</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-sm text-gray-600">Birthday</div>
                <div className="font-medium">
                  {new Date(pet.birthDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-sm text-gray-600">Gender</div>
                <div className="font-medium capitalize">{pet.gender || 'Not specified'}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-sm text-gray-600">Weight</div>
                <div className="font-medium">{pet.weight ? `${pet.weight} lbs` : 'Not specified'}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-sm text-gray-600">Color</div>
                <div className="font-medium">{pet.color || 'Not specified'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vaccinations Section */}
      {activeSection === 'vaccinations' && (
        <div className="space-y-6">
          <div className="pet-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center">
                <Book className="mr-2 text-primary" size={20} />
                Vaccination Records
              </h2>
              <button
                onClick={onAddVaccination}
                className="flex items-center text-primary hover:text-primary-dark transition-colors"
              >
                <Plus size={16} className="mr-1" />
                Add
              </button>
            </div>

            {vaccinations.length > 0 ? (
              <div className="space-y-4">
                {vaccinations.map((vaccination) => {
                  const status = getVaccinationStatus(vaccination);
                  return (
                    <div key={vaccination.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{vaccination.vaccineName}</h3>
                        <span className={`text-sm font-medium ${status.color}`}>
                          {status.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Given: {new Date(vaccination.dateGiven).toLocaleDateString()}</p>
                        <p>Next Due: {new Date(vaccination.nextDueDate).toLocaleDateString()}</p>
                        {vaccination.veterinarian && (
                          <p>Vet: {vaccination.veterinarian}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Book size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No vaccination records</p>
                <p className="text-sm">Add your pet's vaccination history</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vet Directory Section */}
      {activeSection === 'directory' && (
        <div className="space-y-6">
          <div className="pet-card">
            <div className="flex items-center mb-6">
              <MapPin className="mr-2 text-primary" size={20} />
              <h2 className="text-lg font-semibold">Veterinarian Directory</h2>
            </div>
            
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🏥</div>
              <h3 className="text-lg font-semibold mb-2">Find Nearby Vets</h3>
              <p className="text-gray-600 mb-4">
                This feature will help you find trusted veterinarians in your area
              </p>
              <div className="bg-accent/20 border border-accent/30 rounded-xl p-4">
                <p className="text-sm text-accent-foreground">
                  🚀 Coming Soon in Premium Plan
                </p>
              </div>
            </div>
          </div>

          {/* Emergency SOS */}
          <div className="pet-card bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-3">🚨 Emergency SOS</h3>
            <p className="text-red-700 text-sm mb-4">
              In case of pet emergency, call your nearest 24/7 vet clinic
            </p>
            <button className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors">
              Find Emergency Vet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetPage;

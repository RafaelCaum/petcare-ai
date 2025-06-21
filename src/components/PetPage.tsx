import React, { useState } from 'react';
import { Edit, Plus, Calendar, MapPin, Book, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import PetAvatar from './PetAvatar';
import EmergencyVetFinder from './EmergencyVetFinder';
import { Pet, Vaccination } from '../types/pet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';

interface PetPageProps {
  pets: Pet[];
  vaccinations: Vaccination[];
  onEditPet: (pet?: Pet) => void;
  onAddVaccination: () => void;
  onDeleteVaccination?: (vaccinationId: string) => void;
  onDeletePet?: (petId: string) => void;
}

const PetPage: React.FC<PetPageProps> = ({ 
  pets, 
  vaccinations, 
  onEditPet, 
  onAddVaccination, 
  onDeleteVaccination,
  onDeletePet 
}) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'vaccinations' | 'directory'>('profile');
  const [emergencyVetFinderOpen, setEmergencyVetFinderOpen] = useState(false);
  const [currentPetIndex, setCurrentPetIndex] = useState(0);

  const currentPet = pets[currentPetIndex];

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

  const currentPetVaccinations = vaccinations.filter(v => v.petId === currentPet?.id);

  const nextPet = () => {
    if (currentPetIndex < pets.length - 1) {
      setCurrentPetIndex(currentPetIndex + 1);
    }
  };

  const prevPet = () => {
    if (currentPetIndex > 0) {
      setCurrentPetIndex(currentPetIndex - 1);
    }
  };

  if (pets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 pb-20">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-xl font-semibold mb-2">No Pet Profile</h2>
          <p className="text-gray-600 mb-4">Create your pet's profile to get started</p>
          <button
            onClick={() => onEditPet()}
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
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEditPet()}
                  className="flex items-center text-primary hover:text-primary-dark transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Add Pet
                </button>
                {currentPet && (
                  <>
                    <button
                      onClick={() => onEditPet(currentPet)}
                      className="flex items-center text-primary hover:text-primary-dark transition-colors"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                    {onDeletePet && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Pet</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {currentPet.name}? This will also delete all associated vaccinations, reminders, and expenses. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeletePet(currentPet.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {/* Pet Navigation */}
            {pets.length > 1 && (
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevPet}
                  disabled={currentPetIndex === 0}
                  className="p-2 rounded-full bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm text-gray-600">
                  {currentPetIndex + 1} of {pets.length}
                </span>
                <button
                  onClick={nextPet}
                  disabled={currentPetIndex === pets.length - 1}
                  className="p-2 rounded-full bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-4 mb-6">
              <PetAvatar 
                petType={currentPet.type} 
                petName={currentPet.name} 
                size="lg" 
                photoUrl={currentPet.photoUrl}
              />
              <div>
                <h3 className="text-xl font-bold">{currentPet.name}</h3>
                <p className="text-gray-600 capitalize">{currentPet.type} • {currentPet.breed}</p>
                <p className="text-sm text-gray-500">{calculateAge(currentPet.birthDate)} old</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-sm text-gray-600">Birthday</div>
                <div className="font-medium">
                  {new Date(currentPet.birthDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-sm text-gray-600">Gender</div>
                <div className="font-medium capitalize">{currentPet.gender || 'Not specified'}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-sm text-gray-600">Weight</div>
                <div className="font-medium">{currentPet.weight ? `${currentPet.weight} lbs` : 'Not specified'}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-sm text-gray-600">Color</div>
                <div className="font-medium">{currentPet.color || 'Not specified'}</div>
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

            {currentPetVaccinations.length > 0 ? (
              <div className="space-y-4">
                {currentPetVaccinations.map((vaccination) => {
                  const status = getVaccinationStatus(vaccination);
                  return (
                    <div key={vaccination.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{vaccination.vaccineName}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${status.color}`}>
                            {status.status}
                          </span>
                          {onDeleteVaccination && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                  <Trash2 size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Vaccination Record</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this vaccination record for {vaccination.vaccineName}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onDeleteVaccination(vaccination.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
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
                  🚀 Coming Soon - Feature in Development
                </p>
              </div>
            </div>
          </div>

          {/* Emergency SOS */}
          <div className="pet-card bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-3">🚨 Emergency SOS</h3>
            <p className="text-red-700 text-sm mb-4">
              In case of emergency, find veterinarians near your location
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setEmergencyVetFinderOpen(true)}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Find Emergency Vet
              </button>
              
              {/* Support Contact */}
              <div className="text-center text-sm text-red-700">
                <p className="font-medium">Need help? Contact support:</p>
                <p>📞 +1 754-215-1258</p>
                <p>📧 support@petcareapp.info</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Vet Finder Modal */}
      <EmergencyVetFinder 
        isOpen={emergencyVetFinderOpen} 
        onClose={() => setEmergencyVetFinderOpen(false)} 
      />
    </div>
  );
};

export default PetPage;

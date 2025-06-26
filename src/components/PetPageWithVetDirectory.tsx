
import React, { useState } from 'react';
import { Plus, Edit3, Trash2, MapPin, Calendar, Syringe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PetAvatar from './PetAvatar';
import VetDirectoryMap from './VetDirectoryMap';
import { Pet, Vaccination } from '../types/pet';

interface PetPageWithVetDirectoryProps {
  pets: Pet[];
  vaccinations: Vaccination[];
  onEditPet: (pet?: Pet) => void;
  onAddVaccination: () => void;
  onDeleteVaccination: (id: string) => void;
  onDeletePet: (id: string) => void;
}

const PetPageWithVetDirectory: React.FC<PetPageWithVetDirectoryProps> = ({
  pets,
  vaccinations,
  onEditPet,
  onAddVaccination,
  onDeleteVaccination,
  onDeletePet
}) => {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(pets[0]?.id || null);

  const selectedPet = pets.find(pet => pet.id === selectedPetId) || pets[0];
  const petVaccinations = vaccinations.filter(v => v.petId === selectedPet?.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getVaccinationStatus = (vaccination: Vaccination) => {
    const today = new Date();
    const dueDate = new Date(vaccination.nextDueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'overdue', color: 'text-red-600', bg: 'bg-red-100' };
    } else if (diffDays <= 7) {
      return { status: 'due soon', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    } else {
      return { status: 'upcoming', color: 'text-blue-600', bg: 'bg-blue-100' };
    }
  };

  if (pets.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Your First Pet</h2>
          <p className="text-gray-600 mb-6">Start managing your pet's health and care</p>
          <Button onClick={() => onEditPet()} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Pet
          </Button>
        </div>
        
        <div className="mt-8">
          <VetDirectoryMap />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Pet Profile</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="vets">Nearby Vets</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          {/* Pet Selector */}
          {pets.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {pets.map((pet) => (
                <Button
                  key={pet.id}
                  variant={selectedPetId === pet.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPetId(pet.id)}
                  className="whitespace-nowrap"
                >
                  {pet.avatar} {pet.name}
                </Button>
              ))}
            </div>
          )}

          {/* Pet Profile Card */}
          {selectedPet && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <PetAvatar pet={selectedPet} size="large" />
                </div>
                <CardTitle className="text-2xl">{selectedPet.name}</CardTitle>
                <p className="text-gray-600 capitalize">{selectedPet.breed} • {selectedPet.type}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Age:</span>
                    <p>{new Date().getFullYear() - new Date(selectedPet.birthDate).getFullYear()} years</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Weight:</span>
                    <p>{selectedPet.weight}kg</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Color:</span>
                    <p className="capitalize">{selectedPet.color}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Gender:</span>
                    <p className="capitalize">{selectedPet.gender}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditPet(selectedPet)}
                    className="flex-1"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDeletePet(selectedPet.id)}
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Pet Button */}
          <Button onClick={() => onEditPet()} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Pet
          </Button>
        </TabsContent>

        <TabsContent value="vaccinations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Vaccination History</h3>
            <Button onClick={onAddVaccination} size="sm">
              <Syringe className="w-4 h-4 mr-2" />
              Add Vaccination
            </Button>
          </div>

          {petVaccinations.length === 0 ? (
            <div className="text-center py-8">
              <Syringe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No vaccinations recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {petVaccinations.map((vaccination) => {
                const statusInfo = getVaccinationStatus(vaccination);
                return (
                  <Card key={vaccination.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{vaccination.vaccineName}</h4>
                          <div className="text-sm text-gray-600 mt-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Given: {formatDate(vaccination.dateGiven)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Next: {formatDate(vaccination.nextDueDate)}</span>
                            </div>
                            {vaccination.veterinarian && (
                              <p>Vet: Dr. {vaccination.veterinarian}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                            {statusInfo.status}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteVaccination(vaccination.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="vets" className="space-y-4">
          <VetDirectoryMap />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PetPageWithVetDirectory;

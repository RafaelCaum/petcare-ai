
import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown, Check, Clock, AlertTriangle } from 'lucide-react';
import { Pet, Vaccination } from '../../types/pet';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface VaccinationCalendarProps {
  pets: Pet[];
  vaccinations: Vaccination[];
  onMarkCompleted: (vaccinationId: string) => void;
}

const VaccinationCalendar: React.FC<VaccinationCalendarProps> = ({
  pets,
  vaccinations,
  onMarkCompleted,
}) => {
  const [selectedPetId, setSelectedPetId] = useState<string>('all');

  const getVaccinationStatus = (vaccination: Vaccination) => {
    const nextDue = new Date(vaccination.nextDueDate);
    const today = new Date();
    const daysDiff = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return { 
        status: 'overdue', 
        variant: 'destructive' as const,
        text: `${Math.abs(daysDiff)} dias atrasado`,
        icon: AlertTriangle,
        color: 'text-red-600'
      };
    }
    if (daysDiff <= 7) {
      return { 
        status: 'due-soon', 
        variant: 'secondary' as const,
        text: daysDiff === 0 ? 'Vence hoje' : `${daysDiff} dias restantes`,
        icon: Clock,
        color: 'text-yellow-600'
      };
    }
    return { 
      status: 'up-to-date', 
      variant: 'outline' as const,
      text: `${daysDiff} dias restantes`,
      icon: Check,
      color: 'text-green-600'
    };
  };

  const filteredVaccinations = useMemo(() => {
    const filtered = selectedPetId === 'all' 
      ? vaccinations 
      : vaccinations.filter(v => v.petId === selectedPetId);
    
    return filtered
      .map(vaccination => ({
        ...vaccination,
        statusInfo: getVaccinationStatus(vaccination)
      }))
      .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());
  }, [vaccinations, selectedPetId]);

  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : 'Pet desconhecido';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Calendar className="mr-2 text-blue-600" size={24} />
          Calendário de Vacinas
        </h2>
      </div>

      <div className="mb-4">
        <Select value={selectedPetId} onValueChange={setSelectedPetId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um pet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os pets</SelectItem>
            {pets.map((pet) => (
              <SelectItem key={pet.id} value={pet.id}>
                {pet.avatar} {pet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredVaccinations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
            <p>Nenhuma vacina encontrada</p>
            <p className="text-sm">Cadastre vacinas para seus pets!</p>
          </div>
        ) : (
          filteredVaccinations.map((vaccination) => {
            const StatusIcon = vaccination.statusInfo.icon;
            return (
              <div key={vaccination.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <StatusIcon className={`w-5 h-5 ${vaccination.statusInfo.color}`} />
                  <div>
                    <div className="font-medium">{vaccination.vaccineName}</div>
                    <div className="text-sm text-gray-600">
                      {getPetName(vaccination.petId)} • {new Date(vaccination.nextDueDate).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={vaccination.statusInfo.variant}>
                    {vaccination.statusInfo.text}
                  </Badge>
                  {(vaccination.statusInfo.status === 'overdue' || vaccination.statusInfo.status === 'due-soon') && (
                    <Button 
                      size="sm" 
                      onClick={() => onMarkCompleted(vaccination.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check size={16} className="mr-1" />
                      Marcar como feita
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VaccinationCalendar;

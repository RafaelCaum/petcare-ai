
import React, { useEffect } from 'react';
import { Vaccination, Pet } from '../types/pet';

interface ZapierIntegrationProps {
  vaccinations: Vaccination[];
  pets: Pet[];
  userEmail: string | null;
}

const ZapierIntegration: React.FC<ZapierIntegrationProps> = ({ vaccinations, pets, userEmail }) => {
  
  // Check for upcoming vaccinations and send reminder emails
  useEffect(() => {
    const checkUpcomingVaccinations = () => {
      if (!userEmail) return;

      const today = new Date();
      const todayString = today.toISOString().split('T')[0];

      // Find vaccinations due today
      const vaccinationsDueToday = vaccinations.filter(v => v.nextDueDate === todayString);

      vaccinationsDueToday.forEach(async (vaccination) => {
        const pet = pets.find(p => p.id === vaccination.petId);
        
        if (pet) {
          // Log reminder data (in a real implementation, you would store webhook URLs per user)
          const reminderData = {
            type: "vaccination_reminder",
            petName: pet.name,
            vaccineName: vaccination.vaccineName,
            dueDate: vaccination.nextDueDate,
            veterinarian: vaccination.veterinarian,
            userEmail: userEmail,
            timestamp: new Date().toISOString(),
            emailSubject: "Lembrete: Hoje é dia de vacina!",
            emailBody: `Olá! Hoje é o dia de aplicar a vacina '${vaccination.vaccineName}' no seu pet ${pet.name}. Consulte seu veterinário para garantir a proteção.`
          };

          console.log('Vaccination due today - reminder data:', reminderData);
          // Here you would send to a stored Zapier webhook for reminders
          // For now, we just log the data
        }
      });
    };

    // Check on component mount and then every hour
    checkUpcomingVaccinations();
    const interval = setInterval(checkUpcomingVaccinations, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, [vaccinations, pets, userEmail]);

  return null; // This is a utility component with no UI
};

export default ZapierIntegration;

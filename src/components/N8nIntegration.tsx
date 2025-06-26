
import React, { useEffect } from 'react';
import { Vaccination, Pet } from '../types/pet';

interface N8nIntegrationProps {
  vaccinations: Vaccination[];
  pets: Pet[];
  userEmail: string | null;
}

const N8nIntegration: React.FC<N8nIntegrationProps> = ({ vaccinations, pets, userEmail }) => {
  
  // Check for upcoming vaccinations and send reminder via n8n
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
          // Data that would be sent to n8n webhook
          const reminderData = {
            type: "vaccination_reminder",
            petName: pet.name,
            petBreed: pet.breed,
            petType: pet.type,
            vaccineName: vaccination.vaccineName,
            dueDate: vaccination.nextDueDate,
            veterinarian: vaccination.veterinarian,
            userEmail: userEmail,
            timestamp: new Date().toISOString(),
            petTemperament: pet.temperamento,
            petVaccinationStatus: pet.vacinadoStatus
          };

          console.log('Vaccination reminder data for n8n:', reminderData);
          
          // Here you would send to your configured n8n webhook for reminders
          try {
            // const response = await fetch('YOUR_N8N_WEBHOOK_URL', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(reminderData)
            // });
            console.log('Would send vaccination reminder to n8n');
          } catch (error) {
            console.error('Error sending to n8n:', error);
          }
        }
      });
    };

    // Check on component mount and then every hour
    checkUpcomingVaccinations();
    const interval = setInterval(checkUpcomingVaccinations, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [vaccinations, pets, userEmail]);

  return null; // This is a utility component with no UI
};

export default N8nIntegration;

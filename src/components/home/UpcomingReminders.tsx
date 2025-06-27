
import React from 'react';
import { Bell, Calendar, Syringe, Scissors, Pill } from 'lucide-react';
import { Pet, Reminder, Vaccination } from '../../types/pet';
import { Badge } from '../ui/badge';

interface UpcomingRemindersProps {
  pets: Pet[];
  reminders: Reminder[];
  vaccinations: Vaccination[];
}

const UpcomingReminders: React.FC<UpcomingRemindersProps> = ({
  pets,
  reminders,
  vaccinations,
}) => {
  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : 'Pet desconhecido';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccine':
        return Syringe;
      case 'grooming':
        return Scissors;
      case 'medication':
        return Pill;
      default:
        return Calendar;
    }
  };

  // Combinar lembretes e vacinas próximas
  const upcomingEvents = React.useMemo(() => {
    const events: Array<{
      id: string;
      title: string;
      date: string;
      type: string;
      petId: string;
      isVaccination?: boolean;
    }> = [];

    // Adicionar lembretes
    reminders.forEach(reminder => {
      events.push({
        id: reminder.id,
        title: reminder.title,
        date: reminder.date,
        type: reminder.type,
        petId: reminder.petId,
        isVaccination: false,
      });
    });

    // Adicionar vacinas próximas (próximos 30 dias)
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    vaccinations.forEach(vaccination => {
      const nextDue = new Date(vaccination.nextDueDate);
      if (nextDue <= thirtyDaysFromNow) {
        events.push({
          id: vaccination.id,
          title: vaccination.vaccineName,
          date: vaccination.nextDueDate,
          type: 'vaccine',
          petId: vaccination.petId,
          isVaccination: true,
        });
      }
    });

    // Ordenar por data e pegar os 5 primeiros
    return events
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [reminders, vaccinations]);

  const getDateStatus = (date: string) => {
    const eventDate = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return { text: 'Atrasado', variant: 'destructive' as const };
    if (diffDays === 0) return { text: 'Hoje', variant: 'default' as const };
    if (diffDays <= 3) return { text: `Em ${diffDays} dias`, variant: 'secondary' as const };
    return { text: `Em ${diffDays} dias`, variant: 'outline' as const };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Bell className="mr-2 text-blue-600" size={24} />
          Próximos Lembretes
        </h2>
      </div>

      <div className="space-y-3">
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell size={48} className="mx-auto mb-3 text-gray-300" />
            <p>Nenhum lembrete próximo</p>
            <p className="text-sm">Você está em dia!</p>
          </div>
        ) : (
          upcomingEvents.map((event) => {
            const TypeIcon = getTypeIcon(event.type);
            const dateStatus = getDateStatus(event.date);
            
            return (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <TypeIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-600">
                      {getPetName(event.petId)} • {new Date(event.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={dateStatus.variant}>
                    {dateStatus.text}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {event.type === 'vaccine' ? 'Vacina' : 
                     event.type === 'grooming' ? 'Tosa' :
                     event.type === 'medication' ? 'Medicação' : event.type}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UpcomingReminders;

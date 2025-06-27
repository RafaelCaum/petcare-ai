
import React from 'react';
import { Pet, Reminder, Expense, Vaccination } from '../types/pet';
import VaccinationCalendar from './home/VaccinationCalendar';
import UpcomingReminders from './home/UpcomingReminders';
import RecentExpenses from './home/RecentExpenses';

interface HomeTabProps {
  pets: Pet[];
  reminders: Reminder[];
  expenses: Expense[];
  vaccinations: Vaccination[];
  onMarkVaccinationCompleted: (vaccinationId: string) => void;
  onNavigateToExpenses: () => void;
}

const HomeTab: React.FC<HomeTabProps> = ({
  pets,
  reminders,
  expenses,
  vaccinations,
  onMarkVaccinationCompleted,
  onNavigateToExpenses,
}) => {
  // Mostrar mensagem de boas-vindas se não há pets
  if (pets.length === 0) {
    return (
      <div className="space-y-6 pb-20 animate-fade-in">
        {/* Logo */}
        <div className="text-center py-6">
          <img 
            src="/lovable-uploads/37225868-33f4-46a9-a18a-13e3f2174f41.png" 
            alt="PetCare AI - Two cute dogs"
            className="w-32 h-32 mx-auto rounded-2xl shadow-gentle object-cover"
          />
        </div>

        <div className="text-center py-8">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-xl font-semibold mb-2">Bem-vindo ao PetCare AI</h2>
          <p className="text-gray-600 mb-4">Adicione seu primeiro pet para começar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Logo */}
      <div className="text-center py-6">
        <img 
          src="/lovable-uploads/37225868-33f4-46a9-a18a-13e3f2174f41.png" 
          alt="PetCare AI - Two cute dogs"
          className="w-32 h-32 mx-auto rounded-2xl shadow-gentle object-cover"
        />
      </div>

      {/* Calendário de Vacinas */}
      <VaccinationCalendar
        pets={pets}
        vaccinations={vaccinations}
        onMarkCompleted={onMarkVaccinationCompleted}
      />

      {/* Próximos Lembretes */}
      <UpcomingReminders
        pets={pets}
        reminders={reminders}
        vaccinations={vaccinations}
      />

      {/* Despesas Recentes */}
      <RecentExpenses
        pets={pets}
        expenses={expenses}
        onViewAll={onNavigateToExpenses}
      />
    </div>
  );
};

export default HomeTab;

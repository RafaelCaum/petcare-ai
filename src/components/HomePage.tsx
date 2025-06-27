
import React, { useState } from 'react';
import { Pet, Reminder, Expense, Vaccination } from '../types/pet';
import HomeTab from './HomeTab';

interface HomePageProps {
  pets: Pet[];
  reminders: Reminder[];
  expenses: Expense[];
  vaccinations: Vaccination[];
  onAddReminder: () => void;
  onAddExpense: () => void;
  onMarkVaccinationCompleted?: (vaccinationId: string) => void;
  onNavigateToExpenses?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  pets, 
  reminders, 
  expenses, 
  vaccinations, 
  onAddReminder, 
  onAddExpense,
  onMarkVaccinationCompleted,
  onNavigateToExpenses
}) => {
  const handleMarkVaccinationCompleted = (vaccinationId: string) => {
    if (onMarkVaccinationCompleted) {
      onMarkVaccinationCompleted(vaccinationId);
    }
  };

  const handleNavigateToExpenses = () => {
    if (onNavigateToExpenses) {
      onNavigateToExpenses();
    }
  };

  return (
    <HomeTab
      pets={pets}
      reminders={reminders}
      expenses={expenses}
      vaccinations={vaccinations}
      onMarkVaccinationCompleted={handleMarkVaccinationCompleted}
      onNavigateToExpenses={handleNavigateToExpenses}
    />
  );
};

export default HomePage;

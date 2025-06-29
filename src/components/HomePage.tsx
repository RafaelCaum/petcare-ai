import React, { useState } from 'react';
import { Plus, Calendar, DollarSign, Activity, Syringe, Check, Clock } from 'lucide-react';
import PetAvatar from './PetAvatar';
import { Pet, Reminder, Expense, Vaccination } from '../types/pet';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
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

interface HomePageProps {
  pets: Pet[];
  reminders: Reminder[];
  expenses: Expense[];
  vaccinations: Vaccination[];
  onAddReminder: () => void;
  onAddExpense: () => void;
  onMarkVaccinationCompleted?: (vaccinationId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  pets, 
  reminders, 
  expenses, 
  vaccinations, 
  onAddReminder, 
  onAddExpense,
  onMarkVaccinationCompleted 
}) => {
  const [selectedVaccination, setSelectedVaccination] = useState<string | null>(null);

  const getVaccinationStatus = (vaccination: Vaccination) => {
    const nextDue = new Date(vaccination.nextDueDate);
    const today = new Date();
    const daysDiff = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return { 
      status: 'overdue', 
      variant: 'destructive' as const,
      text: `${Math.abs(daysDiff)} days overdue`
    };
    if (daysDiff <= 7) return { 
      status: 'due soon', 
      variant: 'secondary' as const,
      text: daysDiff === 0 ? 'Due today' : `Due in ${daysDiff} days`
    };
    if (daysDiff <= 30) return { 
      status: 'upcoming', 
      variant: 'outline' as const,
      text: `Due in ${daysDiff} days`
    };
    return { 
      status: 'up to date', 
      variant: 'outline' as const,
      text: `Due in ${daysDiff} days`
    };
  };

  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : 'Unknown Pet';
  };

  // Sort reminders by date and time
  const sortedReminders = [...reminders].sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.time);
    const dateB = new Date(b.date + 'T' + b.time);
    return dateA.getTime() - dateB.getTime();
  });

  // Get upcoming reminders (next 3)
  const upcomingReminders = sortedReminders.slice(0, 3);

  // Sort expenses by date
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get recent expenses (today's expenses only)
  const today = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses.filter(expense => expense.date === today);
  
  // Get this month's total expenses
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const monthlyTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Get recent expenses for display (last 3)
  const recentExpenses = sortedExpenses.slice(0, 3);

  // Get upcoming vaccination reminders with enhanced status
  const upcomingVaccinations = vaccinations
    .map(vaccination => ({
      ...vaccination,
      statusInfo: getVaccinationStatus(vaccination)
    }))
    .filter(vaccination => {
      const nextDue = new Date(vaccination.nextDueDate);
      const today = new Date();
      const daysDiff = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return daysDiff <= 30; // Show vaccinations due within 30 days or overdue
    })
    .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());

  const handleMarkVaccinationCompleted = (vaccinationId: string) => {
    if (onMarkVaccinationCompleted) {
      onMarkVaccinationCompleted(vaccinationId);
    }
    setSelectedVaccination(null);
  };

  // Show default message if no pets
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
          <h2 className="text-xl font-semibold mb-2">Welcome to PetCare AI</h2>
          <p className="text-gray-600 mb-4">Add your first pet to get started</p>
        </div>
      </div>
    );
  }

  const primaryPet = pets[0];

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

      {/* Pet Header */}
      <div className="pet-card">
        <div className="flex items-center space-x-4">
          <PetAvatar 
            pet={primaryPet}
            size="large"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Hello, {primaryPet.name}! 👋</h1>
            <p className="text-gray-600">
              {pets.length === 1 
                ? "How's your furry friend today?" 
                : `Managing ${pets.length} pets`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="pet-card text-center">
          <div className="text-2xl font-bold text-primary">{upcomingReminders.length}</div>
          <div className="text-sm text-gray-600">Upcoming Reminders</div>
        </div>
        <div className="pet-card text-center">
          <div className="text-2xl font-bold text-primary">{upcomingVaccinations.length}</div>
          <div className="text-sm text-gray-600">Vaccines Due</div>
        </div>
        <div className="pet-card text-center">
          <div className="text-2xl font-bold text-primary">
            ${monthlyTotal.toFixed(0)}
          </div>
          <div className="text-sm text-gray-600">This Month</div>
        </div>
      </div>

      {/* Today's Summary */}
      {todayExpenses.length > 0 && (
        <div className="pet-card">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="mr-2 text-primary" size={20} />
            Today's Expenses
          </h2>
          <div className="space-y-3">
            {todayExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Activity className="w-4 h-4 text-primary mr-3" />
                  <div>
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {expense.category} • {getPetName(expense.petId)}
                    </div>
                  </div>
                </div>
                <div className="font-medium">${expense.amount.toFixed(2)}</div>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-semibold">Today's Total:</span>
              <span className="font-bold text-primary">
                ${todayExpenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Reminders */}
      <div className="pet-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Calendar className="mr-2 text-primary" size={20} />
            Upcoming Reminders
          </h2>
          <button
            onClick={onAddReminder}
            className="flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <Plus size={16} className="mr-1" />
            Add
          </button>
        </div>

        <div className="space-y-3">
          {upcomingReminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                <div>
                  <div className="font-medium">{reminder.title}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(reminder.date).toLocaleDateString()} at {reminder.time} • {getPetName(reminder.petId)}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="capitalize">
                {reminder.type}
              </Badge>
            </div>
          ))}

          {upcomingVaccinations.map((vaccination) => (
            <div key={vaccination.id} className="flex flex-col space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Syringe className="w-4 h-4 text-primary mr-3" />
                  <div>
                    <div className="font-medium">{vaccination.vaccineName}</div>
                    <div className="text-sm text-gray-600">
                      Due: {new Date(vaccination.nextDueDate).toLocaleDateString()} • {getPetName(vaccination.petId)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Button 
                  size="sm" 
                  variant={vaccination.statusInfo.variant}
                  className="text-xs h-7"
                >
                  <Clock size={12} className="mr-1" />
                  {vaccination.statusInfo.text}
                </Button>
                {(vaccination.statusInfo.status === 'overdue' || vaccination.statusInfo.status === 'due soon') && onMarkVaccinationCompleted && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 h-7">
                        <Check size={12} className="mr-1" />
                        Mark Done
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Mark Vaccination as Completed</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to mark {vaccination.vaccineName} as completed? This will update the vaccination date to today and set the next due date to one year from now.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleMarkVaccinationCompleted(vaccination.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark as Done
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}

          {upcomingReminders.length === 0 && upcomingVaccinations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
              <p>No upcoming reminders</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="pet-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <DollarSign className="mr-2 text-primary" size={20} />
            Recent Expenses
          </h2>
          <button
            onClick={onAddExpense}
            className="flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <Plus size={16} className="mr-1" />
            Add
          </button>
        </div>

        <div className="space-y-3">
          {recentExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Activity className="w-4 h-4 text-primary mr-3" />
                <div>
                  <div className="font-medium">{expense.description}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(expense.date).toLocaleDateString()} • {getPetName(expense.petId)}
                  </div>
                </div>
              </div>
              <div className="font-medium">${expense.amount.toFixed(2)}</div>
            </div>
          ))}

          {recentExpenses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <DollarSign size={48} className="mx-auto mb-3 text-gray-300" />
              <p>No recent expenses</p>
              <p className="text-sm">Start tracking your pet's expenses!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;


import React from 'react';
import { Plus, Calendar, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import PetAvatar from './PetAvatar';
import { Pet, Reminder, Expense } from '../types/pet';

interface HomePageProps {
  pet: Pet | null;
  reminders: Reminder[];
  expenses: Expense[];
  onAddReminder: () => void;
  onAddExpense: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ pet, reminders, expenses, onAddReminder, onAddExpense }) => {
  const upcomingReminders = reminders
    .filter(r => !r.completed && new Date(r.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const thisMonthExpenses = expenses
    .filter(e => {
      const expenseDate = new Date(e.date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && 
             expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((total, expense) => total + expense.amount, 0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Hero Image Section */}
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white shadow-soft">
        <div className="text-center mb-4">
          <img 
            src="/lovable-uploads/92b69a13-adf5-41ec-8d20-865983d3b0c6.png" 
            alt="Happy dog and cat together"
            className="w-48 h-48 mx-auto rounded-2xl shadow-gentle object-cover"
          />
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          {pet && (
            <>
              <PetAvatar petType={pet.type} petName={pet.name} size="lg" />
              <div className="text-center">
                <h1 className="text-2xl font-bold">Hello, {pet.name}! 👋</h1>
                <p className="text-primary-foreground/80">
                  Let's keep you healthy and happy
                </p>
              </div>
            </>
          )}
          {!pet && (
            <div className="text-center">
              <h1 className="text-2xl font-bold">Welcome to Pet Care! 🐾</h1>
              <p className="text-primary-foreground/80">
                Set up your pet profile to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="pet-card text-center">
          <div className="text-2xl font-bold text-primary">
            {upcomingReminders.length}
          </div>
          <div className="text-sm text-gray-600">Upcoming Reminders</div>
        </div>
        <div className="pet-card text-center">
          <div className="text-2xl font-bold text-success">
            ${thisMonthExpenses.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">This Month</div>
        </div>
      </div>

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
        
        {upcomingReminders.length > 0 ? (
          <div className="space-y-3">
            {upcomingReminders.map((reminder) => (
              <div key={reminder.id} className="reminder-card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-blue-900">{reminder.title}</div>
                    <div className="text-sm text-blue-600">
                      {formatDate(reminder.date)} at {reminder.time}
                    </div>
                  </div>
                  <div className="text-2xl">
                    {reminder.type === 'vaccine' && '💉'}
                    {reminder.type === 'vet' && '🏥'}
                    {reminder.type === 'grooming' && '✂️'}
                    {reminder.type === 'bath' && '🛁'}
                    {reminder.type === 'medication' && '💊'}
                    {reminder.type === 'other' && '📋'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No upcoming reminders</p>
            <p className="text-sm">Tap "Add" to create your first reminder</p>
          </div>
        )}
      </div>

      {/* Recent Expenses */}
      <div className="pet-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <TrendingUp className="mr-2 text-success" size={20} />
            Recent Expenses
          </h2>
          <button
            onClick={onAddExpense}
            className="flex items-center text-success hover:text-success-dark transition-colors"
          >
            <Plus size={16} className="mr-1" />
            Add
          </button>
        </div>
        
        {expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.slice(0, 3).map((expense) => (
              <div key={expense.id} className="expense-card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-green-900">{expense.description}</div>
                    <div className="text-sm text-green-600">
                      {formatDate(expense.date)} • {expense.category}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-700">
                    ${expense.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <DollarSign size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No expenses recorded</p>
            <p className="text-sm">Track your pet care spending</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

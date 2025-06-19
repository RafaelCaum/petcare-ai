
import React, { useState, useMemo } from 'react';
import { Plus, Calendar, AlertCircle, TrendingUp, DollarSign, CalendarPlus } from 'lucide-react';
import { Pet, Reminder, Expense, Vaccination } from '../types/pet';
import { AspectRatio } from './ui/aspect-ratio';
import { Calendar as CalendarComponent } from './ui/calendar';

interface HomePageProps {
  pet: Pet | null;
  reminders: Reminder[];
  expenses: Expense[];
  vaccinations: Vaccination[];
  onAddReminder: () => void;
  onAddExpense: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  pet, 
  reminders, 
  expenses, 
  vaccinations, 
  onAddReminder, 
  onAddExpense 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Convert upcoming vaccinations to reminder-like objects
  const vaccinationReminders = useMemo(() => {
    return vaccinations
      .filter(v => v.nextDueDate && new Date(v.nextDueDate) >= new Date())
      .map(v => ({
        id: `vaccination-${v.id}`,
        petId: v.petId,
        title: `${v.vaccineName} - Next Dose`,
        type: 'vaccine' as const,
        date: v.nextDueDate,
        time: '09:00', // Default time for vaccine reminders
        notes: v.notes || '',
        completed: false,
        emailReminder: true,
        smsReminder: false,
        isVaccination: true
      }));
  }, [vaccinations]);

  // Combine regular reminders with vaccination reminders
  const allReminders = useMemo(() => {
    return [...reminders, ...vaccinationReminders];
  }, [reminders, vaccinationReminders]);

  const upcomingReminders = allReminders
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

  // Function to add event to phone calendar
  const addToCalendar = (reminder: any) => {
    const startDate = new Date(`${reminder.date}T${reminder.time}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    const event = {
      title: reminder.title,
      start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      description: reminder.notes || '',
      location: ''
    };

    // Create calendar URL (universal format)
    const calendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`;

    // Create download link
    const link = document.createElement('a');
    link.href = encodeURI(calendarUrl);
    link.download = `${reminder.title}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check if a date has reminders
  const hasReminders = (date: Date) => {
    return allReminders.some(reminder => {
      const reminderDate = new Date(reminder.date);
      return reminderDate.toDateString() === date.toDateString();
    });
  };

  // Get reminders for a specific date
  const getRemindersForDate = (date: Date) => {
    return allReminders.filter(reminder => {
      const reminderDate = new Date(reminder.date);
      return reminderDate.toDateString() === date.toDateString();
    });
  };

  const selectedDateReminders = selectedDate ? getRemindersForDate(selectedDate) : [];

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Brand Logo */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
        <div className="text-center">
          <div className="w-32 mx-auto">
            <AspectRatio ratio={1 / 1}>
              <img 
                src="/lovable-uploads/5cd6c558-d62f-4923-8538-e379176079d1.png" 
                alt="Pet Care Logo"
                className="w-full h-full rounded-2xl shadow-gentle object-cover"
              />
            </AspectRatio>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="pet-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Calendar className="mr-2 text-primary" size={20} />
            Appointments Calendar
          </h2>
        </div>
        
        <div className="bg-white rounded-xl">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="w-full"
            modifiers={{
              hasEvents: (date) => hasReminders(date)
            }}
            modifiersStyles={{
              hasEvents: {
                backgroundColor: 'rgb(99 102 241 / 0.2)',
                color: 'rgb(99 102 241)',
                fontWeight: 'bold'
              }
            }}
          />
        </div>

        {/* Appointments for selected date */}
        {selectedDate && (
          <div className="mt-4">
            <h3 className="font-medium mb-3 text-gray-700">
              Appointments for {selectedDate.toLocaleDateString('en-US')}:
            </h3>
            {selectedDateReminders.length > 0 ? (
              <div className="space-y-2">
                {selectedDateReminders.map((reminder) => (
                  <div key={reminder.id} className="reminder-card">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-blue-900">{reminder.title}</div>
                        <div className="text-sm text-blue-600">
                          {reminder.time} • {reminder.type}
                          {(reminder as any).isVaccination && ' (Next Vaccine Due)'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => addToCalendar(reminder)}
                          className="flex items-center text-primary hover:text-primary-dark transition-colors text-sm"
                          title="Add to phone calendar"
                        >
                          <CalendarPlus size={16} className="mr-1" />
                          Save
                        </button>
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No appointments on this date</p>
            )}
          </div>
        )}
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
            <AlertCircle className="mr-2 text-primary" size={20} />
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
                  <div className="flex-1">
                    <div className="font-medium text-blue-900">
                      {reminder.title}
                      {(reminder as any).isVaccination && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Vaccine Due
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-blue-600">
                      {formatDate(reminder.date)} at {reminder.time}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => addToCalendar(reminder)}
                      className="flex items-center text-primary hover:text-primary-dark transition-colors text-sm"
                      title="Add to phone calendar"
                    >
                      <CalendarPlus size={16} />
                    </button>
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
            <p className="text-sm">Track your pet care expenses</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

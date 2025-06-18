import React, { useState, useEffect } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import HomePage from '../components/HomePage';
import PetPage from '../components/PetPage';
import ExpensesPage from '../components/ExpensesPage';
import ProfilePage from '../components/ProfilePage';
import SplashScreen from '../components/SplashScreen';
import { Pet, Reminder, Expense, Vaccination, User } from '../types/pet';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showSplash, setShowSplash] = useState(true);

  // Hide splash screen after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Mock data - this would come from your backend/database
  const [user] = useState<User>({
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    subscriptionStatus: 'trial',
    trialStartDate: new Date().toISOString(),
  });

  const [pet] = useState<Pet>({
    id: '1',
    name: 'Max',
    type: 'dog',
    breed: 'Golden Retriever',
    birthDate: '2022-03-15',
    avatar: '🐕',
    weight: 65,
    color: 'Golden',
    gender: 'male'
  });

  const [reminders] = useState<Reminder[]>([
    {
      id: '1',
      petId: '1',
      title: 'Annual Vaccine',
      type: 'vaccine',
      date: '2024-06-25',
      time: '10:00',
      notes: 'Rabies and DHPP vaccines',
      completed: false,
      emailReminder: true,
      smsReminder: true
    },
    {
      id: '2',
      petId: '1',
      title: 'Grooming Appointment',
      type: 'grooming',
      date: '2024-06-22',
      time: '14:30',
      notes: 'Full grooming and nail trim',
      completed: false,
      emailReminder: true,
      smsReminder: false
    }
  ]);

  const [expenses] = useState<Expense[]>([
    {
      id: '1',
      petId: '1',
      amount: 85.50,
      category: 'grooming',
      description: 'Full grooming service',
      date: '2024-06-15',
      notes: 'Included nail trim and ear cleaning'
    },
    {
      id: '2',
      petId: '1',
      amount: 165.00,
      category: 'vet',
      description: 'Routine checkup',
      date: '2024-06-10',
      notes: 'Annual wellness exam'
    },
    {
      id: '3',
      petId: '1',
      amount: 45.99,
      category: 'food',
      description: 'Premium dog food',
      date: '2024-06-08'
    }
  ]);

  const [vaccinations] = useState<Vaccination[]>([
    {
      id: '1',
      petId: '1',
      vaccineName: 'Rabies',
      dateGiven: '2023-06-15',
      nextDueDate: '2024-06-15',
      veterinarian: 'Dr. Smith - Happy Paws Clinic'
    },
    {
      id: '2',
      petId: '1',
      vaccineName: 'DHPP',
      dateGiven: '2023-06-15',
      nextDueDate: '2024-06-15',
      veterinarian: 'Dr. Smith - Happy Paws Clinic'
    }
  ]);

  const handleAddReminder = () => {
    console.log('Add reminder clicked');
    // TODO: Implement add reminder modal/form
  };

  const handleAddExpense = () => {
    console.log('Add expense clicked');
    // TODO: Implement add expense modal/form
  };

  const handleEditPet = () => {
    console.log('Edit pet clicked');
    // TODO: Implement edit pet modal/form
  };

  const handleAddVaccination = () => {
    console.log('Add vaccination clicked');
    // TODO: Implement add vaccination modal/form
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    // TODO: Implement edit profile modal/form
  };

  const handleManageSubscription = () => {
    console.log('Manage subscription clicked');
    // TODO: Implement subscription management
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            pet={pet}
            reminders={reminders}
            expenses={expenses}
            onAddReminder={handleAddReminder}
            onAddExpense={handleAddExpense}
          />
        );
      case 'pet':
        return (
          <PetPage
            pet={pet}
            vaccinations={vaccinations}
            onEditPet={handleEditPet}
            onAddVaccination={handleAddVaccination}
          />
        );
      case 'expenses':
        return (
          <ExpensesPage
            expenses={expenses}
            onAddExpense={handleAddExpense}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            user={user}
            onEditProfile={handleEditProfile}
            onManageSubscription={handleManageSubscription}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SplashScreen isVisible={showSplash} />
      
      <div className={`min-h-screen bg-gray-50 transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-md mx-auto bg-white min-h-screen relative">
          {/* Main Content */}
          <div className="px-4 pt-4">
            {renderActiveTab()}
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </>
  );
};

export default Index;

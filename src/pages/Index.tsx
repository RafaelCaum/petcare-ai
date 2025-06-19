
import React, { useState } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import HomePage from '../components/HomePage';
import PetPage from '../components/PetPage';
import ExpensesPage from '../components/ExpensesPage';
import ProfilePage from '../components/ProfilePage';
import SplashScreen from '../components/SplashScreen';
import EmailLogin from '../components/EmailLogin';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { User } from '../types/pet';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { user, pets, reminders, expenses, vaccinations, loading, addExpense, addReminder } = useSupabaseData(userEmail);

  const handleLogin = (email: string, userData: any) => {
    setUserEmail(email);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setUserEmail(null);
    setCurrentUser(null);
    setActiveTab('home');
  };

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

  // Show login if no user is logged in
  if (!userEmail) {
    return <EmailLogin onLogin={handleLogin} />;
  }

  // Show loading while fetching data
  if (loading) {
    return <SplashScreen isVisible={true} />;
  }

  // Get the first pet for now (we'll handle multiple pets later)
  const currentPet = pets[0] || {
    id: 'temp',
    name: 'Add Your Pet',
    type: 'dog' as const,
    breed: '',
    birthDate: new Date().toISOString().split('T')[0],
    avatar: '🐕',
    weight: 0,
    color: '',
    gender: 'male' as const
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            pet={currentPet}
            reminders={reminders}
            expenses={expenses}
            onAddReminder={handleAddReminder}
            onAddExpense={handleAddExpense}
          />
        );
      case 'pet':
        return (
          <PetPage
            pet={currentPet}
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
            user={user || currentUser!}
            onEditProfile={handleEditProfile}
            onManageSubscription={handleManageSubscription}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {/* Main Content */}
        <div className="px-4 pt-4">
          {renderActiveTab()}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;

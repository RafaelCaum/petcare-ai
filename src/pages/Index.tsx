import React, { useState } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import HomePage from '../components/HomePage';
import PetPage from '../components/PetPage';
import ExpensesPage from '../components/ExpensesPage';
import ProfilePageWithLogout from '../components/ProfilePageWithLogout';
import SplashScreen from '../components/SplashScreen';
import EmailLogin from '../components/EmailLogin';
import EditProfileModal from '../components/EditProfileModal';
import EditPetModal from '../components/EditPetModal';
import AddVaccinationModal from '../components/AddVaccinationModal';
import AddReminderModal from '../components/AddReminderModal';
import AddExpenseModal from '../components/AddExpenseModal';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { User } from '../types/pet';
import { toast } from 'sonner';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Modal states
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [editPetModalOpen, setEditPetModalOpen] = useState(false);
  const [addVaccinationModalOpen, setAddVaccinationModalOpen] = useState(false);
  const [addReminderModalOpen, setAddReminderModalOpen] = useState(false);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);

  const { 
    user, 
    pets, 
    reminders, 
    expenses, 
    vaccinations, 
    loading, 
    addExpense, 
    addReminder, 
    addPet, 
    updateUser, 
    addVaccination 
  } = useSupabaseData(userEmail);

  const handleLoginSuccess = () => {
    // The EmailLogin component handles the authentication internally
    // We just need to handle the success callback
    console.log('Login successful');
  };

  const handleLogout = () => {
    setUserEmail(null);
    setCurrentUser(null);
    setActiveTab('home');
  };

  const handleAddReminder = () => {
    if (pets.length === 0) {
      toast.error('Adicione um pet primeiro!');
      return;
    }
    setAddReminderModalOpen(true);
  };

  const handleAddExpense = () => {
    if (pets.length === 0) {
      toast.error('Adicione um pet primeiro!');
      return;
    }
    setAddExpenseModalOpen(true);
  };

  const handleEditPet = () => {
    setEditPetModalOpen(true);
  };

  const handleAddVaccination = () => {
    if (pets.length === 0) {
      toast.error('Adicione um pet primeiro!');
      return;
    }
    setAddVaccinationModalOpen(true);
  };

  const handleEditProfile = () => {
    setEditProfileModalOpen(true);
  };

  const handleManageSubscription = () => {
    toast.info('Funcionalidade de assinatura em desenvolvimento');
  };

  const handleSaveProfile = async (userData: Partial<User>) => {
    try {
      await updateUser(userData);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    }
  };

  const handleSavePet = async (petData: any) => {
    try {
      await addPet(petData);
      toast.success('Pet adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar pet');
    }
  };

  const handleSaveVaccination = async (vaccinationData: any) => {
    try {
      const currentPet = pets[0];
      if (currentPet) {
        await addVaccination({ ...vaccinationData, petId: currentPet.id });
        toast.success('Vacinação adicionada com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao adicionar vacinação');
    }
  };

  const handleSaveReminder = async (reminderData: any) => {
    try {
      const currentPet = pets[0];
      if (currentPet) {
        await addReminder({ ...reminderData, petId: currentPet.id });
        toast.success('Lembrete adicionado com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao adicionar lembrete');
    }
  };

  const handleSaveExpense = async (expenseData: any) => {
    try {
      const currentPet = pets[0];
      if (currentPet) {
        await addExpense({ ...expenseData, petId: currentPet.id });
        toast.success('Despesa adicionada com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao adicionar despesa');
    }
  };

  // Show login if no user is logged in
  if (!userEmail) {
    return <EmailLogin onSuccess={handleLoginSuccess} />;
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
          <ProfilePageWithLogout
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
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {/* Main Content */}
        <div className="px-4 pt-4">
          {renderActiveTab()}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Modals */}
        <EditProfileModal
          user={user || currentUser!}
          isOpen={editProfileModalOpen}
          onClose={() => setEditProfileModalOpen(false)}
          onSave={handleSaveProfile}
        />

        <EditPetModal
          pet={pets.length > 0 ? pets[0] : undefined}
          isOpen={editPetModalOpen}
          onClose={() => setEditPetModalOpen(false)}
          onSave={handleSavePet}
        />

        <AddVaccinationModal
          petId={currentPet.id}
          isOpen={addVaccinationModalOpen}
          onClose={() => setAddVaccinationModalOpen(false)}
          onSave={handleSaveVaccination}
        />

        <AddReminderModal
          petId={currentPet.id}
          isOpen={addReminderModalOpen}
          onClose={() => setAddReminderModalOpen(false)}
          onSave={handleSaveReminder}
        />

        <AddExpenseModal
          petId={currentPet.id}
          isOpen={addExpenseModalOpen}
          onClose={() => setAddExpenseModalOpen(false)}
          onSave={handleSaveExpense}
        />
      </div>
    </div>
  );
};

export default Index;

import React, { useState } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import HomePage from '../components/HomePage';
import PetPage from '../components/PetPage';
import ExpensesPage from '../components/ExpensesPage';
import ProfilePageWithLogout from '../components/ProfilePageWithLogout';
import SplashScreen from '../components/SplashScreen';
import EmailLogin from '../components/EmailLogin';
import ModalManager from '../components/modals/ModalManager';
import TrialStatusBar from '../components/status/TrialStatusBar';
import N8nIntegration from '../components/N8nIntegration';
import TrialExpiredModal from '../components/TrialExpiredModal';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { usePremiumAccess } from '../hooks/usePremiumAccess';
import { useModalHandlers } from '../hooks/useModalHandlers';
import { useAccessControl } from '../hooks/useAccessControl';
import { User } from '../types/pet';
import { toast } from 'sonner';
import VetCareAI from '../components/VetCareAI';
import MyPetPage from '../components/MyPetPage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
    updatePet,
    deletePet,
    deleteExpense,
    updateUser, 
    addVaccination,
    deleteVaccination,
    markVaccinationAsCompleted,
    uploadPetPhoto,
    uploadUserPhoto,
    refetch
  } = useSupabaseData(userEmail);

  const { 
    isPremium, 
    status, 
    trialDaysLeft,
    trialExpired,
    loading: premiumLoading, 
    createCheckoutSession,
    checkPremiumStatus,
    isPaying,
    nextDueDate
  } = usePremiumAccess(userEmail);

  const modalHandlers = useModalHandlers({
    pets,
    addExpense,
    addReminder,
    addPet,
    updatePet,
    updateUser,
    addVaccination,
    refetch,
    userEmail
  });

  const { shouldBlockAccess } = useAccessControl({
    userEmail,
    status,
    isPaying,
    nextDueDate,
    premiumLoading,
    checkPremiumStatus
  });

  const handleLogin = (email: string, userData: any) => {
    setUserEmail(email);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setUserEmail(null);
    setCurrentUser(null);
    setActiveTab('home');
  };

  const handleManageSubscription = () => {
    toast.info('Subscription feature in development');
  };

  const handleDeleteVaccination = async (vaccinationId: string) => {
    try {
      await deleteVaccination(vaccinationId);
      toast.success('Vaccination deleted successfully!');
    } catch (error) {
      toast.error('Error deleting vaccination');
    }
  };

  const handleDeletePet = async (petId: string) => {
    try {
      await deletePet(petId);
      toast.success('Pet deleted successfully!');
    } catch (error) {
      toast.error('Error deleting pet');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId);
      toast.success('Expense deleted successfully!');
    } catch (error) {
      toast.error('Error deleting expense');
    }
  };

  const handleMarkVaccinationCompleted = async (vaccinationId: string) => {
    try {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const nextDueDate = nextYear.toISOString().split('T')[0];
      
      await markVaccinationAsCompleted(vaccinationId, nextDueDate);
      await refetch();
      toast.success('Vaccination marked as completed!');
    } catch (error) {
      toast.error('Error updating vaccination');
    }
  };

  if (!userEmail) {
    return <EmailLogin onLogin={handleLogin} />;
  }

  if (loading || premiumLoading) {
    return <SplashScreen isVisible={true} />;
  }

  if (shouldBlockAccess()) {
    return <TrialExpiredModal />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            pets={pets}
            reminders={reminders}
            expenses={expenses}
            vaccinations={vaccinations}
            onAddReminder={modalHandlers.handleAddReminder}
            onAddExpense={modalHandlers.handleAddExpense}
            onMarkVaccinationCompleted={handleMarkVaccinationCompleted}
          />
        );
      case 'pet':
        return (
          <PetPage
            pets={pets}
            vaccinations={vaccinations}
            onEditPet={modalHandlers.handleEditPet}
            onAddVaccination={modalHandlers.handleAddVaccination}
            onDeleteVaccination={handleDeleteVaccination}
            onDeletePet={handleDeletePet}
          />
        );
      case 'mypet':
        return (
          <MyPetPage
            userEmail={userEmail!}
          />
        );
      case 'vetcare':
        return (
          <VetCareAI
            userEmail={userEmail!}
            pets={pets}
          />
        );
      case 'expenses':
        return (
          <ExpensesPage
            expenses={expenses}
            pets={pets}
            onAddExpense={modalHandlers.handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        );
      case 'profile':
        return (
          <ProfilePageWithLogout
            user={user || currentUser!}
            onEditProfile={modalHandlers.handleEditProfile}
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
        <TrialStatusBar 
          status={status}
          trialDaysLeft={trialDaysLeft}
          isPaying={isPaying}
        />

        <N8nIntegration 
          vaccinations={vaccinations}
          pets={pets}
          userEmail={userEmail}
        />

        <div className="px-4 pt-4">
          {renderActiveTab()}
        </div>

        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <ModalManager
          editProfileModalOpen={modalHandlers.editProfileModalOpen}
          setEditProfileModalOpen={modalHandlers.setEditProfileModalOpen}
          user={user || currentUser}
          handleSaveProfile={modalHandlers.handleSaveProfile}
          uploadUserPhoto={uploadUserPhoto}
          editPetModalOpen={modalHandlers.editPetModalOpen}
          setEditPetModalOpen={modalHandlers.setEditPetModalOpen}
          selectedPetForModal={modalHandlers.selectedPetForModal}
          setSelectedPetForModal={modalHandlers.setSelectedPetForModal}
          handleSavePet={modalHandlers.handleSavePet}
          uploadPetPhoto={uploadPetPhoto}
          addVaccinationModalOpen={modalHandlers.addVaccinationModalOpen}
          setAddVaccinationModalOpen={modalHandlers.setAddVaccinationModalOpen}
          addReminderModalOpen={modalHandlers.addReminderModalOpen}
          setAddReminderModalOpen={modalHandlers.setAddReminderModalOpen}
          addExpenseModalOpen={modalHandlers.addExpenseModalOpen}
          setAddExpenseModalOpen={modalHandlers.setAddExpenseModalOpen}
          pets={pets}
          handleSaveVaccination={modalHandlers.handleSaveVaccination}
          handleSaveReminder={modalHandlers.handleSaveReminder}
          handleSaveExpense={modalHandlers.handleSaveExpense}
        />
      </div>
    </div>
  );
};

export default Index;

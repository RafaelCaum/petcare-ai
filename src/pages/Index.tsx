import React, { useState, useEffect } from 'react';
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
import ZapierIntegration from '../components/ZapierIntegration';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { User, Pet } from '../types/pet';
import { toast } from 'sonner';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedPetForModal, setSelectedPetForModal] = useState<Pet | undefined>(undefined);
  
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

  const handleLogin = (email: string, userData: any) => {
    console.log('Login successful for:', email);
    setUserEmail(email);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    console.log('Logging out user');
    setUserEmail(null);
    setCurrentUser(null);
    setActiveTab('home');
  };

  const handleAddReminder = () => {
    if (pets.length === 0) {
      toast.error('Add a pet first!');
      return;
    }
    setAddReminderModalOpen(true);
  };

  const handleAddExpense = () => {
    if (pets.length === 0) {
      toast.error('Add a pet first!');
      return;
    }
    setAddExpenseModalOpen(true);
  };

  const handleEditPet = (pet?: Pet) => {
    setSelectedPetForModal(pet);
    setEditPetModalOpen(true);
  };

  const handleAddVaccination = () => {
    if (pets.length === 0) {
      toast.error('Add a pet first!');
      return;
    }
    setAddVaccinationModalOpen(true);
  };

  const handleEditProfile = () => {
    setEditProfileModalOpen(true);
  };

  const handleManageSubscription = () => {
    toast.info('Subscription feature in development');
  };

  const handleSaveProfile = async (userData: Partial<User>) => {
    try {
      await updateUser(userData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const handleSavePet = async (petData: any) => {
    try {
      await addPet(petData);
      setSelectedPetForModal(undefined);
      toast.success('Pet added successfully!');
    } catch (error) {
      toast.error('Error adding pet');
    }
  };

  const handleSaveVaccination = async (vaccinationData: any) => {
    try {
      console.log('Saving vaccination:', vaccinationData);
      await addVaccination(vaccinationData);
      
      // Send Zapier webhook for email confirmation
      if (vaccinationData.zapierWebhook) {
        try {
          const selectedPet = pets.find(p => p.id === vaccinationData.petId);
          await fetch(vaccinationData.zapierWebhook, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "no-cors",
            body: JSON.stringify({
              type: "vaccination_confirmation",
              petName: selectedPet?.name || "Pet",
              vaccineName: vaccinationData.vaccineName,
              dateGiven: vaccinationData.dateGiven,
              nextDueDate: vaccinationData.nextDueDate,
              veterinarian: vaccinationData.veterinarian,
              userEmail: userEmail,
              timestamp: new Date().toISOString(),
              emailSubject: "Confirmação da Vacina do Seu Pet 🐶❤️",
              emailBody: `Olá! A vacina ${vaccinationData.vaccineName} foi aplicada com sucesso no seu pet ${selectedPet?.name || 'seu pet'}. Próxima dose: ${new Date(vaccinationData.nextDueDate).toLocaleDateString('pt-BR')}. Veterinário: Dr(a). ${vaccinationData.veterinarian}`
            }),
          });
          console.log('Zapier webhook sent for vaccination confirmation');
          toast.success('Email de confirmação enviado!');
        } catch (error) {
          console.error('Error sending Zapier webhook:', error);
          toast.error('Erro ao enviar email de confirmação');
        }
      }
      
      toast.success('Vacina registrada com sucesso!');
    } catch (error) {
      console.error('Error in handleSaveVaccination:', error);
      toast.error('Erro ao registrar vacina');
    }
  };

  const handleSaveReminder = async (reminderData: any) => {
    try {
      await addReminder(reminderData);
      toast.success('Reminder added successfully!');
    } catch (error) {
      toast.error('Error adding reminder');
    }
  };

  const handleSaveExpense = async (expenseData: any) => {
    try {
      await addExpense(expenseData);
      toast.success('Expense added successfully!');
    } catch (error) {
      toast.error('Error adding expense');
    }
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
      console.log('handleMarkVaccinationCompleted called with ID:', vaccinationId);
      
      // Calculate next due date (1 year from today)
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const nextDueDate = nextYear.toISOString().split('T')[0];
      
      console.log('Calling markVaccinationAsCompleted...');
      await markVaccinationAsCompleted(vaccinationId, nextDueDate);
      
      console.log('Vaccination marked as completed, refreshing data...');
      // Force refresh to ensure UI is updated
      await refetch();
      
      toast.success('Vaccination marked as completed!');
    } catch (error) {
      console.error('Error in handleMarkVaccinationCompleted:', error);
      toast.error('Error updating vaccination');
    }
  };

  // Show login if no user is logged in
  if (!userEmail) {
    return <EmailLogin onLogin={handleLogin} />;
  }

  // Show loading while fetching data
  if (loading) {
    console.log('Loading state - showing splash screen');
    return <SplashScreen isVisible={true} />;
  }

  console.log('Rendering main app with pets:', pets.length, 'active tab:', activeTab);

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
    console.log('Rendering active tab:', activeTab);
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            pets={pets}
            reminders={reminders}
            expenses={expenses}
            vaccinations={vaccinations}
            onAddReminder={handleAddReminder}
            onAddExpense={handleAddExpense}
            onMarkVaccinationCompleted={handleMarkVaccinationCompleted}
          />
        );
      case 'pet':
        console.log('Rendering PetPage with pets:', pets);
        console.log('Rendering PetPage with vaccinations:', vaccinations);
        return (
          <PetPage
            pets={pets}
            vaccinations={vaccinations}
            onEditPet={handleEditPet}
            onAddVaccination={handleAddVaccination}
            onDeleteVaccination={handleDeleteVaccination}
            onDeletePet={handleDeletePet}
          />
        );
      case 'expenses':
        return (
          <ExpensesPage
            expenses={expenses}
            pets={pets}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
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
        {/* Zapier Integration Component */}
        <ZapierIntegration 
          vaccinations={vaccinations}
          pets={pets}
          userEmail={userEmail}
        />

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
          onUploadPhoto={uploadUserPhoto}
        />

        <EditPetModal
          pet={selectedPetForModal}
          isOpen={editPetModalOpen}
          onClose={() => {
            setEditPetModalOpen(false);
            setSelectedPetForModal(undefined);
          }}
          onSave={handleSavePet}
          onUploadPhoto={uploadPetPhoto}
        />

        <AddVaccinationModal
          pets={pets}
          isOpen={addVaccinationModalOpen}
          onClose={() => setAddVaccinationModalOpen(false)}
          onSave={handleSaveVaccination}
        />

        <AddReminderModal
          pets={pets}
          isOpen={addReminderModalOpen}
          onClose={() => setAddReminderModalOpen(false)}
          onSave={handleSaveReminder}
        />

        <AddExpenseModal
          pets={pets}
          isOpen={addExpenseModalOpen}
          onClose={() => setAddExpenseModalOpen(false)}
          onSave={handleSaveExpense}
        />
      </div>
    </div>
  );
};

export default Index;

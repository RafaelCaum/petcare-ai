
import React, { useState } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import HomePage from '../components/HomePage';
import PetPage from '../components/PetPage';
import ExpensesPage from '../components/ExpensesPage';
import ProfilePageWithLogout from '../components/ProfilePageWithLogout';
import EditProfileModal from '../components/EditProfileModal';
import EditPetModal from '../components/EditPetModal';
import AddVaccinationModal from '../components/AddVaccinationModal';
import AddReminderModal from '../components/AddReminderModal';
import AddExpenseModal from '../components/AddExpenseModal';
import { User } from '../types/pet';
import { toast } from 'sonner';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  // Mock data - you can replace this with real data later
  const [user] = useState<User>({
    id: '1',
    name: 'Usuário Demo',
    email: 'demo@example.com',
    avatar: '👤'
  });

  const [pets] = useState([{
    id: '1',
    name: 'Rex',
    type: 'dog' as const,
    breed: 'Golden Retriever',
    birthDate: '2020-01-15',
    avatar: '🐕',
    weight: 25,
    color: 'Dourado',
    gender: 'male' as const
  }]);

  const [reminders] = useState([
    {
      id: '1',
      petId: '1',
      title: 'Vacina anual',
      description: 'Renovar vacina V10',
      date: '2024-06-25',
      type: 'vaccination' as const,
      completed: false
    }
  ]);

  const [expenses] = useState([
    {
      id: '1',
      petId: '1',
      amount: 150.00,
      description: 'Consulta veterinária',
      date: '2024-06-20',
      category: 'veterinary' as const
    }
  ]);

  const [vaccinations] = useState([
    {
      id: '1',
      petId: '1',
      name: 'V10',
      date: '2023-06-20',
      nextDue: '2024-06-20',
      veterinarian: 'Dr. Silva'
    }
  ]);
  
  // Modal states
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [editPetModalOpen, setEditPetModalOpen] = useState(false);
  const [addVaccinationModalOpen, setAddVaccinationModalOpen] = useState(false);
  const [addReminderModalOpen, setAddReminderModalOpen] = useState(false);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);

  const handleAddReminder = () => {
    setAddReminderModalOpen(true);
  };

  const handleAddExpense = () => {
    setAddExpenseModalOpen(true);
  };

  const handleEditPet = () => {
    setEditPetModalOpen(true);
  };

  const handleAddVaccination = () => {
    setAddVaccinationModalOpen(true);
  };

  const handleEditProfile = () => {
    setEditProfileModalOpen(true);
  };

  const handleManageSubscription = () => {
    toast.info('Funcionalidade de assinatura em desenvolvimento');
  };

  const handleLogout = () => {
    toast.info('Logout em desenvolvimento');
  };

  const handleSaveProfile = async (userData: Partial<User>) => {
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleSavePet = async (petData: any) => {
    toast.success('Pet adicionado com sucesso!');
  };

  const handleSaveVaccination = async (vaccinationData: any) => {
    toast.success('Vacinação adicionada com sucesso!');
  };

  const handleSaveReminder = async (reminderData: any) => {
    toast.success('Lembrete adicionado com sucesso!');
  };

  const handleSaveExpense = async (expenseData: any) => {
    toast.success('Despesa adicionada com sucesso!');
  };

  const currentPet = pets[0];

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
            user={user}
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
          user={user}
          isOpen={editProfileModalOpen}
          onClose={() => setEditProfileModalOpen(false)}
          onSave={handleSaveProfile}
        />

        <EditPetModal
          pet={currentPet}
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

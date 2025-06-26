
import { useState } from 'react';
import { Pet, User } from '../types/pet';
import { toast } from 'sonner';

interface UseModalHandlersProps {
  pets: Pet[];
  addExpense: (data: any) => Promise<any>;
  addReminder: (data: any) => Promise<any>;
  addPet: (data: any, file?: File) => Promise<any>;
  updatePet: (id: string, data: any, file?: File) => Promise<any>;
  updateUser: (data: Partial<User>) => Promise<any>;
  addVaccination: (data: any) => Promise<any>;
  refetch: () => Promise<void>;
  userEmail: string | null;
}

export const useModalHandlers = ({
  pets,
  addExpense,
  addReminder,
  addPet,
  updatePet,
  updateUser,
  addVaccination,
  refetch,
  userEmail
}: UseModalHandlersProps) => {
  const [selectedPetForModal, setSelectedPetForModal] = useState<Pet | undefined>(undefined);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [editPetModalOpen, setEditPetModalOpen] = useState(false);
  const [addVaccinationModalOpen, setAddVaccinationModalOpen] = useState(false);
  const [addReminderModalOpen, setAddReminderModalOpen] = useState(false);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);

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

  const handleSaveProfile = async (userData: Partial<User>) => {
    try {
      await updateUser(userData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const handleSavePet = async (petData: any, photoFile?: File) => {
    try {
      if (selectedPetForModal) {
        await updatePet(selectedPetForModal.id, petData, photoFile);
        toast.success('Pet atualizado com sucesso!');
      } else {
        await addPet(petData, photoFile);
        toast.success('Pet adicionado com sucesso!');
      }
      setSelectedPetForModal(undefined);
      await refetch();
    } catch (error) {
      console.error('Error saving pet:', error);
      toast.error('Erro ao salvar pet');
    }
  };

  const handleSaveVaccination = async (vaccinationData: any) => {
    try {
      await addVaccination(vaccinationData);
      
      if (vaccinationData.zapierWebhook) {
        try {
          const selectedPet = pets.find(p => p.id === vaccinationData.petId);
          await fetch(vaccinationData.zapierWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "no-cors",
            body: JSON.stringify({
              type: "vaccination_confirmation",
              petName: selectedPet?.name || "Pet",
              vaccineName: vaccinationData.vaccineName,
              dateGiven: vaccinationData.dateGiven,
              nextDueDate: vaccinationData.nextDueDate,
              veterinarian: vaccinationData.veterinarian,
              userEmail: userEmail,
              timestamp: new Date().toISOString()
            }),
          });
          toast.success('Email de confirmação enviado!');
        } catch (error) {
          toast.error('Erro ao enviar email de confirmação');
        }
      }
      
      toast.success('Vacina registrada com sucesso!');
    } catch (error) {
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

  return {
    // State
    selectedPetForModal,
    setSelectedPetForModal,
    editProfileModalOpen,
    setEditProfileModalOpen,
    editPetModalOpen,
    setEditPetModalOpen,
    addVaccinationModalOpen,
    setAddVaccinationModalOpen,
    addReminderModalOpen,
    setAddReminderModalOpen,
    addExpenseModalOpen,
    setAddExpenseModalOpen,
    
    // Handlers
    handleAddReminder,
    handleAddExpense,
    handleEditPet,
    handleAddVaccination,
    handleEditProfile,
    handleSaveProfile,
    handleSavePet,
    handleSaveVaccination,
    handleSaveReminder,
    handleSaveExpense,
  };
};

import React from 'react';
import EditProfileModal from '../EditProfileModal';
import EditPetModal from '../EditPetModal';
import AddVaccinationModal from '../AddVaccinationModal';
import AddReminderModal from '../AddReminderModal';
import AddExpenseModal from '../AddExpenseModal';
import { User, Pet } from '../../types/pet';

interface ModalManagerProps {
  // Profile Modal
  editProfileModalOpen: boolean;
  setEditProfileModalOpen: (open: boolean) => void;
  user: User | null;
  handleSaveProfile: (userData: Partial<User>) => Promise<void>;
  uploadUserPhoto: (file: File, userId?: string) => Promise<string | null>;

  // Pet Modal
  editPetModalOpen: boolean;
  setEditPetModalOpen: (open: boolean) => void;
  selectedPetForModal: Pet | undefined;
  setSelectedPetForModal: (pet: Pet | undefined) => void;
  handleSavePet: (petData: any, photoFile?: File) => Promise<void>;
  uploadPetPhoto: (file: File, petId?: string) => Promise<string | null>;

  // Other Modals
  addVaccinationModalOpen: boolean;
  setAddVaccinationModalOpen: (open: boolean) => void;
  addReminderModalOpen: boolean;
  setAddReminderModalOpen: (open: boolean) => void;
  addExpenseModalOpen: boolean;
  setAddExpenseModalOpen: (open: boolean) => void;

  // Data
  pets: Pet[];
  handleSaveVaccination: (data: any) => Promise<void>;
  handleSaveReminder: (data: any) => Promise<void>;
  handleSaveExpense: (data: any) => Promise<void>;
}

const ModalManager: React.FC<ModalManagerProps> = ({
  editProfileModalOpen,
  setEditProfileModalOpen,
  user,
  handleSaveProfile,
  uploadUserPhoto,
  editPetModalOpen,
  setEditPetModalOpen,
  selectedPetForModal,
  setSelectedPetForModal,
  handleSavePet,
  uploadPetPhoto,
  addVaccinationModalOpen,
  setAddVaccinationModalOpen,
  addReminderModalOpen,
  setAddReminderModalOpen,
  addExpenseModalOpen,
  setAddExpenseModalOpen,
  pets,
  handleSaveVaccination,
  handleSaveReminder,
  handleSaveExpense
}) => {
  return (
    <>
      <EditProfileModal
        user={user!}
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
    </>
  );
};

export default ModalManager;

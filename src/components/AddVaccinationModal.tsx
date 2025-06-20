
import React, { useState } from 'react';
import { X, Save, Syringe } from 'lucide-react';
import { Vaccination } from '../types/pet';

interface AddVaccinationModalProps {
  petId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (vaccination: Omit<Vaccination, 'id'>) => void;
}

const AddVaccinationModal: React.FC<AddVaccinationModalProps> = ({ petId, isOpen, onClose, onSave }) => {
  const [vaccineName, setVaccineName] = useState('');
  const [customVaccineName, setCustomVaccineName] = useState('');
  const [dateGiven, setDateGiven] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');
  const [veterinarian, setVeterinarian] = useState('');
  const [notes, setNotes] = useState('');

  const commonVaccines = [
    'DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)',
    'Rabies',
    'Giardia',
    'Canine Influenza',
    'Leishmaniasis',
    'FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)',
    'Feline Rabies',
    'FeLV (Feline Leukemia)',
    'Bordetella',
    'Lyme Disease',
    'Leptospirosis'
  ];

  const handleSave = () => {
    const finalVaccineName = vaccineName === 'custom' ? customVaccineName.trim() : vaccineName;
    if (!finalVaccineName || !dateGiven) return;

    onSave({
      petId,
      vaccineName: finalVaccineName,
      dateGiven,
      nextDueDate: nextDueDate || '',
      veterinarian: veterinarian.trim(),
      notes: notes.trim(),
      imageUrl: undefined
    });

    // Reset form
    setVaccineName('');
    setCustomVaccineName('');
    setDateGiven('');
    setNextDueDate('');
    setVeterinarian('');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Syringe className="mr-2 text-primary" size={20} />
            Add Vaccination
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vaccine Name *
            </label>
            <select
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a vaccine</option>
              {commonVaccines.map(vaccine => (
                <option key={vaccine} value={vaccine}>{vaccine}</option>
              ))}
              <option value="custom">Other (Custom Vaccine)</option>
            </select>
            
            {vaccineName === 'custom' && (
              <input
                type="text"
                value={customVaccineName}
                onChange={(e) => setCustomVaccineName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                placeholder="Enter custom vaccine name"
                required
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Given *
            </label>
            <input
              type="date"
              value={dateGiven}
              onChange={(e) => setDateGiven(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Due Date
            </label>
            <input
              type="date"
              value={nextDueDate}
              onChange={(e) => setNextDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Veterinarian
            </label>
            <input
              type="text"
              value={veterinarian}
              onChange={(e) => setVeterinarian(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Veterinarian name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Notes about the vaccination"
              rows={3}
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={(!vaccineName || (vaccineName === 'custom' && !customVaccineName.trim())) || !dateGiven}
            className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <Save size={16} className="mr-2" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVaccinationModal;

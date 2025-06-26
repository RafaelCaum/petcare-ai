
import React, { useState } from 'react';
import { X, Calendar, User, Syringe, FileText, Zap } from 'lucide-react';
import { Pet } from '../types/pet';
import { toast } from 'sonner';

interface AddVaccinationModalProps {
  pets: Pet[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (vaccinationData: any) => void;
}

const AddVaccinationModal: React.FC<AddVaccinationModalProps> = ({
  pets,
  isOpen,
  onClose,
  onSave,
}) => {
  const [petId, setPetId] = useState('');
  const [vaccineName, setVaccineName] = useState('');
  const [dateGiven, setDateGiven] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');
  const [veterinarian, setVeterinarian] = useState('');
  const [notes, setNotes] = useState('');
  const [sendEmailConfirmation, setSendEmailConfirmation] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!petId || !vaccineName || !dateGiven || !nextDueDate || !veterinarian) {
      toast.error('Please fill in all required fields');
      return;
    }

    const vaccinationData = {
      petId,
      vaccineName,
      dateGiven,
      nextDueDate,
      veterinarian,
      notes: notes || null,
      zapierWebhook: sendEmailConfirmation ? 'https://hooks.zapier.com/hooks/catch/default/webhook' : null,
    };

    await onSave(vaccinationData);
    handleClose();
  };

  const handleClose = () => {
    setPetId('');
    setVaccineName('');
    setDateGiven('');
    setNextDueDate('');
    setVeterinarian('');
    setNotes('');
    setSendEmailConfirmation(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">New Vaccination</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pet *
            </label>
            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a pet</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Syringe className="inline w-4 h-4 mr-1" />
              Vaccine Name *
            </label>
            <input
              type="text"
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. DHPP, Rabies"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Date Given *
            </label>
            <input
              type="date"
              value={dateGiven}
              onChange={(e) => setDateGiven(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Next Due Date *
            </label>
            <input
              type="date"
              value={nextDueDate}
              onChange={(e) => setNextDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              Veterinarian *
            </label>
            <input
              type="text"
              value={veterinarian}
              onChange={(e) => setVeterinarian(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dr. Veterinarian name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Additional notes..."
            />
          </div>

          {/* Email Confirmation Section */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                id="sendEmail"
                checked={sendEmailConfirmation}
                onChange={(e) => setSendEmailConfirmation(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="sendEmail" className="text-sm font-medium text-gray-700 flex items-center">
                <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                Send email confirmation
              </label>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register Vaccine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVaccinationModal;

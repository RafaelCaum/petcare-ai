
import React, { useState } from 'react';
import { X, Save, Bell } from 'lucide-react';
import { Reminder } from '../types/pet';

interface AddReminderModalProps {
  petId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: Omit<Reminder, 'id'>) => void;
}

const AddReminderModal: React.FC<AddReminderModalProps> = ({ petId, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'vaccine' | 'vet' | 'grooming' | 'bath' | 'medication' | 'other'>('vet');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [emailReminder, setEmailReminder] = useState(true);
  const [smsReminder, setSmsReminder] = useState(false);

  const reminderTypes = [
    { value: 'vaccine', label: 'Vaccination' },
    { value: 'vet', label: 'Veterinary Appointment' },
    { value: 'grooming', label: 'Grooming' },
    { value: 'bath', label: 'Bath' },
    { value: 'medication', label: 'Medication' },
    { value: 'other', label: 'Other' }
  ];

  const handleSave = () => {
    if (!title.trim() || !date || !time) return;

    onSave({
      petId,
      title: title.trim(),
      type,
      date,
      time,
      notes: notes.trim(),
      completed: false,
      emailReminder,
      smsReminder
    });

    // Reset form
    setTitle('');
    setType('vet');
    setDate('');
    setTime('');
    setNotes('');
    setEmailReminder(true);
    setSmsReminder(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Bell className="mr-2 text-primary" size={20} />
            Add Reminder
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Routine checkup"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {reminderTypes.map(reminderType => (
                <option key={reminderType.value} value={reminderType.value}>
                  {reminderType.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Notes about the reminder"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Notifications
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={emailReminder}
                  onChange={(e) => setEmailReminder(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                />
                <span className="text-sm">Email Reminder</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={smsReminder}
                  onChange={(e) => setSmsReminder(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                />
                <span className="text-sm">SMS Reminder</span>
              </label>
            </div>
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
            disabled={!title.trim() || !date || !time}
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

export default AddReminderModal;

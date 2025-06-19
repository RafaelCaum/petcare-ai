
import React, { useState } from 'react';
import { X, Save, DollarSign } from 'lucide-react';
import { Expense } from '../types/pet';

interface AddExpenseModalProps {
  petId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id'>) => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ petId, isOpen, onClose, onSave }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'grooming' | 'vet' | 'food' | 'toys' | 'supplies' | 'medication' | 'other'>('vet');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const expenseCategories = [
    { value: 'vet', label: 'Veterinário' },
    { value: 'food', label: 'Alimentação' },
    { value: 'grooming', label: 'Banho e Tosa' },
    { value: 'medication', label: 'Medicamentos' },
    { value: 'toys', label: 'Brinquedos' },
    { value: 'supplies', label: 'Suprimentos' },
    { value: 'other', label: 'Outros' }
  ];

  const handleSave = () => {
    const numericAmount = parseFloat(amount);
    if (!description.trim() || !numericAmount || numericAmount <= 0) return;

    onSave({
      petId,
      amount: numericAmount,
      category,
      description: description.trim(),
      date,
      notes: notes.trim()
    });

    // Reset form
    setAmount('');
    setCategory('vet');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <DollarSign className="mr-2 text-primary" size={20} />
            Adicionar Despesa
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0,00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {expenseCategories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: Consulta de rotina"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Observações sobre a despesa"
              rows={3}
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!description.trim() || !amount || parseFloat(amount) <= 0}
            className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <Save size={16} className="mr-2" />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;

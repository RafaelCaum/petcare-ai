
import React from 'react';

interface PetFormFieldsProps {
  name: string;
  setName: (name: string) => void;
  type: 'dog' | 'cat';
  setType: (type: 'dog' | 'cat') => void;
  breed: string;
  setBreed: (breed: string) => void;
  birthDate: string;
  setBirthDate: (date: string) => void;
  gender: 'male' | 'female';
  setGender: (gender: 'male' | 'female') => void;
  weight: number;
  setWeight: (weight: number) => void;
  color: string;
  setColor: (color: string) => void;
}

const PetFormFields: React.FC<PetFormFieldsProps> = ({
  name,
  setName,
  type,
  setType,
  breed,
  setBreed,
  birthDate,
  setBirthDate,
  gender,
  setGender,
  weight,
  setWeight,
  color,
  setColor
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Pet *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm focus:shadow-md transition-shadow"
          placeholder="Nome do seu pet"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo *
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'dog' | 'cat')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm focus:shadow-md transition-shadow"
        >
          <option value="dog">Cão</option>
          <option value="cat">Gato</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Raça
        </label>
        <input
          type="text"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm focus:shadow-md transition-shadow"
          placeholder="Raça do pet"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data de Nascimento
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm focus:shadow-md transition-shadow"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sexo
        </label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as 'male' | 'female')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm focus:shadow-md transition-shadow"
        >
          <option value="male">Macho</option>
          <option value="female">Fêmea</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Peso (kg)
        </label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm focus:shadow-md transition-shadow"
          placeholder="Peso em kg"
          min="0"
          step="0.1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cor
        </label>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm focus:shadow-md transition-shadow"
          placeholder="Cor do pet"
        />
      </div>
    </div>
  );
};

export default PetFormFields;

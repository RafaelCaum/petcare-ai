
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Pet } from '../types/pet';
import PetPhotoUpload from './pet/PetPhotoUpload';
import PetFormFields from './pet/PetFormFields';

interface EditPetModalProps {
  pet?: Pet;
  isOpen: boolean;
  onClose: () => void;
  onSave: (petData: Omit<Pet, 'id'>, photoFile?: File) => void;
  onUploadPhoto?: (file: File, petId?: string) => Promise<string | null>;
}

const EditPetModal: React.FC<EditPetModalProps> = ({ 
  pet, 
  isOpen, 
  onClose, 
  onSave, 
  onUploadPhoto 
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'dog' | 'cat'>('dog');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState(0);
  const [color, setColor] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (pet) {
        setName(pet.name || '');
        setType(pet.type || 'dog');
        setBreed(pet.breed || '');
        setBirthDate(pet.birthDate || '');
        setGender(pet.gender || 'male');
        setWeight(pet.weight || 0);
        setColor(pet.color || '');
        setPhotoPreview(pet.photoUrl || null);
      } else {
        setName('');
        setType('dog');
        setBreed('');
        setBirthDate('');
        setGender('male');
        setWeight(0);
        setColor('');
        setPhotoPreview(null);
      }
      setSelectedFile(null);
    }
  }, [isOpen, pet]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(pet?.photoUrl || null);
    setSelectedFile(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Por favor, insira o nome do pet');
      return;
    }

    try {
      setUploading(true);
      
      const petData = {
        name: name.trim(),
        type,
        breed: breed.trim(),
        birthDate,
        gender,
        weight: Number(weight) || 0,
        color: color.trim(),
        avatar: type === 'dog' ? '🐕' : '🐱',
        photoUrl: pet?.photoUrl || undefined
      };

      await onSave(petData, selectedFile || undefined);
      onClose();
    } catch (error) {
      console.error('Error saving pet:', error);
      alert('Erro ao salvar pet. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl hover:shadow-2xl transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {pet ? 'Editar Pet' : 'Adicionar Pet'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <PetPhotoUpload
            photoPreview={photoPreview}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onRemovePhoto={handleRemovePhoto}
            isEditing={!!pet}
          />

          <PetFormFields
            name={name}
            setName={setName}
            type={type}
            setType={setType}
            breed={breed}
            setBreed={setBreed}
            birthDate={birthDate}
            setBirthDate={setBirthDate}
            gender={gender}
            setGender={setGender}
            weight={weight}
            setWeight={setWeight}
            color={color}
            setColor={setColor}
          />
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || uploading}
            className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            <Save size={16} className="mr-2" />
            {uploading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPetModal;

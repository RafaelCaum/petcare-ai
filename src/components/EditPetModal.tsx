
import React, { useState, useEffect } from 'react';
import { X, Save, Camera, Upload } from 'lucide-react';
import { Pet } from '../types/pet';

interface EditPetModalProps {
  pet?: Pet;
  isOpen: boolean;
  onClose: () => void;
  onSave: (petData: Omit<Pet, 'id'>) => void;
  onUploadPhoto?: (file: File, petId: string) => Promise<string | null>;
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

  // Reset form when modal opens/closes or pet changes
  useEffect(() => {
    if (isOpen) {
      if (pet) {
        // Editing existing pet
        setName(pet.name || '');
        setType(pet.type || 'dog');
        setBreed(pet.breed || '');
        setBirthDate(pet.birthDate || '');
        setGender(pet.gender || 'male');
        setWeight(pet.weight || 0);
        setColor(pet.color || '');
        setPhotoPreview(pet.photoUrl || null);
      } else {
        // Adding new pet - reset all fields
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

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      setUploading(true);

      let photoUrl = pet?.photoUrl;

      // If there's a new file and we're editing an existing pet, upload it
      if (selectedFile && pet?.id && onUploadPhoto) {
        console.log('Uploading photo for pet:', pet.id);
        photoUrl = await onUploadPhoto(selectedFile, pet.id);
        console.log('Photo upload result:', photoUrl);
      }

      const petData = {
        name: name.trim(),
        type,
        breed: breed.trim(),
        birthDate,
        gender,
        weight: Number(weight) || 0,
        color: color.trim(),
        avatar: type === 'dog' ? '🐕' : '🐱',
        photoUrl: photoUrl || undefined
      };

      console.log('Saving pet data:', petData);
      onSave(petData);
      onClose();
    } catch (error) {
      console.error('Error saving pet:', error);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {pet ? 'Edit Pet' : 'Add Pet'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Photo Upload Section */}
          <div className="text-center">
            <div className="mb-4">
              {photoPreview ? (
                <div className="relative w-24 h-24 mx-auto">
                  <img
                    src={photoPreview}
                    alt="Pet preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                  />
                  <button
                    onClick={() => {
                      setPhotoPreview(null);
                      setSelectedFile(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                  <Camera size={32} className="text-gray-400" />
                </div>
              )}
            </div>
            
            <label className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg cursor-pointer hover:bg-primary/20 transition-colors">
              <Upload size={16} className="mr-2" />
              Add Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pet Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your pet's name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'dog' | 'cat')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Breed
            </label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Pet breed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birth Date
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (lbs)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Weight in lbs"
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Pet color"
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
            disabled={!name.trim() || uploading}
            className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <Save size={16} className="mr-2" />
            {uploading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPetModal;

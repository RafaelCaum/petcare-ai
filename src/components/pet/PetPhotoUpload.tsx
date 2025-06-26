
import React from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface PetPhotoUploadProps {
  photoPreview: string | null;
  selectedFile: File | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
  isEditing: boolean;
}

const PetPhotoUpload: React.FC<PetPhotoUploadProps> = ({
  photoPreview,
  selectedFile,
  onFileSelect,
  onRemovePhoto,
  isEditing
}) => {
  return (
    <div className="text-center">
      <div className="mb-4">
        {photoPreview ? (
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={photoPreview}
              alt="Pet preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 shadow-lg"
            />
            <button
              onClick={onRemovePhoto}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center shadow-md">
            <Camera size={32} className="text-gray-400" />
          </div>
        )}
      </div>
      
      <label className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg cursor-pointer hover:bg-primary/20 transition-colors shadow-sm hover:shadow-md">
        <Upload size={16} className="mr-2" />
        {isEditing ? 'Alterar Foto' : 'Adicionar Foto'}
        <input
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default PetPhotoUpload;

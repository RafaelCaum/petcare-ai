
import React, { useState } from 'react';
import { X, Save, Camera, Upload } from 'lucide-react';
import { User } from '../types/pet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
  onUploadPhoto?: (file: File) => Promise<string | null>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  onSave, 
  onUploadPhoto 
}) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user.photoUrl || null);
  const [uploading, setUploading] = useState(false);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setPhone(user.phone || '');
      setSelectedFile(null);
      setPhotoPreview(user.photoUrl || null);
      setUploading(false);
    }
  }, [isOpen, user]);

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
    try {
      setUploading(true);

      let finalPhotoUrl = user.photoUrl;

      // If there's a new file, upload it first
      if (selectedFile && onUploadPhoto) {
        console.log('Uploading new photo...');
        const uploadedUrl = await onUploadPhoto(selectedFile);
        if (uploadedUrl) {
          finalPhotoUrl = uploadedUrl;
          console.log('Photo uploaded successfully:', uploadedUrl);
        }
      }

      // Save the user data including the new photo URL
      const updatedUserData = { 
        name, 
        phone,
        photoUrl: finalPhotoUrl
      };

      console.log('Saving user data:', updatedUserData);
      await onSave(updatedUserData);
      
      // Force a small delay to ensure state update
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Photo Upload Section */}
          <div className="text-center">
            <div className="mb-4">
              <Avatar className="w-24 h-24 mx-auto border-4 border-blue-200">
                <AvatarImage 
                  src={photoPreview || ''} 
                  alt="Profile preview" 
                />
                <AvatarFallback className="bg-gray-100 text-gray-400">
                  <Camera size={32} />
                </AvatarFallback>
              </Avatar>
              
              {photoPreview && (
                <button
                  onClick={() => {
                    setPhotoPreview(null);
                    setSelectedFile(null);
                  }}
                  className="mt-2 text-red-500 hover:text-red-700 text-sm"
                >
                  Remove Photo
                </button>
              )}
            </div>
            
            <label className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
              <Upload size={16} className="mr-2" />
              {photoPreview ? 'Change Photo' : 'Add Photo'}
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
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your phone number"
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
            disabled={uploading}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <Save size={16} className="mr-2" />
            {uploading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;

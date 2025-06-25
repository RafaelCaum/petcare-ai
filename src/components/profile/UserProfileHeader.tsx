
import React from 'react';
import { User as UserType } from '../../types/pet';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface UserProfileHeaderProps {
  user: UserType | null;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ user }) => {
  console.log('UserProfileHeader rendering with user:', user);
  console.log('User photoUrl:', user?.photoUrl);

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-6">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <Avatar className="w-20 h-20 border-4 border-white/20">
            {user?.photoUrl && (
              <AvatarImage 
                src={user.photoUrl} 
                alt={user?.name || 'Profile'} 
                className="object-cover w-full h-full"
                onLoad={() => console.log('Avatar image loaded successfully:', user?.photoUrl)}
                onError={(e) => {
                  console.log('Avatar image failed to load:', user?.photoUrl);
                  console.log('Error event:', e);
                }}
              />
            )}
            <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white mb-1">
            {user?.name || 'Tutor do Pet'}
          </h1>
          <p className="text-blue-100 text-sm mb-1">
            {user?.email}
          </p>
          {user?.phone && (
            <p className="text-blue-100 text-sm">
              {user.phone}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;

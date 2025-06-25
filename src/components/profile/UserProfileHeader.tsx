
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
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 mb-6">
      <div className="flex items-center space-x-6">
        <div className="flex-shrink-0">
          <Avatar className="w-24 h-24 border-4 border-white/20">
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
            <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-white mb-2">
            {user?.name || 'Tutor do Pet'}
          </h1>
          <p className="text-blue-100 text-base mb-2">
            {user?.email}
          </p>
          {user?.phone && (
            <p className="text-blue-100 text-base">
              📞 {user.phone}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;

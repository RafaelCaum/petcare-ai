
import React from 'react';
import { Crown } from 'lucide-react';
import { User as UserType } from '../../types/pet';

interface PremiumFeaturesProps {
  user: UserType | null;
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ user }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="font-semibold mb-4 flex items-center text-gray-900">
        <Crown className="mr-2 text-yellow-500" size={20} />
        Premium Features
      </h2>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center flex-1 min-w-0">
            <span className="mr-3 text-lg">📧</span>
            <span className="text-sm text-gray-700 truncate">Email & SMS Reminders</span>
          </div>
          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full whitespace-nowrap ml-2">
            Active
          </span>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center flex-1 min-w-0">
            <span className="mr-3 text-lg">🏥</span>
            <span className="text-sm text-gray-700 truncate">Vet Directory & Emergency SOS</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
            user?.subscriptionStatus === 'active' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {user?.subscriptionStatus === 'active' ? 'Active' : 'Premium'}
          </span>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center flex-1 min-w-0">
            <span className="mr-3 text-lg">🍽️</span>
            <span className="text-sm text-gray-700 truncate">Healthy Food & Treats Section</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
            user?.subscriptionStatus === 'active' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {user?.subscriptionStatus === 'active' ? 'Active' : 'Premium'}
          </span>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center flex-1 min-w-0">
            <span className="mr-3 text-lg">🎂</span>
            <span className="text-sm text-gray-700 truncate">Birthday Celebrations & Offers</span>
          </div>
          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full whitespace-nowrap ml-2">
            Active
          </span>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center flex-1 min-w-0">
            <span className="mr-3 text-lg">🛡️</span>
            <span className="text-sm text-gray-700 truncate">Pet Insurance Integration</span>
          </div>
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap ml-2">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatures;

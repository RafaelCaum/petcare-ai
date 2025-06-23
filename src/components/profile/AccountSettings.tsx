
import React from 'react';
import { User, CreditCard, Calendar, Settings } from 'lucide-react';

interface AccountSettingsProps {
  onEditProfile: () => void;
  onManageSubscription: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onEditProfile, onManageSubscription }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="font-semibold mb-6 flex items-center text-gray-900">
        <Settings className="mr-2 text-gray-600" size={20} />
        Account Settings
      </h2>
      
      <div className="space-y-3">
        <button
          onClick={onEditProfile}
          className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group border border-gray-200"
        >
          <div className="flex items-center flex-1 min-w-0">
            <User size={18} className="mr-3 text-gray-500 flex-shrink-0" />
            <span className="text-gray-700 font-medium truncate">Edit Profile</span>
          </div>
          <div className="text-gray-400 group-hover:text-gray-600 transition-colors ml-2 flex-shrink-0">›</div>
        </button>
        
        <button 
          onClick={onManageSubscription}
          className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group border border-gray-200"
        >
          <div className="flex items-center flex-1 min-w-0">
            <CreditCard size={18} className="mr-3 text-gray-500 flex-shrink-0" />
            <span className="text-gray-700 font-medium truncate">Manage Subscription</span>
          </div>
          <div className="text-gray-400 group-hover:text-gray-600 transition-colors ml-2 flex-shrink-0">›</div>
        </button>
        
        <button className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group border border-gray-200">
          <div className="flex items-center flex-1 min-w-0">
            <Calendar size={18} className="mr-3 text-gray-500 flex-shrink-0" />
            <span className="text-gray-700 font-medium truncate">Notifications</span>
          </div>
          <div className="text-gray-400 group-hover:text-gray-600 transition-colors ml-2 flex-shrink-0">›</div>
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;

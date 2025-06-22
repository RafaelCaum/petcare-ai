
import React from 'react';
import { User, Crown, Calendar, CreditCard, Settings, LogOut, Star } from 'lucide-react';
import { User as UserType } from '../types/pet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ProfilePageProps {
  user: UserType | null;
  onEditProfile: () => void;
  onManageSubscription: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onEditProfile, onManageSubscription }) => {
  const getTrialDaysLeft = () => {
    if (!user || user.subscriptionStatus !== 'trial') return 0;
    
    const trialStart = new Date(user.trialStartDate);
    const trialEnd = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const daysLeft = Math.ceil((trialEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, daysLeft);
  };

  const trialDaysLeft = getTrialDaysLeft();

  const subscriptionInfo = {
    trial: {
      status: 'Free Trial',
      description: `${trialDaysLeft} days remaining`,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200'
    },
    active: {
      status: 'Premium Member',
      description: 'All features unlocked',
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200'
    },
    cancelled: {
      status: 'Cancelled',
      description: 'Subscription will end soon',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200'
    },
    expired: {
      status: 'Expired',
      description: 'Upgrade to continue using premium features',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200'
    }
  };

  const currentSubInfo = user ? subscriptionInfo[user.subscriptionStatus] : subscriptionInfo.expired;

  console.log('ProfilePage user data:', user);
  console.log('User photoUrl:', user?.photoUrl);

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* User Profile Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20 border-4 border-white/20">
            <AvatarImage 
              src={user?.photoUrl || ''} 
              alt={user?.name || 'Profile'} 
            />
            <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white truncate">
              {user?.name || 'Pet Parent'}
            </h1>
            <p className="text-blue-100 text-sm truncate">
              {user?.email}
            </p>
            {user?.phone && (
              <p className="text-blue-100 text-sm truncate">
                {user.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className={`rounded-2xl p-6 border-2 ${currentSubInfo.bgColor}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Crown className={`mr-2 ${currentSubInfo.color}`} size={20} />
            <h2 className="font-semibold text-gray-900">Subscription Status</h2>
          </div>
          <span className={`text-sm font-medium ${currentSubInfo.color} px-3 py-1 rounded-full bg-white/50`}>
            {currentSubInfo.status}
          </span>
        </div>
        
        <p className="text-gray-700 mb-4 text-sm">
          {currentSubInfo.description}
        </p>
        
        {user?.subscriptionStatus === 'trial' && trialDaysLeft <= 2 && (
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
            <p className="text-yellow-800 text-sm font-medium">
              ⚠️ Trial ending soon! Upgrade to continue using Pet Care.
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onManageSubscription}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm font-medium"
          >
            <CreditCard size={16} className="mr-2" />
            {user?.subscriptionStatus === 'trial' || user?.subscriptionStatus === 'expired' 
              ? 'Upgrade to Premium' 
              : 'Manage Subscription'
            }
          </button>
          {user?.subscriptionStatus === 'active' && (
            <button className="px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Star size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Premium Features */}
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

      {/* Account Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold mb-4 flex items-center text-gray-900">
          <Settings className="mr-2 text-gray-600" size={20} />
          Account Settings
        </h2>
        
        <div className="space-y-1">
          <button
            onClick={onEditProfile}
            className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
          >
            <User size={16} className="mr-3 text-gray-500 flex-shrink-0" />
            <span className="text-gray-700 text-sm">Edit Profile Information</span>
          </button>
          
          <button className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
            <Calendar size={16} className="mr-3 text-gray-500 flex-shrink-0" />
            <span className="text-gray-700 text-sm">Notification Preferences</span>
          </button>
          
          <button className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
            <CreditCard size={16} className="mr-3 text-gray-500 flex-shrink-0" />
            <span className="text-gray-700 text-sm">Payment Methods</span>
          </button>
        </div>
      </div>

      {/* Support & Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold mb-4 text-gray-900">Support & Information</h2>
        
        <div className="space-y-1 text-sm">
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded transition-colors text-gray-600">
            Help & FAQ
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded transition-colors text-gray-600">
            Contact Support
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded transition-colors text-gray-600">
            Privacy Policy
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded transition-colors text-gray-600">
            Terms of Service
          </button>
        </div>
      </div>

      {/* Sign Out */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <button className="w-full text-left p-3 hover:bg-red-50 rounded-lg transition-colors flex items-center text-red-600">
          <LogOut size={16} className="mr-3 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

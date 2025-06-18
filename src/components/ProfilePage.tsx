
import React from 'react';
import { User, Crown, Calendar, CreditCard, Settings, LogOut, Star } from 'lucide-react';
import { User as UserType } from '../types/pet';

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
      color: 'text-warning',
      bgColor: 'bg-warning/10 border-warning/20'
    },
    active: {
      status: 'Premium Member',
      description: 'All features unlocked',
      color: 'text-success',
      bgColor: 'bg-success/10 border-success/20'
    },
    cancelled: {
      status: 'Cancelled',
      description: 'Subscription will end soon',
      color: 'text-danger',
      bgColor: 'bg-danger/10 border-danger/20'
    },
    expired: {
      status: 'Expired',
      description: 'Upgrade to continue using premium features',
      color: 'text-danger',
      bgColor: 'bg-danger/10 border-danger/20'
    }
  };

  const currentSubInfo = user ? subscriptionInfo[user.subscriptionStatus] : subscriptionInfo.expired;

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* User Profile Header */}
      <div className="pet-card bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.name || 'Pet Parent'}</h1>
            <p className="text-primary-foreground/80">{user?.email}</p>
            {user?.phone && (
              <p className="text-primary-foreground/80 text-sm">{user.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className={`pet-card border-2 ${currentSubInfo.bgColor}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Crown className={`mr-2 ${currentSubInfo.color}`} size={20} />
            <h2 className="font-semibold">Subscription Status</h2>
          </div>
          <span className={`text-sm font-medium ${currentSubInfo.color}`}>
            {currentSubInfo.status}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4">{currentSubInfo.description}</p>
        
        {user?.subscriptionStatus === 'trial' && trialDaysLeft <= 2 && (
          <div className="bg-warning/20 border border-warning rounded-lg p-3 mb-4">
            <p className="text-warning-dark text-sm font-medium">
              ⚠️ Trial ending soon! Upgrade to continue using Pet Care.
            </p>
          </div>
        )}
        
        <div className="flex space-x-2">
          <button
            onClick={onManageSubscription}
            className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center"
          >
            <CreditCard size={16} className="mr-2" />
            {user?.subscriptionStatus === 'trial' || user?.subscriptionStatus === 'expired' 
              ? 'Upgrade to Premium' 
              : 'Manage Subscription'
            }
          </button>
          {user?.subscriptionStatus === 'active' && (
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Star size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Premium Features */}
      <div className="pet-card">
        <h2 className="font-semibold mb-4 flex items-center">
          <Crown className="mr-2 text-accent" size={20} />
          Premium Features
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <span className="mr-3">📧</span>
              <span>Email & SMS Reminders</span>
            </div>
            <span className="text-xs bg-success text-white px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <span className="mr-3">🏥</span>
              <span>Vet Directory & Emergency SOS</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              user?.subscriptionStatus === 'active' 
                ? 'bg-success text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {user?.subscriptionStatus === 'active' ? 'Active' : 'Premium'}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <span className="mr-3">🍽️</span>
              <span>Healthy Food & Treats Section</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              user?.subscriptionStatus === 'active' 
                ? 'bg-success text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {user?.subscriptionStatus === 'active' ? 'Active' : 'Premium'}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <span className="mr-3">🎂</span>
              <span>Birthday Celebrations & Offers</span>
            </div>
            <span className="text-xs bg-success text-white px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <span className="mr-3">🛡️</span>
              <span>Pet Insurance Integration</span>
            </div>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="pet-card">
        <h2 className="font-semibold mb-4 flex items-center">
          <Settings className="mr-2 text-gray-600" size={20} />
          Account Settings
        </h2>
        
        <div className="space-y-2">
          <button
            onClick={onEditProfile}
            className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
          >
            <User size={16} className="mr-3 text-gray-500" />
            Edit Profile Information
          </button>
          
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
            <Calendar size={16} className="mr-3 text-gray-500" />
            Notification Preferences
          </button>
          
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
            <CreditCard size={16} className="mr-3 text-gray-500" />
            Payment Methods
          </button>
        </div>
      </div>

      {/* Support & Info */}
      <div className="pet-card">
        <h2 className="font-semibold mb-4">Support & Information</h2>
        
        <div className="space-y-2 text-sm">
          <button className="w-full text-left p-2 hover:bg-gray-50 rounded transition-colors text-gray-600">
            Help & FAQ
          </button>
          <button className="w-full text-left p-2 hover:bg-gray-50 rounded transition-colors text-gray-600">
            Contact Support
          </button>
          <button className="w-full text-left p-2 hover:bg-gray-50 rounded transition-colors text-gray-600">
            Privacy Policy
          </button>
          <button className="w-full text-left p-2 hover:bg-gray-50 rounded transition-colors text-gray-600">
            Terms of Service
          </button>
        </div>
      </div>

      {/* Sign Out */}
      <div className="pet-card">
        <button className="w-full text-left p-3 hover:bg-red-50 rounded-lg transition-colors flex items-center text-danger">
          <LogOut size={16} className="mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;


import React from 'react';
import { User, Settings, CreditCard, Bell, HelpCircle, LogOut, Shield, Star } from 'lucide-react';
import { User as UserType } from '../types/pet';

interface ProfilePageProps {
  user: UserType;
  onEditProfile: () => void;
  onManageSubscription: () => void;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  user, 
  onEditProfile, 
  onManageSubscription,
  onLogout 
}) => {
  const getSubscriptionStatus = () => {
    switch (user.subscriptionStatus) {
      case 'trial':
        return { text: 'Free Trial', color: 'bg-blue-100 text-blue-800', icon: '🆓' };
      case 'active':
        return { text: 'Premium', color: 'bg-green-100 text-green-800', icon: '⭐' };
      case 'cancelled':
        return { text: 'Cancelled', color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' };
      case 'expired':
        return { text: 'Expired', color: 'bg-red-100 text-red-800', icon: '❌' };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: '❓' };
    }
  };

  const subscription = getSubscriptionStatus();

  const calculateTrialDaysLeft = () => {
    if (user.subscriptionStatus !== 'trial') return 0;
    
    const trialStart = new Date(user.trialStartDate);
    const now = new Date();
    const daysPassed = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - daysPassed);
  };

  const trialDaysLeft = calculateTrialDaysLeft();

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Header */}
      <div className="pet-card bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-primary-foreground/80">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${subscription.color}`}>
            <span className="mr-1">{subscription.icon}</span>
            {subscription.text}
          </div>
          {user.subscriptionStatus === 'trial' && (
            <div className="text-right">
              <div className="text-sm text-primary-foreground/80">Trial ends in</div>
              <div className="text-lg font-bold">{trialDaysLeft} days</div>
            </div>
          )}
        </div>
      </div>

      {/* Trial Alert */}
      {user.subscriptionStatus === 'trial' && trialDaysLeft <= 3 && (
        <div className="pet-card bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400">
          <div className="flex items-center">
            <Star className="text-yellow-500 mr-3" size={24} />
            <div>
              <h3 className="font-semibold text-yellow-800">Trial ending soon!</h3>
              <p className="text-sm text-yellow-700">
                Upgrade to Premium for just $49/month to keep all your pet data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Account Settings */}
      <div className="pet-card">
        <h2 className="font-semibold mb-4 flex items-center">
          <Settings className="mr-2 text-primary" size={20} />
          Account Settings
        </h2>
        
        <div className="space-y-3">
          <button
            onClick={onEditProfile}
            className="profile-menu-item"
          >
            <User size={20} className="text-gray-500" />
            <span>Edit Profile</span>
          </button>
          
          <button
            onClick={onManageSubscription}
            className="profile-menu-item"
          >
            <CreditCard size={20} className="text-gray-500" />
            <span>Manage Subscription</span>
          </button>
          
          <div className="profile-menu-item cursor-not-allowed opacity-50">
            <Bell size={20} className="text-gray-500" />
            <span>Notifications</span>
            <span className="text-xs text-gray-400 ml-auto">Coming Soon</span>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="pet-card">
        <h2 className="font-semibold mb-4 flex items-center">
          <HelpCircle className="mr-2 text-primary" size={20} />
          Support & Help
        </h2>
        
        <div className="space-y-3">
          <div className="profile-menu-item cursor-not-allowed opacity-50">
            <HelpCircle size={20} className="text-gray-500" />
            <span>Help Center</span>
            <span className="text-xs text-gray-400 ml-auto">Coming Soon</span>
          </div>
          
          <div className="profile-menu-item cursor-not-allowed opacity-50">
            <Shield size={20} className="text-gray-500" />
            <span>Privacy Policy</span>
            <span className="text-xs text-gray-400 ml-auto">Coming Soon</span>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="pet-card">
        <h2 className="font-semibold mb-4">Account Information</h2>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{user.email}</span>
          </div>
          
          {user.phone && (
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{user.phone}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600">Member since:</span>
            <span className="font-medium">
              {new Date(user.trialStartDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="pet-card">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center text-red-600 hover:text-red-700 py-3 transition-colors"
        >
          <LogOut size={20} className="mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;


import React from 'react';
import { Crown, CreditCard, Star } from 'lucide-react';
import { User as UserType } from '../../types/pet';

interface SubscriptionStatusProps {
  user: UserType | null;
  onManageSubscription: () => void;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ user, onManageSubscription }) => {
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

  return (
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
  );
};

export default SubscriptionStatus;

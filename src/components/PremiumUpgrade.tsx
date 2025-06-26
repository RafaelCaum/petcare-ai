
import React from 'react';
import { Crown, Check, ArrowRight } from 'lucide-react';

interface PremiumUpgradeProps {
  onUpgrade: () => void;
  onClose?: () => void;
  trialExpired?: boolean;
}

const PremiumUpgrade: React.FC<PremiumUpgradeProps> = ({ onUpgrade, onClose, trialExpired = false }) => {
  const features = [
    'Unlimited pets',
    'Advanced vaccination tracking',
    'Email reminders and notifications',
    'Expense tracking and reports',
    'Priority customer support',
    'Cloud backup & sync'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="mb-4">
            <Crown className="w-16 h-16 mx-auto text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {trialExpired ? 'Your Free Trial Has Ended' : 'Upgrade to PetCare Premium'}
          </h1>
          <p className="text-gray-600">
            {trialExpired ? 'Continue using all premium features' : 'To unlock all premium features'}
          </p>
        </div>

        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-gray-800">R$ 9,99</div>
            <div className="text-gray-600">per month</div>
            <div className="text-sm text-blue-600 font-medium mt-1">
              Instant access after payment
            </div>
          </div>

          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onUpgrade}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>{trialExpired ? 'Continue with Premium' : 'Subscribe Now'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Cancel anytime. Secure payment via Stripe.
        </p>

        {onClose && !trialExpired && (
          <button
            onClick={onClose}
            className="w-full mt-4 text-gray-600 hover:text-gray-800 py-2 transition-colors"
          >
            Maybe later
          </button>
        )}
      </div>
    </div>
  );
};

export default PremiumUpgrade;

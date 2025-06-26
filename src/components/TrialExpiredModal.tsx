
import React from 'react';
import { Crown, ArrowRight } from 'lucide-react';

interface TrialExpiredModalProps {
  onUpgrade: () => void;
}

const TrialExpiredModal: React.FC<TrialExpiredModalProps> = ({ onUpgrade }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 mx-4">
        <div className="text-center mb-8">
          <div className="mb-4">
            <Crown className="w-16 h-16 mx-auto text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Free Trial Has Ended
          </h1>
          <p className="text-gray-600">
            To continue using PetCare AI, please upgrade to our Premium plan.
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

          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Unlimited pets</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Advanced vaccination tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Email reminders and notifications</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Expense tracking and reports</span>
            </div>
          </div>
        </div>

        <button
          onClick={onUpgrade}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>Upgrade Now</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Cancel anytime. Secure payment via Stripe.
        </p>
      </div>
    </div>
  );
};

export default TrialExpiredModal;

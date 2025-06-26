
import React from 'react';

interface TrialStatusBarProps {
  status: string;
  trialDaysLeft: number;
  isPaying: boolean;
}

const TrialStatusBar: React.FC<TrialStatusBarProps> = ({ status, trialDaysLeft, isPaying }) => {
  const getTrialMessage = (trialDaysLeft: number, status: string) => {
    if (status === 'expired') return 'Trial expired';
    if (status === 'active') return 'Premium Active';
    if (trialDaysLeft === 1) return '1 day free trial';
    return `${trialDaysLeft} days free trial`;
  };

  if (status === 'free') {
    return (
      <div className="bg-blue-100 border-l-4 border-blue-400 p-2 text-sm">
        <p className="text-blue-800 text-center font-medium">
          {getTrialMessage(trialDaysLeft, status)}
        </p>
      </div>
    );
  }

  if (status === 'expired' && !isPaying) {
    return (
      <div className="bg-red-100 border-l-4 border-red-400 p-2 text-sm">
        <p className="text-red-800 text-center font-medium">
          Trial expired
        </p>
      </div>
    );
  }

  if (status === 'active') {
    return (
      <div className="bg-green-100 border-l-4 border-green-400 p-2 text-sm">
        <p className="text-green-800 text-center font-medium">
          Premium Active
        </p>
      </div>
    );
  }

  return null;
};

export default TrialStatusBar;


import { useEffect } from 'react';

interface UseAccessControlProps {
  userEmail: string | null;
  status: string;
  isPaying: boolean;
  nextDueDate: string | null;
  premiumLoading: boolean;
  checkPremiumStatus: () => void;
}

export const useAccessControl = ({
  userEmail,
  status,
  isPaying,
  nextDueDate,
  premiumLoading,
  checkPremiumStatus
}: UseAccessControlProps) => {
  const shouldBlockAccess = () => {
    if (status === 'active') return false;
    if (status === 'free') return false;
    
    if (status === 'expired') {
      if (!isPaying) return true;
      
      if (nextDueDate) {
        const dueDate = new Date(nextDueDate);
        const today = new Date();
        if (today > dueDate) return true;
      }
    }
    
    return false;
  };

  useEffect(() => {
    if (userEmail && !premiumLoading) {
      checkPremiumStatus();
    }
  }, [userEmail]);

  return { shouldBlockAccess };
};

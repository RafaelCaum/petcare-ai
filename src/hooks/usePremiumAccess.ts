
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PremiumStatus {
  isPremium: boolean;
  status: 'free' | 'active' | 'expired';
  trialDaysLeft: number;
  trialExpired: boolean;
  loading: boolean;
  isPaying: boolean;
  nextDueDate: string | null;
}

export const usePremiumAccess = (userEmail: string | null) => {
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    status: 'free',
    trialDaysLeft: 7,
    trialExpired: false,
    loading: true,
    isPaying: false,
    nextDueDate: null
  });

  const checkPremiumStatus = async () => {
    if (!userEmail) {
      setPremiumStatus(prev => ({ ...prev, loading: false, isPremium: false }));
      return;
    }

    try {
      console.log('Checking premium status for:', userEmail);
      
      const { data, error } = await supabase.functions.invoke('check-premium-status');
      
      if (error) {
        console.error('Error checking premium status:', error);
        setPremiumStatus(prev => ({ ...prev, loading: false, isPremium: false }));
        return;
      }

      console.log('Premium status response:', data);
      
      setPremiumStatus({
        isPremium: data.isPremium || false,
        status: data.status || 'free',
        trialDaysLeft: data.trialDaysLeft || 0,
        trialExpired: data.trialExpired || false,
        loading: false,
        isPaying: data.isPaying || false,
        nextDueDate: data.nextDueDate || null
      });
    } catch (error) {
      console.error('Error in checkPremiumStatus:', error);
      setPremiumStatus(prev => ({ ...prev, loading: false, isPremium: false }));
    }
  };

  const createCheckoutSession = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        console.error('Error creating checkout session:', error);
        toast.error('Error creating checkout session');
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error in createCheckoutSession:', error);
      toast.error('Error creating checkout session');
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Error opening customer portal:', error);
        toast.error('Error opening customer portal');
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error in openCustomerPortal:', error);
      toast.error('Error opening customer portal');
    }
  };

  useEffect(() => {
    checkPremiumStatus();
  }, [userEmail]);

  return {
    ...premiumStatus,
    checkPremiumStatus,
    createCheckoutSession,
    openCustomerPortal
  };
};

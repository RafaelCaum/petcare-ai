
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PremiumStatus {
  isPremium: boolean;
  status: 'free' | 'active' | 'inactive';
  trialDaysLeft: number;
  trialExpired: boolean;
  loading: boolean;
}

export const usePremiumAccess = (userEmail: string | null) => {
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    status: 'inactive',
    trialDaysLeft: 0,
    trialExpired: false,
    loading: true
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
        status: data.status || 'inactive',
        trialDaysLeft: data.trialDaysLeft || 0,
        trialExpired: data.trialExpired || false,
        loading: false
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

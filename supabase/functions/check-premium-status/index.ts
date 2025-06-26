
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-PREMIUM] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get user data from database to check trial start date and payment status
    const { data: userDbData, error: userDbError } = await supabaseClient
      .from('users')
      .select('trial_start_date, subscription_status, is_paying, next_due_date')
      .eq('email', user.email)
      .single();

    if (userDbError) {
      logStep("Error fetching user data", { error: userDbError });
      throw new Error(`Error fetching user data: ${userDbError.message}`);
    }

    const trialStartDate = new Date(userDbData.trial_start_date);
    const currentDate = new Date();
    const daysSinceStart = Math.floor((currentDate.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const trialDaysLeft = Math.max(0, 7 - daysSinceStart);
    const trialExpired = daysSinceStart >= 7;

    logStep("Trial calculation", { 
      trialStartDate: trialStartDate.toISOString(), 
      daysSinceStart, 
      trialDaysLeft, 
      trialExpired 
    });

    // Check payment status
    const isPaying = userDbData.is_paying || false;
    const nextDueDate = userDbData.next_due_date;
    
    // Check if subscription is expired based on next_due_date
    let subscriptionExpired = false;
    if (nextDueDate) {
      const dueDate = new Date(nextDueDate);
      subscriptionExpired = currentDate > dueDate;
    }

    logStep("Payment status", { isPaying, nextDueDate, subscriptionExpired });

    // Check Stripe subscription if we have a Stripe key (fallback)
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    let stripeHasActiveSub = false;
    
    if (stripeKey) {
      try {
        const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        
        if (customers.data.length > 0) {
          const customerId = customers.data[0].id;
          const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: "active",
            limit: 1,
          });
          stripeHasActiveSub = subscriptions.data.length > 0;
          logStep("Stripe check completed", { customerId, stripeHasActiveSub });
        }
      } catch (stripeError) {
        logStep("Stripe check failed", { error: stripeError });
        // Continue without Stripe check if it fails
      }
    }

    // Determine if user has premium access
    const hasPremiumAccess = (isPaying && !subscriptionExpired) || stripeHasActiveSub;

    // Determine status
    let status: 'free' | 'active' | 'expired';
    if (hasPremiumAccess) {
      status = 'active';
    } else if (trialExpired) {
      status = 'expired';
    } else {
      status = 'free';
    }

    logStep("Final status determined", { 
      status, 
      hasPremiumAccess, 
      trialExpired, 
      trialDaysLeft,
      isPaying,
      subscriptionExpired
    });

    return new Response(JSON.stringify({
      isPremium: hasPremiumAccess,
      status,
      trialDaysLeft,
      trialExpired,
      isPaying,
      nextDueDate
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ 
      error: errorMessage,
      isPremium: false,
      status: 'free',
      trialDaysLeft: 0,
      trialExpired: true,
      isPaying: false,
      nextDueDate: null
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

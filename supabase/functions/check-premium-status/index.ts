
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
    
    logStep("User authenticated", { email: user.email });

    // Check if user exists in users table, if not create with free trial
    const { data: userRecord, error: userCheckError } = await supabaseClient
      .from('users')
      .select('trial_ends_at, is_premium, created_at')
      .eq('email', user.email)
      .single();

    if (userCheckError && userCheckError.code !== 'PGRST116') {
      throw new Error(`Error checking user: ${userCheckError.message}`);
    }

    const now = new Date();
    let trialEndsAt = userRecord?.trial_ends_at ? new Date(userRecord.trial_ends_at) : null;
    
    // If user doesn't exist or doesn't have trial set, create/update with 7-day trial
    if (!userRecord || !trialEndsAt) {
      trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7);
      
      await supabaseClient.from('users').upsert({
        email: user.email,
        trial_ends_at: trialEndsAt.toISOString(),
        is_premium: false
      }, { onConflict: 'email' });
      
      logStep("Created/updated user with trial", { trialEndsAt });
    }

    // Calculate days left in trial
    const timeDiff = trialEndsAt.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const trialExpired = daysLeft <= 0;

    logStep("Trial calculation", { daysLeft, trialExpired });

    // Check premium status from premium_users table
    const { data: premiumUser } = await supabaseClient
      .from('premium_users')
      .select('status')
      .eq('email', user.email)
      .single();

    const isPremiumActive = premiumUser?.status === 'active';
    
    // Determine final status
    let finalStatus: 'free' | 'active' | 'expired';
    let isPremium: boolean;

    if (isPremiumActive) {
      finalStatus = 'active';
      isPremium = true;
    } else if (trialExpired) {
      finalStatus = 'expired';
      isPremium = false;
    } else {
      finalStatus = 'free';
      isPremium = true; // Still in trial, so has access
    }

    logStep("Final status", { isPremium, finalStatus, daysLeft });

    return new Response(JSON.stringify({
      isPremium,
      status: finalStatus,
      trialDaysLeft: Math.max(0, daysLeft),
      trialExpired
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

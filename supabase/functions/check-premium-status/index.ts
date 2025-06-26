
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

    // Check trial period first
    const { data: userRecord } = await supabaseClient
      .from('users')
      .select('trial_ends_at, is_premium')
      .eq('email', user.email)
      .single();

    const now = new Date();
    const trialEndsAt = userRecord?.trial_ends_at ? new Date(userRecord.trial_ends_at) : null;
    const isInTrial = trialEndsAt && now < trialEndsAt;

    logStep("Trial check", { isInTrial, trialEndsAt });

    if (isInTrial) {
      return new Response(JSON.stringify({
        isPremium: true,
        status: 'trial',
        trialEndsAt: trialEndsAt?.toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check Stripe subscription
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found");
      await supabaseClient.from("users").update({
        is_premium: false
      }).eq("email", user.email);

      return new Response(JSON.stringify({ isPremium: false, status: 'inactive' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSubscription = subscriptions.data.length > 0;
    let nextPayment = null;

    if (hasActiveSubscription) {
      const subscription = subscriptions.data[0];
      nextPayment = new Date(subscription.current_period_end * 1000).toISOString();
      
      // Update premium_users table
      await supabaseClient.from("premium_users").upsert({
        email: user.email,
        stripe_customer_id: customerId,
        status: 'active',
        next_payment: nextPayment,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
    }

    // Update users table
    await supabaseClient.from("users").update({
      is_premium: hasActiveSubscription
    }).eq("email", user.email);

    logStep("Premium status updated", { isPremium: hasActiveSubscription });

    return new Response(JSON.stringify({
      isPremium: hasActiveSubscription,
      status: hasActiveSubscription ? 'active' : 'inactive',
      nextPayment
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

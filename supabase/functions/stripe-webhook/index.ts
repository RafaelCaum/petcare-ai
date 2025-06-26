
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
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
    logStep("Webhook received");

    if (req.method !== "POST") {
      logStep("Invalid method", { method: req.method });
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    const payload = await req.json();
    logStep("Payload received", payload);

    const { email, status, next_due_date } = payload;

    if (!email || !status) {
      logStep("Missing required fields", { email, status });
      return new Response("Missing required fields: email, status", { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    logStep("Processing payment update", { email, status, next_due_date });

    // Find user by email
    const { data: user, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (userError || !user) {
      logStep("User not found", { email, error: userError });
      return new Response("User not found", { 
        status: 404, 
        headers: corsHeaders 
      });
    }

    logStep("User found", { userId: user.id, userEmail: user.email });

    // Update user payment status
    const updateData: any = {};
    
    if (status === 'paid') {
      updateData.is_paying = true;
      updateData.subscription_status = 'active';
      
      if (next_due_date) {
        updateData.next_due_date = next_due_date;
      }
      
      logStep("Setting user as paid", updateData);
    } else {
      updateData.is_paying = false;
      updateData.subscription_status = 'cancelled';
      logStep("Setting user as not paid", updateData);
    }

    const { error: updateError } = await supabaseClient
      .from('users')
      .update(updateData)
      .eq('email', email.toLowerCase().trim());

    if (updateError) {
      logStep("Error updating user", { error: updateError });
      throw updateError;
    }

    logStep("User updated successfully", { email, status, next_due_date });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Payment status updated successfully" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

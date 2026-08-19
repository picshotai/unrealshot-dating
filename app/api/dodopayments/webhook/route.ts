import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";
import { getDodoPaymentsClient } from "@/lib/dodopayments";
import { createAdminClient } from "@/utils/supabase/admin";
import crypto from "crypto";

const webhook = new Webhook(process.env.DODO_WEBHOOK_SECRET!);

// Webhook event types we care about
const RELEVANT_EVENTS = [
  'payment.succeeded',
  'payment.failed',
  'checkout_session.completed',
  'checkout_session.expired'
];

// Handle successful payment
async function handlePaymentCompleted(payload: any, supabase: any) {
  const paymentId = payload.data.payment_id;
  const checkoutSessionId = payload.data.checkout_session_id;
  
  // Find the payment record in our database
  const { data: paymentRecord, error: fetchError } = await supabase
    .from('dodo_payments')
    .select('*')
    .or(`dodo_payment_id.eq.${paymentId},dodo_checkout_session_id.eq.${checkoutSessionId}`)
    .single();

  if (fetchError || !paymentRecord) {
    console.error('Payment record not found:', fetchError);
    throw new Error(`Payment record not found for payment_id: ${paymentId}`);
  }

  // Claim the payment before granting anything.
  //
  // Dodo retries webhooks, and this handler adds credits. The status transition
  // is the idempotency key: the update only matches while the row is still
  // unpaid, so exactly one delivery can win and go on to credit the account. A
  // retry — or a second delivery racing this one — matches zero rows and stops
  // here instead of granting a second pack.
  const { data: claimed, error: updateError } = await supabase
    .from('dodo_payments')
    .update({
      status: 'completed',
      dodo_payment_id: paymentId // Ensure we have the payment ID
    })
    .eq('id', paymentRecord.id)
    .neq('status', 'completed')
    .select('id');

  if (updateError) {
    console.error('Failed to update payment status:', updateError);
    throw new Error('Failed to update payment status');
  }

  if (!claimed || claimed.length === 0) {
    console.log(
      `Payment ${paymentRecord.id} was already completed — skipping credit grant`
    );
    return;
  }

  // Create subscription record
  const { error: subscriptionError } = await supabase
    .from('dodo_subscriptions')
    .insert({
      user_id: paymentRecord.user_id,
      dodo_checkout_session_id: checkoutSessionId,
      status: 'active',
      created_at: new Date().toISOString()
    });

  if (subscriptionError) {
    console.error('Failed to create subscription:', subscriptionError);
    // Don't throw here as payment is still successful
  }

  // Add credits to user account
  const creditsToAdd = paymentRecord.credits;
  if (creditsToAdd && creditsToAdd > 0) {
    // Check if user already has credits
    const { data: existingCredits } = await supabase
      .from('credits')
      .select('*')
      .eq('user_id', paymentRecord.user_id)
      .single();

    if (existingCredits) {
      // Update existing credits
      const { error: creditUpdateError } = await supabase
        .from('credits')
        .update({ 
          credits: existingCredits.credits + creditsToAdd 
        })
        .eq('user_id', paymentRecord.user_id);

      if (creditUpdateError) {
        console.error('Failed to update user credits:', creditUpdateError);
        throw new Error('Failed to update user credits');
      }
    } else {
      // Create new credits record
      const { error: creditInsertError } = await supabase
        .from('credits')
        .insert({
          user_id: paymentRecord.user_id,
          credits: creditsToAdd
        });

      if (creditInsertError) {
        console.error('Failed to create user credits:', creditInsertError);
        throw new Error('Failed to create user credits');
      }
    }
  }

  console.error(`Payment completed successfully for user ${paymentRecord.user_id}, added ${creditsToAdd} credits`);
}

// Handle failed payment
async function handlePaymentFailed(payload: any, supabase: any) {
  const paymentId = payload.data.payment_id;
  const checkoutSessionId = payload.data.checkout_session_id;
  
  // Find the payment record in our database
  const { data: paymentRecord, error: fetchError } = await supabase
    .from('dodo_payments')
    .select('*')
    .or(`dodo_payment_id.eq.${paymentId},dodo_checkout_session_id.eq.${checkoutSessionId}`)
    .single();

  if (fetchError || !paymentRecord) {
    console.error('Payment record not found for failed payment:', fetchError);
    throw new Error(`Payment record not found for payment_id: ${paymentId}`);
  }

  // Update payment status to failed with additional metadata
  const { error: updateError } = await supabase
    .from('dodo_payments')
    .update({ 
      status: 'failed',
      dodo_payment_id: paymentId,
      failure_reason: payload.data.failure_reason || 'Payment processing failed',
      updated_at: new Date().toISOString()
    })
    .eq('id', paymentRecord.id);

  if (updateError) {
    console.error('Failed to update payment status to failed:', updateError);
    throw new Error('Failed to update payment status to failed');
  }

  // Removed: console.log(`Payment failed for user ${paymentRecord.user_id}, payment_id: ${paymentId}, reason: ${payload.data.failure_reason || 'Unknown'}`);
}

// Handle expired checkout session
async function handleCheckoutSessionExpired(payload: any, supabase: any) {
  const checkoutSessionId = payload.data.checkout_session_id;
  
  // Find the payment record in our database
  const { data: paymentRecord, error: fetchError } = await supabase
    .from('dodo_payments')
    .select('*')
    .eq('dodo_checkout_session_id', checkoutSessionId)
    .single();

  if (fetchError || !paymentRecord) {
    console.error('Payment record not found for expired checkout session:', fetchError);
    throw new Error(`Payment record not found for checkout_session_id: ${checkoutSessionId}`);
  }

  // Update payment status to failed due to expiration
  const { error: updateError } = await supabase
    .from('dodo_payments')
    .update({ 
      status: 'failed',
      failure_reason: 'Checkout session expired',
      updated_at: new Date().toISOString()
    })
    .eq('id', paymentRecord.id);

  if (updateError) {
    console.error('Failed to update payment status for expired session:', updateError);
    throw new Error('Failed to update payment status for expired session');
  }

  // Removed: console.log(`Checkout session expired for user ${paymentRecord.user_id}, session_id: ${checkoutSessionId}`);
}

export async function POST(request: Request) {
  const supabase = createAdminClient();
  const headersList = await headers();
  
  try {
    const rawBody = await request.text();
    const webhookHeaders = {
      "webhook-id": headersList.get("webhook-id") || "",
      "webhook-signature": headersList.get("webhook-signature") || "",
      "webhook-timestamp": headersList.get("webhook-timestamp") || "",
    };
    
    await webhook.verify(rawBody, webhookHeaders);
    const payload = JSON.parse(rawBody);
    
    // Log the webhook event
    const eventId = payload.id || crypto.randomUUID();
    
    const { error: logError } = await supabase
      .from('dodo_webhook_events')
      .insert({
        dodo_event_id: eventId,
        event_type: payload.type,
        data: payload,
        processed: false
      });

    if (logError) {
      console.error('Failed to log webhook event:', logError);
    }

    // Only process relevant events
    if (!RELEVANT_EVENTS.includes(payload.type)) {
      return Response.json({ message: "Event type not handled" }, { status: 200 });
    }

    // Process the event based on type
    let processingError = null;
    try {
      if (payload.data.payload_type === "Subscription") {
        switch (payload.type) {
          case "subscription.active":
            const subscription = await getDodoPaymentsClient().subscriptions.retrieve(payload.data.subscription_id);
            // Removed subscription console logs
            // Removed payment data console logs
            break;
          case "subscription.failed":
            break;
          case "subscription.cancelled":
            break;
          case "subscription.renewed":
            break;
          case "subscription.on_hold":
            break
          default:
            break;
        }
      } else if (payload.data.payload_type === "Payment") {
        switch (payload.type) {
          case "payment.succeeded":
            const paymentDataResp = await getDodoPaymentsClient().payments.retrieve(payload.data.payment_id);
            // Removed payment data console logs
            await handlePaymentCompleted(payload, supabase);
            break;
          case "payment.failed":
            await handlePaymentFailed(payload, supabase);
            break;
          default:
            break;
        }
      } else if (payload.data.payload_type === "CheckoutSession") {
        switch (payload.type) {
          case "checkout_session.completed":
            // Checkout session completed - payment should be handled by payment.succeeded event
            // Removed subscription logging
            // Removed payment data logging
            // Removed: Payment completed success info log
            break;
          case "checkout_session.expired":
            await handleCheckoutSessionExpired(payload, supabase);
            break;
          default:
            break;
        }
      }
    } catch (error) {
      processingError = error;
      console.error('Webhook processing error:', error);
    }

    // Mark webhook as processed (or failed)
    const updateData: any = {
      processed: processingError === null,
      processed_at: new Date().toISOString()
    };
    
    if (processingError) {
      updateData.error_message = processingError instanceof Error ? processingError.message : String(processingError);
      updateData.retry_count = 1; // Initial retry count
    }

    await supabase
      .from('dodo_webhook_events')
      .update(updateData)
      .eq('dodo_event_id', eventId);

    if (processingError) {
      return Response.json({ message: "Webhook processing failed", error: updateData.error_message }, { status: 500 });
    }

    return Response.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Replaced webhook verification logs
    // console.log(" ----- webhook verification failed -----")
    // console.log(error)
    console.error("Webhook verification failed", error)
    return Response.json(
      { message: "Webhook verification failed" },
      { status: 400 }
    );
  }
}

// GET endpoint for webhook verification
export async function GET() {
  return Response.json(
    { message: "DodoPayments webhook endpoint is active" },
    { status: 200 }
  );
}
import { getDodoPaymentsClient } from "@/lib/dodopayments";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { SHOOT_CREDIT_COST, TOTAL_PHOTOS } from "@/lib/dating/types";
import { z } from "zod";

const productCartItemSchema = z.object({
    product_id: z.string().min(1, "Product ID is required"),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
    amount: z.number().int().min(0).optional(),
});

const attachExistingCustomerSchema = z.object({
    customer_id: z.string().min(1, "Customer ID is required"),
});

const newCustomerSchema = z.object({
    email: z.string().email("Invalid email format"),
    name: z.string().min(1, "Name is required"),
    phone_number: z.string().optional().nullable(),
    create_new_customer: z.boolean().optional(),
});

const customerSchema = z.union([attachExistingCustomerSchema, newCustomerSchema]);

const billingAddressSchema = z.object({
    city: z.string().min(1, "City is required"),
    country: z.string().regex(/^[A-Z]{2}$/, "Country must be a 2-letter uppercase ISO code"),
    state: z.string().min(1, "State is required"),
    street: z.string().min(1, "Street address is required"),
    zipcode: z.string().min(1, "Zipcode is required"),
});

const checkoutSessionSchema = z.object({
    productCart: z.array(productCartItemSchema).min(1, "At least one product is required"),
    customer: customerSchema,
    billing_address: billingAddressSchema,
    return_url: z.string().url("Return URL must be a valid URL"),
    customMetadata: z.record(z.string(), z.string()).optional(),
});

// Legacy checkout schema for backward compatibility
const legacyCheckoutSchema = z.object({
    planId: z.string().min(1, "Plan ID is required"),
    userId: z.string().min(1, "User ID is required"),
    returnUrl: z.string().url("Return URL must be a valid URL").optional(),
});

// Fetch pricing plan from database or fallback to single Dating Shoot plan
async function getPricingPlan(planId: string, supabase: any) {
  const envProductId = process.env.DODO_PRODUCT_ID || process.env.DODO_DATING_PRODUCT_ID;

  const { data: plan } = await supabase
    .from('dodo_pricing_plans')
    .select('*')
    .eq('is_active', true)
    .maybeSingle();

  if (plan) {
    return {
      id: plan.id,
      name: plan.name,
      price: parseFloat(plan.price),
      credits: plan.credits,
      productId: envProductId || plan.dodo_product_id,
      currency: plan.currency || 'USD'
    };
  }

  // Fallback default for the Complete Dating Shoot ($39).
  // Credits must cover SHOOT_CREDIT_COST or the buyer cannot start the shoot
  // they just paid for. The 30 free reshoots are granted separately on the
  // order row and do not come out of this balance.
  return {
    id: planId || 'dating-pack-39',
    name: `${TOTAL_PHOTOS} Photo Dating Pack`,
    price: 39,
    credits: SHOOT_CREDIT_COST,
    productId: envProductId || 'p_dating_39',
    currency: 'USD'
  };
}

// Centralized helper to create a DodoPayments checkout session without duplicating payload setup
async function createCheckoutSession(args: {
    productCart: { product_id: string; quantity: number; amount?: number }[];
    returnUrl: string;
    metadata?: Record<string, string>;
}) {
    const { productCart, returnUrl, metadata } = args;
    const client = getDodoPaymentsClient();

    return client.checkoutSessions.create({
        allowed_payment_method_types: ["credit", "debit", "upi_collect", "upi_intent", "paypal"],
        confirm: false,
        customization: {
            show_on_demand_tag: true,
            show_order_details: true,
            theme: "light",
        },
        feature_flags: {
            allow_currency_selection: false,
            allow_discount_code: true,
            allow_phone_number_collection: false,
            allow_tax_id: false,
        },
        product_cart: productCart,
        return_url: returnUrl,
        metadata,
        show_saved_payment_methods: true,
    });
}

export async function POST(request: NextRequest) {
    const supabase = createAdminClient();
    
    try {
        const body = await request.json();

        // Check if this is a legacy checkout request
        const legacyValidation = legacyCheckoutSchema.safeParse(body);
        if (legacyValidation.success) {
            // Handle legacy checkout flow
            const { planId, userId, returnUrl } = legacyValidation.data;

            if (!planId || !userId) {
                return NextResponse.json({ message: "Missing required details" }, { status: 400 });
            }

            // Fetch plan from database
            const plan = await getPricingPlan(planId, supabase);
            if (!plan) {
                return NextResponse.json({ message: "Invalid plan" }, { status: 400 });
            }

            const finalPrice = plan.price;
            const finalReturnUrl = returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`;

            // Create checkout session (centralized helper to avoid duplication)
            const session = await createCheckoutSession({
                productCart: [{
                    product_id: plan.productId,
                    quantity: 1,
                    amount: Math.round(finalPrice * 100)
                }],
                returnUrl: finalReturnUrl,
                metadata: {
                    user_id: userId,
                    pricing_plan_id: planId,
                    credits: plan.credits.toString()
                }
            });

            // Store the checkout session in our database for tracking
            const { error: insertError } = await supabase
                .from('dodo_payments')
                .insert({
                    dodo_payment_id: session.session_id,
                    dodo_checkout_session_id: session.session_id,
                    user_id: userId,
                    amount: finalPrice,
                    currency: 'USD',
                    status: 'pending',
                    pricing_plan_id: planId,
                    credits: plan.credits,
                    metadata: {
                        user_id: userId,
                        pricing_plan_id: planId,
                        credits: plan.credits.toString(),
                        checkout_session_id: session.session_id
                    }
                });

            if (insertError) {
                console.error('Database insert error:', insertError);
                // Continue anyway, as the checkout session was created successfully
            }

            return NextResponse.json({
                success: true,
                session_id: session.session_id,
                checkout_url: session.checkout_url,
                amount: finalPrice,
                credits: plan.credits
            });
        }

        // Handle new checkout flow
        const validationResult = checkoutSessionSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.issues.map(issue => ({
                        field: issue.path.join('.'),
                        message: issue.message
                    }))
                },
                { status: 400 }
            );
        }

        const { productCart, customer, billing_address, return_url, customMetadata } = validationResult.data;

        // New checkout flow uses the same centralized helper (no customer/billing passed)
        const session = await createCheckoutSession({
            productCart,
            returnUrl: return_url,
            metadata: customMetadata
        });

        return NextResponse.json(session);
    } catch (error) {
        console.error('Error in checkout POST handler:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET endpoint to retrieve checkout session status
export async function GET(request: NextRequest) {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.json({ message: "Session ID required" }, { status: 400 });
    }

    try {
        // Get session status from our database
        const { data: payment, error } = await supabase
            .from('dodo_payments')
            .select('*')
            .or(`dodo_payment_id.eq.${sessionId},dodo_checkout_session_id.eq.${sessionId}`)
            .single();

        if (error) {
            return NextResponse.json({ message: "Payment not found" }, { status: 404 });
        }

        return NextResponse.json({
            session_id: payment.dodo_payment_id,
            status: payment.status,
            amount: payment.amount,
            credits: payment.credits,
            created_at: payment.created_at
        });

    } catch (error) {
        console.error('Get checkout session error:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
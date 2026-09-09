import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { pricingPlanService } from '@/lib/pricing-plans';
import PreviewPageClient from './PreviewPageClient';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ modelId: string }>;
}

export default async function PreviewPage({ params }: PageProps) {
    const { modelId } = await params;
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    // Verify model belongs to user
    const { data: model, error: modelError } = await supabase
        .from('models')
        .select('id, user_id, name')
        .eq('id', parseInt(modelId))
        .single();

    if (modelError || !model || model.user_id !== user.id) {
        redirect('/dating-shoot');
    }

    // Check if user has already paid (if so, redirect to dashboard)
    const { data: payments } = await supabase
        .from('dodo_payments')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .limit(1);

    const hasPaymentHistory = payments && payments.length > 0;

    // Check if user has credits
    const { data: credits } = await supabase
        .from('credits')
        .select('credits')
        .eq('user_id', user.id)
        .single();

    const hasCredits = credits?.credits && credits.credits > 0;

    // If user has paid or has credits, they should be on the dashboard
    if (hasPaymentHistory || hasCredits) {
        redirect('/dating-shoot');
    }

    // Fetch pricing plans for payment cards
    let plans: Array<{
        id: string;
        name: string;
        price: number;
        credits: number;
        isPopular?: boolean;
    }> = [];

    try {
        const plansData = await pricingPlanService.getPlansWithValue();
        plans = plansData.map((plan, index) => ({
            id: plan.id,
            name: plan.name,
            price: parseFloat(plan.price.toString()),
            credits: plan.credits,
            isPopular: index === 1,
        }));
    } catch (error) {
        console.error('Error loading pricing plans:', error);
    }

    return <PreviewPageClient userId={user.id} plans={plans} />;
}

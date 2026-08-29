import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Check, ShieldCheck, Zap } from 'lucide-react';
import DodoCheckoutButton from '@/components/dodopayments/DodoCheckoutButton';
import { commonPageMetadata } from '@/lib/seo';
import {
  CUSTOM_CREDITS_DEFAULT,
  FRAMES_PER_SHOOT,
  SHOOT_CREDIT_COST,
  SHOOTS_PER_DELIVERY,
  TOTAL_PHOTOS,
} from '@/lib/dating/types';
import { ShineBorder } from "@/components/ui/shine-border";

export const metadata: Metadata = commonPageMetadata.buyCredits();

export default async function BuyCreditsPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login?redirect=/buy-credits');
  }

  // Fetch plan from database if present, otherwise default to the $39 pack
  const { data: dbPlan } = await supabase
    .from('dodo_pricing_plans')
    .select('*')
    .eq('is_active', true)
    .maybeSingle();

  const plan = {
    id: dbPlan?.id || 'dating-pack-39',
    name: dbPlan?.name || `${TOTAL_PHOTOS} Photo Dating Pack`,
    price: dbPlan ? parseFloat(dbPlan.price.toString()) : 39,
    // A pack must cover the cost of the shoot it promises.
    credits: dbPlan?.credits || SHOOT_CREDIT_COST,
    currency: dbPlan?.currency || 'USD',
  };

  // "No two alike" is gone with the compositional library: a shoot repeats its
  // outfit across four frames on purpose, and that repetition is what makes the
  // set read like real photographs of one day rather than a grid of one-offs.
  const features = [
    `${SHOOTS_PER_DELIVERY} separate shoots, ${TOTAL_PHOTOS} photos in total`,
    "A different place, outfit and light in every shoot",
    `${FRAMES_PER_SHOOT} shots from each — close, half-body, full-length and a candid`,
    `${CUSTOM_CREDITS_DEFAULT} Photo Retakes included — redo any individual photo you don't love`,
    "Every scene planned for variety and every generated prompt mechanically validated before rendering",
    "Instant ZIP download, one folder per shoot",
    "Full commercial rights",
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs uppercase tracking-widest border-accent/40 text-accent">
          <Sparkles className="w-3 h-3 mr-1.5 inline" />
          Single Overhaul Package
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          {SHOOTS_PER_DELIVERY} shoots. {TOTAL_PHOTOS} photos.
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
          Pay once, own forever. Delivered in ~90 minutes directly to your dashboard.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <Card className="relative bg-zinc-950 border-zinc-800 text-left overflow-hidden shadow-2xl">
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
          
          <CardHeader className="text-center pb-4 pt-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge className="bg-white text-black font-semibold text-xs uppercase tracking-wider">
                Full Photoshoot Pack
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold text-white mt-1">
              Complete Dating Photoshoot
            </CardTitle>
            <CardDescription className="text-zinc-400 text-sm">
              {TOTAL_PHOTOS} photos from {SHOOTS_PER_DELIVERY} separate shoots
            </CardDescription>

            <div className="mt-6 flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold tracking-tight text-white">
                ${plan.price}
              </span>
              <span className="text-zinc-400 text-sm font-mono">one-time</span>
              <span className="ml-2 text-xs bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded font-mono">
                ${(plan.price / TOTAL_PHOTOS).toFixed(2)} / photo
              </span>
            </div>
          </CardHeader>

          <CardContent className="px-6 md:px-8 py-6 border-t border-zinc-800/80">
            <ul className="space-y-3.5 text-sm">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300">
                  <span className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-6 md:px-8 pb-8 pt-2">
            <DodoCheckoutButton
              planId={plan.id}
              userId={user.id}
              amount={plan.price}
              credits={plan.credits}
              planName={plan.name}
              className="w-full bg-white text-black hover:bg-zinc-200 py-6 text-base font-bold uppercase tracking-wider transition-all"
            >
              Get your {TOTAL_PHOTOS} photos (${plan.price}) →
            </DodoCheckoutButton>

            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Secure checkout powered by DodoPayments</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

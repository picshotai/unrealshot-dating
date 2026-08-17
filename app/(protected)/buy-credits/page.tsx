import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Check, ShieldCheck, Zap } from 'lucide-react';
import DodoCheckoutButton from '@/components/dodopayments/DodoCheckoutButton';
import { commonPageMetadata } from '@/lib/seo';
import { ShineBorder } from "@/components/ui/shine-border";

export const metadata: Metadata = commonPageMetadata.buyCredits();

export default async function BuyCreditsPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login?redirect=/buy-credits');
  }

  // Fetch plan from database if present, otherwise default to $59 Dating Pack
  const { data: dbPlan } = await supabase
    .from('dodo_pricing_plans')
    .select('*')
    .eq('is_active', true)
    .maybeSingle();

  const plan = {
    id: dbPlan?.id || 'dating-pack-59',
    name: dbPlan?.name || '100 Dating Photoshoot Pack',
    price: dbPlan ? parseFloat(dbPlan.price.toString()) : 59,
    credits: dbPlan?.credits || 30,
    currency: dbPlan?.currency || 'USD',
  };

  const features = [
    "100 Ultra-Realistic Dating Photos (20 per style)",
    "5 Proven Archetypes: Anchor, Social, Travel, Active & Street",
    "30 Custom Regeneration Credits Included",
    "Fast ~90-Minute Delivery",
    "No Awkward Gym Selfies or Stiff AI Mannequin Poses",
    "Instant ZIP Download with Organized Style Folders",
    "Full Commercial Rights & 100% Privacy Auto-Delete",
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs uppercase tracking-widest border-accent/40 text-accent">
          <Sparkles className="w-3 h-3 mr-1.5 inline" />
          Single Overhaul Package
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          100 Photos. 5 Archetypes.
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
              100 photos across 5 high-converting styles
            </CardDescription>

            <div className="mt-6 flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold tracking-tight text-white">
                ${plan.price}
              </span>
              <span className="text-zinc-400 text-sm font-mono">one-time</span>
              <span className="ml-2 text-xs bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded font-mono">
                $0.59 / photo
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
              Get Your 100 Photos (${plan.price}) →
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

import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { commonPageMetadata } from '@/lib/seo';

export const metadata: Metadata = commonPageMetadata.dashboard();

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user has any trained models
  const { data: models } = await supabase
    .from('models')
    .select('id')
    .eq('user_id', user.id)
    .limit(1);

  // If user has a model, send them directly to the Dating Studio (/dating-shoot)
  if (models && models.length > 0) {
    redirect('/dating-shoot');
  }

  // Otherwise, send new users to the onboarding model creation flow
  redirect('/models/create');
}

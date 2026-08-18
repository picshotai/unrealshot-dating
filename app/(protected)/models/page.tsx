import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ModelsClientPage } from './ModelsClientPage';

export default async function ModelsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <ModelsClientPage />;
}

import type { Metadata } from 'next';
import ImageGallery from '@/components/ImageGallery';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Image Gallery | Unrealshot AI',
  description: 'View your generated AI dating photos and shoots',
};

export default async function GalleryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="max-w-7xl mx-auto">
      <ImageGallery />
    </div>
  );
}

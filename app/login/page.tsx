import { Metadata } from 'next'
import { commonPageMetadata } from '@/lib/seo'
import LoginClient from './login-client'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = commonPageMetadata.login()

export default async function LoginPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return redirect('/dating-shoot')
  }

  return (
    <div className="min-h-screen">
      <LoginClient />
    </div>
  )
}
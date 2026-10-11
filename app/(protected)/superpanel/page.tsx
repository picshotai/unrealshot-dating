import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import ConfirmDeleteModelForm from '@/components/admin/ConfirmDeleteModelForm'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import CopyTextButton from '@/components/admin/CopyTextButton'

export const dynamic = 'force-dynamic'

function isAdminEmail(email?: string | null) {
  const env = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  return !!email && env.includes(email.toLowerCase())
}

async function addCreditsAction(formData: FormData) {
  'use server'
  const userId = String(formData.get('userId') || '')
  const amount = Number(formData.get('amount') || '0')
  if (!userId || !(amount > 0)) return
  const admin = createAdminClient()
  const { data: existing } = await admin.from('credits').select('credits').eq('user_id', userId).single()
  if (!existing) {
    await admin.from('credits').insert({ user_id: userId, credits: amount })
  } else {
    await admin.from('credits').update({ credits: (existing.credits || 0) + amount }).eq('user_id', userId)
  }
  revalidatePath('/superpanel')
}

async function setCreditsAction(formData: FormData) {
  'use server'
  const userId = String(formData.get('userId') || '')
  const balance = Number(formData.get('balance') || '0')
  if (!userId) return
  const admin = createAdminClient()
  const { data: existing } = await admin.from('credits').select('credits').eq('user_id', userId).single()
  if (!existing) {
    await admin.from('credits').insert({ user_id: userId, credits: balance })
  } else {
    await admin.from('credits').update({ credits: balance }).eq('user_id', userId)
  }
  revalidatePath('/superpanel')
}

async function deleteModelAction(formData: FormData) {
  'use server'
  const modelIdRaw = String(formData.get('modelId') || '')
  const modelId = Number(modelIdRaw)
  if (!modelId || Number.isNaN(modelId)) return
  const admin = createAdminClient()
  // Delete prompts referencing this model (samples/images cascade via FKs)
  await admin.from('prompts').delete().eq('modelId', modelId)
  await admin.from('models').delete().eq('id', modelId)
  revalidatePath('/superpanel')
}

async function toggleAutoExtendAction(formData: FormData) {
  'use server'
  const modelIdRaw = String(formData.get('modelId') || '')
  const modelId = Number(modelIdRaw)
  const enable = String(formData.get('enable') || 'true') === 'true'
  if (!modelId || Number.isNaN(modelId)) return
  const admin = createAdminClient()
  await admin.from('models').update({ auto_extend: enable }).eq('id', modelId)
  revalidatePath('/superpanel')
}

async function updateSubscriptionStatusAction(formData: FormData) {
  'use server'
  const subId = String(formData.get('subId') || '')
  const status = String(formData.get('status') || '')
  if (!subId || !status) return
  const admin = createAdminClient()
  await admin.from('dodo_subscriptions').update({ status }).eq('id', subId)
  revalidatePath('/superpanel')
}

async function searchUsersAction(formData: FormData) {
  'use server'
  const uq = String(formData.get('users_q') || '').trim()
  redirect(uq ? `/superpanel?users_q=${encodeURIComponent(uq)}` : '/superpanel')
}

export default async function AdminDashboard({ searchParams }: { searchParams?: Promise<{ subs_page?: string; users_page?: string; users_q?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if (!isAdminEmail(user.email)) notFound()

  const query = await searchParams
  const usersQuery = (query?.users_q || '').trim()
  const subsPage = Math.max(1, parseInt(query?.subs_page || '1', 10) || 1)
  const usersPage = Math.max(1, parseInt(query?.users_page || '1', 10) || 1)
  const pageSize = 50

  // Build admin client with graceful fallback if env is missing
  let admin: ReturnType<typeof createAdminClient> | null = null
  let adminAvailable = true
  try {
    admin = createAdminClient()
  } catch (e) {
    adminAvailable = false
  }

  // Defaults
  let latestModels: any[] = []
  let subs: any[] = []
  let subsCount = 0
  let profiles: any[] = []
  let profilesCount = 0
  let subsTotalPages = 1
  const hasPrevSubs = subsPage > 1
  let hasNextSubs = false
  const hasPrevUsers = usersPage > 1
  let hasNextUsers = false
  let usersTotalPages = 1
  let emailById: Record<string, string> = {}
  let usersFetchIssue: string | null = null

  if (adminAvailable && admin) {
    const { data: lm } = await admin
      .from('models')
      .select('id, name, user_id, auto_extend, status, created_at')
      .order('created_at', { ascending: false })
      .limit(12)
    latestModels = lm || []

    let subsQuery = admin
      .from('dodo_subscriptions')
      .select('id, user_id, pricing_plan_id, status, dodo_subscription_id, created_at, updated_at', { count: 'exact' })
      .order('created_at', { ascending: false })
    const subsFrom = (subsPage - 1) * pageSize
    const subsTo = subsFrom + pageSize - 1
    const { data: s, count: c } = await subsQuery.range(subsFrom, subsTo)
    subs = s || []
    subsCount = c || 0

    let profilesQuery = admin
      .from('profiles')
      .select('id, user_id, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
    if (usersQuery) {
      if (usersQuery.includes('@')) {
        try {
          const { data } = await (admin as any).auth.admin.getUserByEmail(usersQuery)
          const targetId: string | undefined = data?.user?.id || data?.id || undefined
          if (targetId) {
            profilesQuery = profilesQuery.eq('user_id', targetId)
          } else {
            profilesQuery = profilesQuery.eq('user_id', '__no_match__')
          }
        } catch (e) {
          profilesQuery = profilesQuery.eq('user_id', '__no_match__')
        }
      } else {
        profilesQuery = profilesQuery.or(`user_id.ilike.%${usersQuery}%`)
      }
    }
    const usersFrom = (usersPage - 1) * pageSize
    const usersTo = usersFrom + pageSize - 1
    const { data: p, count: pc, error: profilesError } = await profilesQuery.range(usersFrom, usersTo)

    const profilesErrMsg = String(profilesError?.message || profilesError?.details || profilesError?.hint || '')
    const isProfilesMissing = !!profilesError && (profilesError?.code === '42P01' || /not found|does not exist|relation/i.test(profilesErrMsg))

    if (profilesError) {
      usersFetchIssue = isProfilesMissing ? 'profiles table not found. Using auth fallback.' : 'profiles query error. Using auth fallback.'
      const fallbackProfiles: any[] = []
      if (usersQuery) {
        try {
          if (usersQuery.includes('@')) {
            const res: any = await (admin as any).auth.admin.getUserByEmail(usersQuery)
            const u = res?.data?.user || res?.user
            if (u?.id) {
              fallbackProfiles.push({ id: u.id, user_id: u.id, created_at: u?.created_at })
              if (u?.email) emailById[u.id] = u.email
            }
          } else if (/^[0-9a-fA-F-]{36}$/.test(usersQuery)) {
            const res: any = await (admin as any).auth.admin.getUserById(usersQuery)
            const u = res?.data?.user || res?.user
            if (u?.id) {
              fallbackProfiles.push({ id: u.id, user_id: u.id, created_at: u?.created_at })
              if (u?.email) emailById[u.id] = u.email
            }
          } else {
            const res: any = await (admin as any).auth.admin.listUsers({ page: 1, perPage: 200 })
            const usersList: any[] = res?.data?.users || res?.users || []
            const q = usersQuery.toLowerCase()
            for (const u of usersList) {
              const idMatch = String(u?.id || '').includes(usersQuery)
              const emailMatch = String(u?.email || '').toLowerCase().includes(q)
              if (idMatch || emailMatch) {
                fallbackProfiles.push({ id: u.id, user_id: u.id, created_at: u?.created_at })
                if (u?.email) emailById[u.id] = u.email
              }
            }
          }
        } catch (e) {
          usersFetchIssue = 'auth fallback failed'
        }
      }
      profiles = fallbackProfiles
      profilesCount = fallbackProfiles.length
    } else {
      profiles = p || []
      profilesCount = pc || 0

      try {
        for (const prof of profiles) {
          const res: any = await (admin as any).auth.admin.getUserById(prof.user_id)
          const email: string | undefined = res?.data?.user?.email || res?.user?.email
          if (email) emailById[prof.user_id] = email
        }
      } catch (e) {}
    }

    subsTotalPages = Math.max(1, Math.ceil((subsCount || 0) / pageSize))
    hasNextSubs = subsPage < subsTotalPages
    usersTotalPages = Math.max(1, Math.ceil((profilesCount || 0) / pageSize))
    hasNextUsers = usersPage < usersTotalPages
  }


  // Compute expiry using created_at and auto_extend (14 vs 30 days)
  const computeExpiry = (m: { created_at: string; auto_extend: boolean | null }) => {
    try {
      const createdMs = new Date(m.created_at).getTime()
      const days = m.auto_extend ? 30 : 14
      const expiry = new Date(createdMs + days * 24 * 60 * 60 * 1000)
      return expiry.toLocaleString()
    } catch {
      return '-'
    }
  }
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Console</h1>
      <p className="text-sm text-muted-foreground">Private tools for credits, models and subscriptions. This route is gated and returns 404 for non-admins.</p>

      {!adminAvailable && (
        <Alert variant="destructive">
          <AlertTitle>Admin setup required</AlertTitle>
          <AlertDescription>
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> in <code>.env.local</code>, then restart the dev server. User listing needs the service role.
          </AlertDescription>
        </Alert>
      )}



      <Card>
        <CardHeader>
          <CardTitle>Credits</CardTitle>
          <CardDescription>Add or set user credits by user_id (UUID).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form action={addCreditsAction} className="space-y-3">
              <Label htmlFor="userIdAdd">User ID</Label>
              <Input id="userIdAdd" name="userId" placeholder="00000000-0000-0000-0000-000000000000" />
              <Label htmlFor="amount">Amount to add</Label>
              <Input id="amount" name="amount" type="number" step="0.5" placeholder="10" />
              <Button type="submit">Add credits</Button>
            </form>
            <form action={setCreditsAction} className="space-y-3">
              <Label htmlFor="userIdSet">User ID</Label>
              <Input id="userIdSet" name="userId" placeholder="00000000-0000-0000-0000-000000000000" />
              <Label htmlFor="balance">Set balance to</Label>
              <Input id="balance" name="balance" type="number" step="0.5" placeholder="60" />
              <Button type="submit" variant="secondary">Set balance</Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Models</CardTitle>
          <CardDescription>Delete models or toggle auto-extend.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ConfirmDeleteModelForm action={deleteModelAction} />
            <form action={toggleAutoExtendAction} className="space-y-3">
              <Label htmlFor="modelIdToggle">Model ID</Label>
              <Input id="modelIdToggle" name="modelId" placeholder="123" />
              <div className="flex items-center gap-3">
                <Label htmlFor="enable">Enable</Label>
                <Input id="enable" name="enable" defaultValue="true" />
              </div>
              <Button type="submit" variant="outline">Update auto-extend</Button>
            </form>
          </div>

          <Separator />

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Auto-extend</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestModels?.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.id}</TableCell>
                    <TableCell>{m.name}</TableCell>
                    <TableCell className="text-xs">{m.user_id}</TableCell>
                    <TableCell>{m.status}</TableCell>
                    <TableCell>{m.auto_extend ? 'yes' : 'no'}</TableCell>
                    <TableCell>{computeExpiry(m)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>View and update local subscription status (DodoPayments).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={updateSubscriptionStatusAction} className="flex flex-col md:flex-row gap-3 items-end">
            <div className="flex-1">
              <Label htmlFor="subId">Subscription row ID</Label>
              <Input id="subId" name="subId" placeholder="uuid" />
            </div>
            <div className="flex-1">
              <Label htmlFor="status">Status</Label>
              <Input id="status" name="status" placeholder="active | cancelled | expired | pending" />
            </div>
            <Button type="submit" variant="secondary">Update status</Button>
          </form>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Dodo Sub ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subs?.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-xs">{s.id}</TableCell>
                    <TableCell className="text-xs">{s.user_id}</TableCell>
                    <TableCell className="text-xs">{s.pricing_plan_id}</TableCell>
                    <TableCell className="text-xs">{s.dodo_subscription_id || '-'}</TableCell>
                    <TableCell>{s.status}</TableCell>
                    <TableCell>{s.updated_at ? new Date(s.updated_at).toLocaleString() : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/superpanel?subs_page=${Math.max(1, subsPage - 1)}&users_page=${usersPage}${usersQuery ? `&users_q=${encodeURIComponent(usersQuery)}` : ''}`} className={`inline-flex h-9 px-3 items-center rounded-md border ${hasPrevSubs ? '' : 'pointer-events-none opacity-50'}`}>Prev</Link>
            <span className="text-sm">Page {subsPage} of {subsTotalPages}</span>
            <Link href={`/superpanel?subs_page=${subsPage + 1}&users_page=${usersPage}${usersQuery ? `&users_q=${encodeURIComponent(usersQuery)}` : ''}`} className={`inline-flex h-9 px-3 items-center rounded-md border ${hasNextSubs ? '' : 'pointer-events-none opacity-50'}`}>Next</Link>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>All profiles with user_id, email and signup date.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={searchUsersAction} className="flex flex-col md:flex-row gap-3 items-end">
            <div className="flex-1">
              <Label htmlFor="users_q">Search</Label>
              <Input id="users_q" name="users_q" defaultValue={usersQuery} placeholder="email or user id" />
            </div>
            <Button type="submit">Search</Button>
            <Link href="/superpanel" className="inline-flex h-10 px-4 items-center rounded-md border">Clear</Link>
          </form>
          {usersFetchIssue && (
            <Alert>
              <AlertTitle>Users fallback active</AlertTitle>
              <AlertDescription>{usersFetchIssue}</AlertDescription>
            </Alert>
          )}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Signed Up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        {p.user_id}
                         <CopyTextButton text={p.user_id} />
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        {emailById[p.user_id] || '-'}
                         {emailById[p.user_id] ? <CopyTextButton text={emailById[p.user_id]} /> : null}
                      </div>
                    </TableCell>
                    <TableCell>{p.created_at ? new Date(p.created_at).toLocaleString() : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/superpanel?users_page=${Math.max(1, usersPage - 1)}&subs_page=${subsPage}${usersQuery ? `&users_q=${encodeURIComponent(usersQuery)}` : ''}`} className={`inline-flex h-9 px-3 items-center rounded-md border ${hasPrevUsers ? '' : 'pointer-events-none opacity-50'}`}>Prev</Link>
            <span className="text-sm">Page {usersPage} of {usersTotalPages}</span>
            <Link href={`/superpanel?users_page=${usersPage + 1}&subs_page=${subsPage}${usersQuery ? `&users_q=${encodeURIComponent(usersQuery)}` : ''}`} className={`inline-flex h-9 px-3 items-center rounded-md border ${hasNextUsers ? '' : 'pointer-events-none opacity-50'}`}>Next</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

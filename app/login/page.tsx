import { redirect } from 'next/navigation'
import { Auth, getSession } from '@/features/auth'

export default async function LoginPage() {
  const session = await getSession()

  if (session) {
    redirect('/crm')
  }

  return <Auth />
}

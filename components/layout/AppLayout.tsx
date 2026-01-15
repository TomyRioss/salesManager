'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'

interface AppLayoutProps {
  children: React.ReactNode
}

const HIDE_NAVBAR_ROUTES = ['/login', '/registro']

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const showNavbar = !HIDE_NAVBAR_ROUTES.includes(pathname)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {showNavbar && <Navbar />}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  )
}

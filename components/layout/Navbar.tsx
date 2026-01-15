'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiUser } from 'react-icons/fi'

const leftNavItems = [
  { href: '/contactos', label: 'Contactos' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/crm', label: 'CRM' },
]

const rightNavItems = [
  { href: '/leads', label: 'Leads' },
  { href: '/historial', label: 'Historial' },
  { href: '/tareas', label: 'Tareas' },
]

export function Navbar() {
  const pathname = usePathname()

  const linkClass = (href: string) =>
    `text-sm transition-colors ${
      pathname === href ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
    }`

  return (
    <header className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      <span className="text-lg font-semibold text-gray-900">
        SalesManager
      </span>

      <nav className="flex items-center gap-8">
        {[...leftNavItems, ...rightNavItems].map((item) => (
          <Link key={item.href} href={item.href} className={linkClass(item.href)}>
            {item.label}
          </Link>
        ))}
      </nav>

      <button className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
        <FiUser className="w-4 h-4 text-gray-600" />
      </button>
    </header>
  )
}

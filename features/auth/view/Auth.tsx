'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { LoginForm } from './components/LoginForm'
import { RegisterForm } from './components/RegisterForm'

type Tab = 'login' | 'register'

export function Auth() {
  const [activeTab, setActiveTab] = useState<Tab>('login')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 pb-3 text-sm font-medium ${
              activeTab === 'login'
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 pb-3 text-sm font-medium ${
              activeTab === 'register'
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Registrarse
          </button>
        </div>
        {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
      </Card>
    </div>
  )
}

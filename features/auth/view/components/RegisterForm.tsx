'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { register } from '../../controller/auth.controller'

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await register(formData)

    if (result.success) {
      router.push('/crm')
    } else {
      setError(result.error ?? 'Error al registrarse')
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <Input
          name="name"
          type="text"
          placeholder="Nombre"
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          name="surname"
          type="text"
          placeholder="Apellido"
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          name="password"
          type="password"
          placeholder="Contraseña"
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          name="code"
          type="text"
          placeholder="Código de registro"
          required
          className="w-full"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </Button>
    </form>
  )
}

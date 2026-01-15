'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FiX } from 'react-icons/fi'

interface AddColumnModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => void
}

export function AddColumnModal({ isOpen, onClose, onSubmit }: AddColumnModalProps) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit(name)
    setName('')
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-sm p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Añadir Columna</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Nombre de la columna"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Añadiendo...' : 'Añadir'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'

export interface AddCardData {
  name?: string
  surname?: string
  phone?: string
  email?: string
  company?: string
  nextFollowUpAt?: string
  // Campos avanzados
  phoneSecondary?: string
  emailSecondary?: string
  position?: string
  address?: string
  city?: string
  country?: string
  postalCode?: string
  notes?: string
  sourceOrigin?: string
}

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AddCardData) => void
}

export function AddCardModal({ isOpen, onClose, onSubmit }: AddCardModalProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [loading, setLoading] = useState(false)

  // Campos básicos
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [nextFollowUpAt, setNextFollowUpAt] = useState('')

  // Campos avanzados
  const [phoneSecondary, setPhoneSecondary] = useState('')
  const [emailSecondary, setEmailSecondary] = useState('')
  const [position, setPosition] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [notes, setNotes] = useState('')
  const [sourceOrigin, setSourceOrigin] = useState('')

  if (!isOpen) return null

  const resetForm = () => {
    setName('')
    setSurname('')
    setPhone('')
    setEmail('')
    setCompany('')
    setNextFollowUpAt('')
    setPhoneSecondary('')
    setEmailSecondary('')
    setPosition('')
    setAddress('')
    setCity('')
    setCountry('')
    setPostalCode('')
    setNotes('')
    setSourceOrigin('')
    setShowAdvanced(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit({
      name: name || undefined,
      surname: surname || undefined,
      phone: phone || undefined,
      email: email || undefined,
      company: company || undefined,
      nextFollowUpAt: nextFollowUpAt || undefined,
      phoneSecondary: phoneSecondary || undefined,
      emailSecondary: emailSecondary || undefined,
      position: position || undefined,
      address: address || undefined,
      city: city || undefined,
      country: country || undefined,
      postalCode: postalCode || undefined,
      notes: notes || undefined,
      sourceOrigin: sourceOrigin || undefined,
    })
    resetForm()
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Agregar Contacto</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Apellido"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Input
              placeholder="Empresa"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

            <div>
              <label className="block text-sm text-gray-600 mb-1">Próximo contacto</label>
              <Input
                type="datetime-local"
                value={nextFollowUpAt}
                onChange={(e) => setNextFollowUpAt(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {showAdvanced ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
              Detalles avanzados
            </button>

            {showAdvanced && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Teléfono secundario"
                    value={phoneSecondary}
                    onChange={(e) => setPhoneSecondary(e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="Email secundario"
                    value={emailSecondary}
                    onChange={(e) => setEmailSecondary(e.target.value)}
                  />
                </div>

                <Input
                  placeholder="Cargo / Posición"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />

                <Input
                  placeholder="Dirección"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <div className="grid grid-cols-3 gap-3">
                  <Input
                    placeholder="Ciudad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <Input
                    placeholder="País"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                  <Input
                    placeholder="Código postal"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>

                <Input
                  placeholder="Origen del contacto"
                  value={sourceOrigin}
                  onChange={(e) => setSourceOrigin(e.target.value)}
                />

                <textarea
                  placeholder="Notas"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 resize-none"
                  rows={3}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Agregando...' : 'Agregar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

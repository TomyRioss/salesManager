'use client'

import type { PipelineCardWithContact } from '../../model/types'
import { Button } from '@/components/ui/button'
import { FiX, FiUser, FiPhone, FiMail, FiMapPin, FiCalendar, FiBriefcase } from 'react-icons/fi'

interface ContactDetailModalProps {
  card: PipelineCardWithContact | null
  onClose: () => void
}

export function ContactDetailModal({ card, onClose }: ContactDetailModalProps) {
  if (!card) return null

  const { contact } = card

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Detalle del Contacto</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <FiUser className="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {contact.name} {contact.surname}
              </h3>
              {contact.position && (
                <p className="text-sm text-gray-500">{contact.position}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {contact.phone && (
              <div className="flex items-center gap-3">
                <FiPhone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{contact.phone}</span>
              </div>
            )}
            {contact.phoneSecondary && (
              <div className="flex items-center gap-3">
                <FiPhone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">{contact.phoneSecondary} (secundario)</span>
              </div>
            )}
            {contact.email && (
              <div className="flex items-center gap-3">
                <FiMail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{contact.email}</span>
              </div>
            )}
            {contact.emailSecondary && (
              <div className="flex items-center gap-3">
                <FiMail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">{contact.emailSecondary} (secundario)</span>
              </div>
            )}
          </div>

          {card.notes && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <FiBriefcase className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Empresa</span>
              </div>
              <p className="text-sm text-gray-600">{card.notes}</p>
            </div>
          )}

          {card.nextFollowUpAt && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Próximo contacto</span>
              </div>
              <p className="text-sm text-gray-600">
                {new Date(card.nextFollowUpAt).toLocaleString('es-AR')}
              </p>
            </div>
          )}

          {(contact.address || contact.city || contact.country) && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <FiMapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Ubicación</span>
              </div>
              <p className="text-sm text-gray-600">
                {[contact.address, contact.city, contact.country].filter(Boolean).join(', ')}
              </p>
            </div>
          )}

          {contact.notes && (
            <div className="pt-2 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-700">Notas</span>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{contact.notes}</p>
            </div>
          )}

          {contact.sourceOrigin && (
            <div className="pt-2 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-700">Origen</span>
              <p className="text-sm text-gray-600">{contact.sourceOrigin}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}

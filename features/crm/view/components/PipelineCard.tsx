'use client'

import type { PipelineCardWithContact } from '../../model/types'
import { FiUser, FiPhone, FiMail } from 'react-icons/fi'

interface PipelineCardProps {
  card: PipelineCardWithContact
  onClick?: () => void
  isDragging?: boolean
}

function formatCardDate(date: Date): string {
  const d = new Date(date)
  const day = d.getDate()
  const month = d.getMonth() + 1
  let hours = d.getHours()
  const minutes = d.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12 || 12
  return `${day}/${month} - ${hours}:${minutes}${ampm}`
}

export function PipelineCard({ card, onClick, isDragging }: PipelineCardProps) {
  const { contact } = card

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-lg opacity-90' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <FiUser className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {contact.name} {contact.surname}
          </p>
          {contact.phone && (
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <FiPhone className="w-3 h-3" />
              {contact.phone}
            </p>
          )}
          {contact.email && (
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
              <FiMail className="w-3 h-3" />
              {contact.email}
            </p>
          )}
        </div>
      </div>
      {card.notes && (
        <p className="text-xs text-gray-400 mt-2 line-clamp-2">{card.notes}</p>
      )}
      {card.nextFollowUpAt && (
        <p className="text-xs text-blue-500 mt-2">
          Próximo: {formatCardDate(card.nextFollowUpAt)}
        </p>
      )}
      <p className="text-xs text-gray-400 mt-1 text-right">{formatCardDate(card.createdAt)}</p>
    </div>
  )
}

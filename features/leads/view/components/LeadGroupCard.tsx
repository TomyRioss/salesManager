import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import type { LeadGroup } from '../../model/types'

interface LeadGroupCardProps {
  group: LeadGroup
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Hace un momento'
  if (diffMins < 60) return `Hace ${diffMins} minutos`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `Hace ${diffHours} horas`

  const diffDays = Math.floor(diffHours / 24)
  return `Hace ${diffDays} días`
}

function formatDate(date: Date): string {
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${day}/${month}`
}

export function LeadGroupCard({ group, onClick, onEdit, onDelete }: LeadGroupCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative border border-gray-300 rounded-lg p-4 bg-white cursor-pointer hover:border-gray-400 transition-colors"
    >
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.()
          }}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FiEdit2 className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.()
          }}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
        <p className="text-sm text-gray-600">{group.totalLeads} Leads Total</p>
      </div>

      <p className="text-center text-sm text-gray-600 mb-4">
        {group.contactedLeads} Contactados
      </p>

      <div className="flex justify-between text-xs text-gray-500">
        <div>
          <p className="font-medium">Ult. Actualizado</p>
          <p>{formatRelativeTime(group.updatedAt)}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">Creado</p>
          <p>{formatDate(group.createdAt)}</p>
        </div>
      </div>
    </div>
  )
}

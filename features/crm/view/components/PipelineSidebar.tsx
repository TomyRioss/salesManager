'use client'

import type { Pipeline } from '@prisma/client'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'

interface PipelineSidebarProps {
  pipelines: Pipeline[]
  selectedId: string | null
  onSelect: (id: string) => void
  onCreateNew: () => void
  onRename: (id: string) => void
  onDelete: (id: string) => void
}

export function PipelineSidebar({
  pipelines,
  selectedId,
  onSelect,
  onCreateNew,
  onRename,
  onDelete,
}: PipelineSidebarProps) {
  const formatDate = (date: Date) => {
    const d = new Date(date)
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const day = days[d.getDay()]
    const dateNum = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    return `${day} ${dateNum}/${month}`
  }

  return (
    <aside className="w-56 min-w-56 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={onCreateNew}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nuevo Pipeline
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {pipelines.map((pipeline) => (
          <div
            key={pipeline.id}
            className={`group flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors mb-1 ${
              selectedId === pipeline.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <button
              onClick={() => onSelect(pipeline.id)}
              className="flex-1 text-left truncate"
            >
              {pipeline.name || formatDate(pipeline.date)}
            </button>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); onRename(pipeline.id) }}
                title="Cambiar nombre"
                className="p-1 rounded hover:bg-gray-200"
              >
                <FiEdit2 className="w-3.5 h-3.5 text-gray-500" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(pipeline.id) }}
                title="Eliminar"
                className="p-1 rounded hover:bg-gray-200"
              >
                <FiTrash2 className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}

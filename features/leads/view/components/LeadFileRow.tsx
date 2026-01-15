import type { LeadFile } from '../../model/types'

interface LeadFileRowProps {
  file: LeadFile
  onView: () => void
  onDownload: () => void
}

export function LeadFileRow({ file, onView, onDownload }: LeadFileRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <span className="text-sm text-gray-900">{file.name}</span>
      <div className="flex gap-2">
        <button
          onClick={onView}
          className="px-4 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Ver
        </button>
        <button
          onClick={onDownload}
          className="px-4 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Descargar
        </button>
      </div>
    </div>
  )
}

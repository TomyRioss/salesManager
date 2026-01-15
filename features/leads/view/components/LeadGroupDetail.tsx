'use client'

import { useRef } from 'react'
import type { LeadGroup } from '../../model/types'
import { LeadFileRow } from './LeadFileRow'
import { FiUpload } from 'react-icons/fi'

export interface ProcessedLeadFile {
  fileName: string
  headers: string[]
  rows: Record<string, string>[]
}

interface LeadGroupDetailProps {
  group: LeadGroup
  onUpload: (file: ProcessedLeadFile) => void | Promise<void>
  onViewFile: (fileId: string) => void
  onDownloadFile: (fileId: string) => void
}

function parseCSV(content: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = content.trim().split('\n')
  if (lines.length === 0) return { headers: [], rows: [] }

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  if (!headers.includes('reached')) {
    headers.push('reached')
  }

  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      if (header === 'reached') {
        row[header] = values[index] ?? 'false'
      } else {
        row[header] = values[index] ?? ''
      }
    })
    if (!row.reached) {
      row.reached = 'false'
    }
    return row
  })

  return { headers, rows }
}

export function LeadGroupDetail({
  group,
  onUpload,
  onViewFile,
  onDownloadFile,
}: LeadGroupDetailProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      const { headers, rows } = parseCSV(content)
      onUpload({
        fileName: file.name,
        headers,
        rows,
      })
    }
    reader.readAsText(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg bg-white">
      <div className="flex items-center gap-4 p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 uppercase">
          {group.name}
        </h2>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xls,.xlsx"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <FiUpload className="w-4 h-4" />
          Subir
        </button>
        <span className="text-sm text-gray-500">Solo archivos en formato .csv o .xls</span>
      </div>

      <div className="px-4">
        {group.leadFiles.map((file) => (
          <LeadFileRow
            key={file.id}
            file={file}
            onView={() => onViewFile(file.id)}
            onDownload={() => onDownloadFile(file.id)}
          />
        ))}
      </div>
    </div>
  )
}

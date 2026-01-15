'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { LeadGroup } from '../model/types'
import { LeadGroupCard } from './components/LeadGroupCard'
import { LeadGroupDetail, type ProcessedLeadFile } from './components/LeadGroupDetail'

interface LeadsProps {
  groups: LeadGroup[]
  onCreateFolder?: (name: string) => void | Promise<unknown>
  onEditFolder?: (folderId: string, name: string) => void | Promise<unknown>
  onDeleteFolder?: (folderId: string) => void | Promise<unknown>
  onUpload?: (groupId: string, file: ProcessedLeadFile) => Promise<unknown>
  onViewFile?: (groupId: string, fileId: string) => void
  onDownloadFile?: (groupId: string, fileId: string) => void
}

export function Leads({
  groups,
  onCreateFolder,
  onEditFolder,
  onDeleteFolder,
  onUpload,
  onViewFile,
  onDownloadFile,
}: LeadsProps) {
  const router = useRouter()
  const [selectedGroup, setSelectedGroup] = useState<LeadGroup | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [editingGroup, setEditingGroup] = useState<LeadGroup | null>(null)
  const [editName, setEditName] = useState('')

  const handleCreate = async () => {
    if (folderName.trim()) {
      await onCreateFolder?.(folderName.trim())
      setFolderName('')
      setShowCreateForm(false)
      router.refresh()
    }
  }

  const handleCancel = () => {
    setFolderName('')
    setShowCreateForm(false)
  }

  const handleEdit = (group: LeadGroup) => {
    setEditingGroup(group)
    setEditName(group.name)
  }

  const handleEditSave = async () => {
    if (editingGroup && editName.trim()) {
      await onEditFolder?.(editingGroup.id, editName.trim())
      setEditingGroup(null)
      setEditName('')
      router.refresh()
    }
  }

  const handleEditCancel = () => {
    setEditingGroup(null)
    setEditName('')
  }

  const handleDelete = async (group: LeadGroup) => {
    await onDeleteFolder?.(group.id)
    router.refresh()
  }

  if (selectedGroup) {
    return (
      <div className="p-6 min-h-full">
        <button
          onClick={() => setSelectedGroup(null)}
          className="mb-4 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Volver
        </button>
        <LeadGroupDetail
          group={selectedGroup}
          onUpload={async (file) => {
            await onUpload?.(selectedGroup.id, file)
            router.refresh()
          }}
          onViewFile={(fileId) => onViewFile?.(selectedGroup.id, fileId)}
          onDownloadFile={(fileId) => onDownloadFile?.(selectedGroup.id, fileId)}
        />
      </div>
    )
  }

  return (
    <div className="p-6 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Leads</h1>
        {!showCreateForm && !editingGroup && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
          >
            Crear carpeta
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la carpeta
          </label>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Ej: Leads Gimnasios"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
            autoFocus
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleCreate}
              disabled={!folderName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Crear
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {editingGroup && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Editar nombre de carpeta
          </label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
            autoFocus
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleEditSave}
              disabled={!editName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar
            </button>
            <button
              onClick={handleEditCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <LeadGroupCard
            key={group.id}
            group={group}
            onClick={() => setSelectedGroup(group)}
            onEdit={() => handleEdit(group)}
            onDelete={() => handleDelete(group)}
          />
        ))}
      </div>
    </div>
  )
}

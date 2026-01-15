import { redirect } from 'next/navigation'
import { Leads } from '@/features/leads'
import { getLeadFolders, createLeadFolder, uploadLeadFile, updateLeadFolder, deleteLeadFolder } from '@/features/leads/model/hooks'
import { getSession } from '@/features/auth'
import type { ProcessedLeadFile } from '@/features/leads/view/components/LeadGroupDetail'

export default async function LeadsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const groups = await getLeadFolders()

  const handleCreateFolder = async (name: string) => {
    'use server'
    return createLeadFolder(name)
  }

  const handleEditFolder = async (folderId: string, name: string) => {
    'use server'
    return updateLeadFolder(folderId, name)
  }

  const handleDeleteFolder = async (folderId: string) => {
    'use server'
    return deleteLeadFolder(folderId)
  }

  const handleUpload = async (groupId: string, file: ProcessedLeadFile) => {
    'use server'
    const currentSession = await getSession()
    if (!currentSession) return
    return uploadLeadFile(groupId, file.fileName, file.headers, file.rows, currentSession.id)
  }

  return (
    <Leads
      groups={groups}
      onCreateFolder={handleCreateFolder}
      onEditFolder={handleEditFolder}
      onDeleteFolder={handleDeleteFolder}
      onUpload={handleUpload}
    />
  )
}

'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { LeadGroup } from './types'

export async function getLeadFolders(userId?: string, teamId?: string): Promise<LeadGroup[]> {
  const folders = await prisma.leadFileFolder.findMany({
    where: {
      isActive: true,
      ...(userId && { userId }),
      ...(teamId && { teamId }),
    },
    include: {
      leadFiles: {
        include: {
          leadFile: {
            include: {
              _count: {
                select: { rows: true }
              },
              rows: {
                where: { reached: true },
                select: { id: true }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return folders.map(folder => {
    const leadFiles = folder.leadFiles.map(item => ({
      id: item.leadFile.id,
      name: item.leadFile.name,
      columns: item.leadFile.columns,
      createdAt: item.leadFile.createdAt,
      updatedAt: item.leadFile.updatedAt,
      totalLeads: item.leadFile._count.rows,
      contactedLeads: item.leadFile.rows.length
    }))

    const totalLeads = leadFiles.reduce((sum, f) => sum + f.totalLeads, 0)
    const contactedLeads = leadFiles.reduce((sum, f) => sum + f.contactedLeads, 0)

    return {
      id: folder.id,
      name: folder.name,
      parentId: folder.parentId,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
      leadFiles,
      totalLeads,
      contactedLeads
    }
  })
}

export async function getLeadFolderById(folderId: string): Promise<LeadGroup | null> {
  const folder = await prisma.leadFileFolder.findUnique({
    where: { id: folderId },
    include: {
      leadFiles: {
        include: {
          leadFile: {
            include: {
              _count: {
                select: { rows: true }
              },
              rows: {
                where: { reached: true },
                select: { id: true }
              }
            }
          }
        }
      }
    }
  })

  if (!folder) return null

  const leadFiles = folder.leadFiles.map(item => ({
    id: item.leadFile.id,
    name: item.leadFile.name,
    columns: item.leadFile.columns,
    createdAt: item.leadFile.createdAt,
    updatedAt: item.leadFile.updatedAt,
    totalLeads: item.leadFile._count.rows,
    contactedLeads: item.leadFile.rows.length
  }))

  const totalLeads = leadFiles.reduce((sum, f) => sum + f.totalLeads, 0)
  const contactedLeads = leadFiles.reduce((sum, f) => sum + f.contactedLeads, 0)

  return {
    id: folder.id,
    name: folder.name,
    parentId: folder.parentId,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
    leadFiles,
    totalLeads,
    contactedLeads
  }
}

export async function createLeadFolder(name: string, userId?: string, teamId?: string) {
  const folder = await prisma.leadFileFolder.create({
    data: {
      name,
      userId,
      teamId,
    }
  })

  revalidatePath('/leads')
  return folder
}

function sanitizeString(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x00/g, '').trim()
}

function sanitizeRow(row: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {}
  for (const [key, value] of Object.entries(row)) {
    sanitized[sanitizeString(key)] = sanitizeString(value)
  }
  return sanitized
}

export async function uploadLeadFile(
  folderId: string,
  fileName: string,
  columns: string[],
  rows: Record<string, string>[],
  createdById: string
) {
  const sanitizedColumns = columns.map(sanitizeString)
  const sanitizedRows = rows.map(sanitizeRow)

  const leadFile = await prisma.leadFile.create({
    data: {
      name: sanitizeString(fileName),
      columns: sanitizedColumns,
      createdById,
      rows: {
        create: sanitizedRows.map(row => ({
          data: row,
          reached: false,
        }))
      },
      folders: {
        create: {
          folderId
        }
      }
    }
  })

  revalidatePath('/leads')
  return leadFile
}

export async function updateLeadFolder(folderId: string, name: string) {
  const folder = await prisma.leadFileFolder.update({
    where: { id: folderId },
    data: { name }
  })

  revalidatePath('/leads')
  return folder
}

export async function deleteLeadFolder(folderId: string) {
  await prisma.leadFileFolder.update({
    where: { id: folderId },
    data: { isActive: false }
  })

  revalidatePath('/leads')
}

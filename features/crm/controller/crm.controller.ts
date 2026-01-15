'use server'

import { prisma } from '@/lib/prisma'
import type { Pipeline } from '@prisma/client'
import type { PipelineWithStages } from '../model/types'

export async function getPipelines(userId?: string, teamId?: string): Promise<Pipeline[]> {
  return prisma.pipeline.findMany({
    where: {
      isActive: true,
      ...(userId && { userId }),
      ...(teamId && { teamId }),
    },
    orderBy: { date: 'desc' },
  })
}

export async function getPipelineWithStages(pipelineId: string): Promise<PipelineWithStages | null> {
  return prisma.pipeline.findUnique({
    where: { id: pipelineId },
    include: {
      stages: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          cards: {
            where: { isActive: true },
            include: {
              contact: true,
            },
          },
        },
      },
    },
  })
}

export async function createPipeline(data: {
  name: string
  date?: Date
  userId?: string
  teamId?: string
  createdById: string
}) {
  const pipeline = await prisma.pipeline.create({
    data: {
      name: data.name,
      date: data.date ?? new Date(),
      userId: data.userId,
      teamId: data.teamId,
      createdById: data.createdById,
    },
  })

  // Crear stages por defecto
  const defaultStages = ['Pendiente', 'Llamado', 'No Contestó', 'Interesado']
  await prisma.pipelineStage.createMany({
    data: defaultStages.map((name, index) => ({
      pipelineId: pipeline.id,
      name,
      order: index,
    })),
  })

  return pipeline
}

export async function createCard(data: {
  stageId: string
  pipelineId: string
  contactName: string
  contactSurname: string
  contactPhone?: string
  contactEmail?: string
  company?: string
  nextFollowUpAt?: string
  phoneSecondary?: string
  emailSecondary?: string
  position?: string
  address?: string
  city?: string
  country?: string
  postalCode?: string
  notes?: string
  sourceOrigin?: string
  createdById: string
}) {
  const contact = await prisma.contact.create({
    data: {
      name: data.contactName,
      surname: data.contactSurname,
      phone: data.contactPhone,
      email: data.contactEmail,
      phoneSecondary: data.phoneSecondary,
      emailSecondary: data.emailSecondary,
      position: data.position,
      address: data.address,
      city: data.city,
      country: data.country,
      postalCode: data.postalCode,
      notes: data.notes,
      sourceOrigin: data.sourceOrigin,
      createdById: data.createdById,
    },
  })

  const card = await prisma.pipelineCard.create({
    data: {
      pipelineId: data.pipelineId,
      stageId: data.stageId,
      contactId: contact.id,
      notes: data.company,
      nextFollowUpAt: data.nextFollowUpAt ? new Date(data.nextFollowUpAt) : undefined,
    },
    include: {
      contact: true,
    },
  })

  return card
}

export async function moveCard(cardId: string, toStageId: string, changedById: string) {
  const card = await prisma.pipelineCard.findUnique({
    where: { id: cardId },
  })

  if (!card) throw new Error('Card not found')

  await prisma.$transaction([
    prisma.pipelineCard.update({
      where: { id: cardId },
      data: { stageId: toStageId },
    }),
    prisma.pipelineCardHistory.create({
      data: {
        cardId,
        fromStageId: card.stageId,
        toStageId,
        changedById,
      },
    }),
  ])
}

export async function renamePipeline(pipelineId: string, name: string) {
  return prisma.pipeline.update({
    where: { id: pipelineId },
    data: { name },
  })
}

export async function deletePipeline(pipelineId: string) {
  return prisma.pipeline.update({
    where: { id: pipelineId },
    data: { isActive: false },
  })
}

export async function createStage(pipelineId: string, name: string) {
  const lastStage = await prisma.pipelineStage.findFirst({
    where: { pipelineId, isActive: true },
    orderBy: { order: 'desc' },
  })

  return prisma.pipelineStage.create({
    data: {
      pipelineId,
      name,
      order: (lastStage?.order ?? -1) + 1,
    },
    include: {
      cards: {
        where: { isActive: true },
        include: { contact: true },
      },
    },
  })
}

export async function renameStage(stageId: string, name: string) {
  return prisma.pipelineStage.update({
    where: { id: stageId },
    data: { name },
  })
}

export async function deleteStage(stageId: string) {
  return prisma.pipelineStage.update({
    where: { id: stageId },
    data: { isActive: false },
  })
}

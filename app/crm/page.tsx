import { redirect } from 'next/navigation'
import { CRM } from '@/features/crm'
import { getPipelines, getPipelineWithStages, createPipeline, createCard, renamePipeline, deletePipeline, createStage, moveCard, renameStage, deleteStage } from '@/features/crm'
import { getSession } from '@/features/auth'

export default async function CRMPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const pipelines = await getPipelines()
  const initialPipeline = pipelines[0]
    ? await getPipelineWithStages(pipelines[0].id)
    : null

  async function handleSelectPipeline(id: string) {
    'use server'
    return getPipelineWithStages(id)
  }

  async function handleCreatePipeline() {
    'use server'
    const currentSession = await getSession()
    if (!currentSession) {
      throw new Error('No autorizado')
    }

    const today = new Date()
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const name = `${days[today.getDay()]} ${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}`

    return createPipeline({
      name,
      date: today,
      createdById: currentSession.id,
    })
  }

  async function handleCreateCard(data: {
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
  }) {
    'use server'
    const currentSession = await getSession()
    if (!currentSession) {
      throw new Error('No autorizado')
    }
    return createCard({ ...data, createdById: currentSession.id })
  }

  async function handleRenamePipeline(id: string, name: string) {
    'use server'
    return renamePipeline(id, name)
  }

  async function handleDeletePipeline(id: string) {
    'use server'
    return deletePipeline(id)
  }

  async function handleCreateStage(pipelineId: string, name: string) {
    'use server'
    return createStage(pipelineId, name)
  }

  async function handleMoveCard(cardId: string, toStageId: string) {
    'use server'
    const currentSession = await getSession()
    if (!currentSession) {
      throw new Error('No autorizado')
    }
    await moveCard(cardId, toStageId, currentSession.id)
  }

  async function handleRenameStage(stageId: string, name: string) {
    'use server'
    return renameStage(stageId, name)
  }

  async function handleDeleteStage(stageId: string) {
    'use server'
    return deleteStage(stageId)
  }

  return (
    <CRM
      initialPipelines={pipelines}
      initialPipeline={initialPipeline}
      onSelectPipeline={handleSelectPipeline}
      onCreatePipeline={handleCreatePipeline}
      onCreateCard={handleCreateCard}
      onRenamePipeline={handleRenamePipeline}
      onDeletePipeline={handleDeletePipeline}
      onCreateStage={handleCreateStage}
      onMoveCard={handleMoveCard}
      onRenameStage={handleRenameStage}
      onDeleteStage={handleDeleteStage}
    />
  )
}

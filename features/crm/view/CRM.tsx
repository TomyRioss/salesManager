'use client'

import { useState } from 'react'
import type { Pipeline } from '@prisma/client'
import type { PipelineWithStages, ViewMode, PipelineCardWithContact, PipelineStageWithCards } from '../model/types'
import { PipelineSidebar } from './components/PipelineSidebar'
import { PipelineBoard } from './components/PipelineBoard'
import { AddCardModal, type AddCardData } from './components/AddCardModal'
import { RenamePipelineModal } from './components/RenamePipelineModal'
import { DeletePipelineModal } from './components/DeletePipelineModal'
import { AddColumnModal } from './components/AddColumnModal'
import { ContactDetailModal } from './components/ContactDetailModal'
import { Button } from '@/components/ui/button'

interface CRMProps {
  initialPipelines: Pipeline[]
  initialPipeline: PipelineWithStages | null
  onSelectPipeline: (id: string) => Promise<PipelineWithStages | null>
  onCreatePipeline: () => Promise<Pipeline>
  onCreateCard: (data: {
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
  }) => Promise<PipelineCardWithContact>
  onRenamePipeline: (id: string, name: string) => Promise<Pipeline>
  onDeletePipeline: (id: string) => Promise<Pipeline>
  onCreateStage: (pipelineId: string, name: string) => Promise<PipelineStageWithCards>
  onMoveCard: (cardId: string, toStageId: string) => Promise<void>
  onRenameStage: (stageId: string, name: string) => Promise<unknown>
  onDeleteStage: (stageId: string) => Promise<unknown>
}

export function CRM({
  initialPipelines,
  initialPipeline,
  onSelectPipeline,
  onCreatePipeline,
  onCreateCard,
  onRenamePipeline,
  onDeletePipeline,
  onCreateStage,
  onMoveCard,
  onRenameStage,
  onDeleteStage,
}: CRMProps) {
  const [pipelines, setPipelines] = useState(initialPipelines)
  const [selectedPipeline, setSelectedPipeline] = useState<PipelineWithStages | null>(initialPipeline)
  const [selectedId, setSelectedId] = useState<string | null>(initialPipeline?.id ?? null)
  const [viewMode, setViewMode] = useState<ViewMode>('pipeline')
  const [loading, setLoading] = useState(false)
  const [addCardStageId, setAddCardStageId] = useState<string | null>(null)
  const [renamePipelineId, setRenamePipelineId] = useState<string | null>(null)
  const [deletePipelineId, setDeletePipelineId] = useState<string | null>(null)
  const [showAddColumn, setShowAddColumn] = useState(false)
  const [selectedCard, setSelectedCard] = useState<PipelineCardWithContact | null>(null)
  const [renameStageId, setRenameStageId] = useState<string | null>(null)
  const [deleteStageId, setDeleteStageId] = useState<string | null>(null)

  const handleSelectPipeline = async (id: string) => {
    setLoading(true)
    setSelectedId(id)
    const pipeline = await onSelectPipeline(id)
    setSelectedPipeline(pipeline)
    setLoading(false)
  }

  const handleCreateNew = async () => {
    const newPipeline = await onCreatePipeline()
    setPipelines([newPipeline, ...pipelines])
    handleSelectPipeline(newPipeline.id)
  }

  const handleRename = (id: string) => {
    setRenamePipelineId(id)
  }

  const handleDelete = (id: string) => {
    setDeletePipelineId(id)
  }

  const handleConfirmRename = async (name: string) => {
    if (!renamePipelineId) return
    const updated = await onRenamePipeline(renamePipelineId, name)
    setPipelines(pipelines.map(p => p.id === renamePipelineId ? updated : p))
    setRenamePipelineId(null)
  }

  const handleConfirmDelete = async () => {
    if (!deletePipelineId) return
    await onDeletePipeline(deletePipelineId)
    setPipelines(pipelines.filter(p => p.id !== deletePipelineId))
    if (selectedId === deletePipelineId) {
      setSelectedId(null)
      setSelectedPipeline(null)
    }
    setDeletePipelineId(null)
  }

  const handleAddColumn = () => {
    if (!selectedPipeline) return
    setShowAddColumn(true)
  }

  const handleCreateColumn = async (name: string) => {
    if (!selectedPipeline) return
    const newStage = await onCreateStage(selectedPipeline.id, name)
    setSelectedPipeline({
      ...selectedPipeline,
      stages: [...selectedPipeline.stages, newStage],
    })
  }

  const handleAddCard = (stageId: string) => {
    setAddCardStageId(stageId)
  }

  const handleCreateCard = async (data: AddCardData) => {
    if (!addCardStageId || !selectedPipeline) return

    const newCard = await onCreateCard({
      stageId: addCardStageId,
      pipelineId: selectedPipeline.id,
      contactName: data.name,
      contactSurname: data.surname,
      contactPhone: data.phone,
      contactEmail: data.email,
      company: data.company,
      nextFollowUpAt: data.nextFollowUpAt,
      phoneSecondary: data.phoneSecondary,
      emailSecondary: data.emailSecondary,
      position: data.position,
      address: data.address,
      city: data.city,
      country: data.country,
      postalCode: data.postalCode,
      notes: data.notes,
      sourceOrigin: data.sourceOrigin,
    })

    setSelectedPipeline({
      ...selectedPipeline,
      stages: selectedPipeline.stages.map((stage) =>
        stage.id === addCardStageId
          ? { ...stage, cards: [...stage.cards, newCard] }
          : stage
      ),
    })
  }

  const handleCardClick = (card: PipelineCardWithContact) => {
    setSelectedCard(card)
  }

  const handleRenameStage = (stageId: string) => {
    setRenameStageId(stageId)
  }

  const handleDeleteStage = (stageId: string) => {
    setDeleteStageId(stageId)
  }

  const handleConfirmRenameStage = async (name: string) => {
    if (!renameStageId || !selectedPipeline) return
    await onRenameStage(renameStageId, name)
    setSelectedPipeline({
      ...selectedPipeline,
      stages: selectedPipeline.stages.map(s =>
        s.id === renameStageId ? { ...s, name } : s
      ),
    })
    setRenameStageId(null)
  }

  const handleConfirmDeleteStage = async () => {
    if (!deleteStageId || !selectedPipeline) return
    await onDeleteStage(deleteStageId)
    setSelectedPipeline({
      ...selectedPipeline,
      stages: selectedPipeline.stages.filter(s => s.id !== deleteStageId),
    })
    setDeleteStageId(null)
  }

  const handleMoveCard = async (cardId: string, toStageId: string) => {
    if (!selectedPipeline) return

    await onMoveCard(cardId, toStageId)

    let movedCard: PipelineCardWithContact | null = null
    const updatedStages = selectedPipeline.stages.map((stage) => {
      const cardIndex = stage.cards.findIndex((c) => c.id === cardId)
      if (cardIndex !== -1) {
        movedCard = stage.cards[cardIndex]
        return {
          ...stage,
          cards: stage.cards.filter((c) => c.id !== cardId),
        }
      }
      return stage
    })

    if (movedCard) {
      setSelectedPipeline({
        ...selectedPipeline,
        stages: updatedStages.map((stage) =>
          stage.id === toStageId
            ? { ...stage, cards: [...stage.cards, movedCard!] }
            : stage
        ),
      })
    }
  }

  return (
    <div className="flex h-full">
      <PipelineSidebar
        pipelines={pipelines}
        selectedId={selectedId}
        onSelect={handleSelectPipeline}
        onCreateNew={handleCreateNew}
        onRename={handleRename}
        onDelete={handleDelete}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-start px-4 py-2 gap-2">
          <Button
            variant={viewMode === 'pipeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('pipeline')}
          >
            Pipeline
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            Lista
          </Button>
        </div>
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <PipelineBoard
            pipeline={selectedPipeline}
            onAddCard={handleAddCard}
            onAddColumn={handleAddColumn}
            onCardClick={handleCardClick}
            onMoveCard={handleMoveCard}
            onRenameStage={handleRenameStage}
            onDeleteStage={handleDeleteStage}
          />
        )}
      </div>
      <AddCardModal
        isOpen={!!addCardStageId}
        onClose={() => setAddCardStageId(null)}
        onSubmit={handleCreateCard}
      />
      <RenamePipelineModal
        isOpen={!!renamePipelineId}
        currentName={pipelines.find(p => p.id === renamePipelineId)?.name ?? ''}
        onClose={() => setRenamePipelineId(null)}
        onSubmit={handleConfirmRename}
      />
      <DeletePipelineModal
        isOpen={!!deletePipelineId}
        pipelineName={pipelines.find(p => p.id === deletePipelineId)?.name ?? ''}
        onClose={() => setDeletePipelineId(null)}
        onConfirm={handleConfirmDelete}
      />
      <AddColumnModal
        isOpen={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        onSubmit={handleCreateColumn}
      />
      <ContactDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
      <RenamePipelineModal
        isOpen={!!renameStageId}
        currentName={selectedPipeline?.stages.find(s => s.id === renameStageId)?.name ?? ''}
        onClose={() => setRenameStageId(null)}
        onSubmit={handleConfirmRenameStage}
      />
      <DeletePipelineModal
        isOpen={!!deleteStageId}
        pipelineName={selectedPipeline?.stages.find(s => s.id === deleteStageId)?.name ?? ''}
        onClose={() => setDeleteStageId(null)}
        onConfirm={handleConfirmDeleteStage}
      />
    </div>
  )
}

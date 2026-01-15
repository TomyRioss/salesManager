'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { PipelineWithStages, PipelineStageWithCards, PipelineCardWithContact } from '../../model/types'
import { PipelineCard } from './PipelineCard'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'

interface PipelineBoardProps {
  pipeline: PipelineWithStages | null
  onCardClick?: (card: PipelineCardWithContact) => void
  onAddCard?: (stageId: string) => void
  onAddColumn?: () => void
  onMoveCard?: (cardId: string, toStageId: string) => void
  onRenameStage?: (stageId: string) => void
  onDeleteStage?: (stageId: string) => void
}

export function PipelineBoard({ pipeline, onCardClick, onAddCard, onAddColumn, onMoveCard, onRenameStage, onDeleteStage }: PipelineBoardProps) {
  const [activeCard, setActiveCard] = useState<PipelineCardWithContact | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  )

  if (!pipeline) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Selecciona un pipeline para ver los contactos
      </div>
    )
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const cardId = active.id as string

    for (const stage of pipeline.stages) {
      const card = stage.cards.find(c => c.id === cardId)
      if (card) {
        setActiveCard(card)
        break
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)

    if (!over) return

    const cardId = active.id as string
    const toStageId = over.id as string

    const currentStageId = pipeline.stages.find(s =>
      s.cards.some(c => c.id === cardId)
    )?.id

    if (currentStageId !== toStageId) {
      onMoveCard?.(cardId, toStageId)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
        <div className="flex gap-4 h-full">
          {pipeline.stages.map((stage) => (
            <PipelineColumn
              key={stage.id}
              stage={stage}
              onCardClick={onCardClick}
              onAddCard={onAddCard}
              activeCardId={activeCard?.id}
              onRenameStage={onRenameStage}
              onDeleteStage={onDeleteStage}
            />
          ))}
          <button
            type="button"
            onClick={onAddColumn}
            className="w-72 min-w-72 flex-shrink-0 h-fit flex items-center justify-center gap-2 p-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-colors min-h-[44px]"
          >
            <FiPlus className="w-5 h-5" />
            Añadir columna
          </button>
        </div>
      </div>
      <DragOverlay>
        {activeCard && (
          <div className="w-64">
            <PipelineCard card={activeCard} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

interface PipelineColumnProps {
  stage: PipelineStageWithCards
  onCardClick?: (card: PipelineCardWithContact) => void
  onAddCard?: (stageId: string) => void
  activeCardId?: string
  onRenameStage?: (stageId: string) => void
  onDeleteStage?: (stageId: string) => void
}

function PipelineColumn({ stage, onCardClick, onAddCard, activeCardId, onRenameStage, onDeleteStage }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`w-72 min-w-72 flex-shrink-0 flex flex-col bg-gray-50 rounded-lg transition-colors ${
        isOver ? 'bg-gray-100 ring-2 ring-gray-300' : ''
      }`}
    >
      <div className="group/header p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{stage.name}</h3>
            <button
              type="button"
              onClick={() => onAddCard?.(stage.id)}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            >
              <FiPlus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onRenameStage?.(stage.id)}
                title="Cambiar nombre"
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
              >
                <FiEdit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteStage?.(stage.id)}
                title="Eliminar"
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
              {stage.cards.length}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]">
        {stage.cards.map((card) => (
          <DraggableCard
            key={card.id}
            card={card}
            onClick={() => onCardClick?.(card)}
            isHidden={card.id === activeCardId}
          />
        ))}
      </div>
    </div>
  )
}

interface DraggableCardProps {
  card: PipelineCardWithContact
  onClick?: () => void
  isHidden?: boolean
}

function DraggableCard({ card, onClick, isHidden }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isHidden ? 0.3 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="touch-none"
    >
      <PipelineCard card={card} onClick={onClick} isDragging={isDragging} />
    </div>
  )
}

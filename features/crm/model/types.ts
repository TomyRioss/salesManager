import type { Pipeline, PipelineStage, PipelineCard, Contact } from '@prisma/client'

export interface PipelineWithStages extends Pipeline {
  stages: PipelineStageWithCards[]
}

export interface PipelineStageWithCards extends PipelineStage {
  cards: PipelineCardWithContact[]
}

export interface PipelineCardWithContact extends PipelineCard {
  contact: Contact
}

export type ViewMode = 'pipeline' | 'list'

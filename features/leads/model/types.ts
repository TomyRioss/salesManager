export interface LeadFile {
  id: string
  name: string
  columns: string[]
  createdAt: Date
  updatedAt: Date
  _count?: {
    rows: number
  }
  reachedCount?: number
}

export interface LeadGroup {
  id: string
  name: string
  parentId: string | null
  createdAt: Date
  updatedAt: Date
  leadFiles: LeadFileWithStats[]
  totalLeads: number
  contactedLeads: number
}

export interface LeadFileWithStats extends LeadFile {
  totalLeads: number
  contactedLeads: number
}

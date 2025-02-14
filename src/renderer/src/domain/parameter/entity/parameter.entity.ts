export interface TblParameter {
  id: string
  paramCode: string
  sort: number
  paramDescription: string
  paramValue: string
  createdBy: string
  createdAt: Date
  updatedBy: string
  updatedAt: Date
  deletedBy?: string
  deletedAt?: Date
}

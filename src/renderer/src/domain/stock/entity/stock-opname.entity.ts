export interface TblStockOpname {
  id: string
  storeId: number
  scheduleStart: string
  scheduleFinished?: Date
  startDate: Date
  endDate?: Date
  adjustInId?: number
  adjustInTotal?: number
  adjustOutId?: number
  adjustOutTotal?: number
  description: string
  status: number
  active: number
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}

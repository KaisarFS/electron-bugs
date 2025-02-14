export interface TblStockTagUpdateSchedule {
  id: string
  productId: number
  productName: string
  tagCode: string
  scheduleExecuteStart: string
  scheduleExecuteEnd: string
  executedStart?: Date
  executedEnd?: Date
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}

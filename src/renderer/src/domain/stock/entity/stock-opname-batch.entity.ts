export interface TblStockOpnameBatch {
  id: string
  transId: number
  storeId: number
  batchNumber: number
  description: string
  status: number
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}

export interface TblStockTag {
  id: string
  tagCode: string
  tagDescription: string
  allowSales: number
  allowReturnToSupplier: number
  allowReturnToDc: number
  allowPurchaseOrderToDc: number
  allowPurchaseOrderToSupplier: number
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}

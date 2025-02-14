export interface TblStockActive {
  id: string
  storeId: number
  productId: number
  minDisp: number
  minOr: number
  mpKm: number
  pkm: number
  nPlus: number
  nCross: number
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}

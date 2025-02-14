export interface TblStockExtraPriceStore {
  id: string
  storeId: number
  productId: number
  sellPrice?: number
  distPrice01?: number
  distPrice02?: number
  distPrice03?: number
  distPrice04?: number
  distPrice05?: number
  distPrice06?: number
  distPrice07?: number
  distPrice08?: number
  distPrice09?: number
  createdBy: string
  createdAt?: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: string
}

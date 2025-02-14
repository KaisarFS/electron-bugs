export interface TblPaymentOption {
  id: string
  parentId?: number
  accountId?: number
  typeCode: string
  typeName: string
  description: string
  status: string
  charge?: number
  chargePercent?: number
  cashbackNominal?: number
  cashbackPercent?: number
  discNominal?: number
  discPercent?: number
  createdBy: string
  createdAt: Date
  updatedBy: string
  updatedAt: Date
}

export interface TblPaymentCost {
  id: string
  machineId: number
  bankId: number
  chargePercent?: number
  chargeNominal?: number
  active: number
  createdBy: string
  createdAt?: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}

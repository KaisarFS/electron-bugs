export interface TblBalanceDetail {
  id: string
  balanceId: number
  paymentOptionId: number
  balance: number
  balanceAdj: number
  balanceIn: number
  type: number
  balanceType: number
  createdBy: string
  createdAt?: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}

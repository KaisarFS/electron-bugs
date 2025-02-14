export interface TblVoucherPayment {
  id: string
  voucherId: number
  paymentStoreId: number
  paymentDate: string
  paymentDescription: string
  paymentUserId: number
  paymentAccountId: number
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}

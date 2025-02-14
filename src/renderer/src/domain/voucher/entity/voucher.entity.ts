export interface TblVoucher {
  id: string
  voucherCode: string
  voucherName: string
  voucherImage: string
  voucherCount: number
  expireDate: string
  paymentAccountId?: number
  memberLastPurchaseDate?: string
  memberExpiredDay?: number
  accountId: number
  voucherValue: number
  voucherPrice: number
  soldOne: number
  soldOut: number
  expiredGenerated?: Date
  active: number
  loyaltyPoint?: number
  onlyMember?: number
  description: string
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}

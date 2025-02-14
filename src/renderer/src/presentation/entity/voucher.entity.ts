// types.ts
export interface VoucherHeader {
  id: string
  voucherCode: string
  voucherName: string
  voucherImage: string | null
  voucherCount: string
  expireDate: string
  memberLastPurchaseDate: string | null
  memberExpiredDay: string | null
  onlyMember: boolean
  loyaltyPoint: string
  paymentAccountId: string | null
  accountId: string
  voucherValue: string
  voucherPrice: string
  soldOne: boolean
  soldOut: boolean
  active: boolean
  expiredGenerated: string | null
  description: string
  createdBy: string
  updatedBy: string
  deletedBy: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface VoucherDetail {
  id: string
  transId: string
  generatedCode: string
  storeId: string
  expireDate: string | null
  redeemDate: string | null
  memberId: string | null
  paymentStoreId: string
  paymentTransId: string
  usageStoreId: string | null
  usageDate: string | null
  usageDescription: string | null
  usageUserId: string | null
  usageReference: string | null
  createdBy: string
  updatedBy: string | null
  deletedBy: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface VoucherInterface {
  status: boolean
  message: string
  header: VoucherHeader
  detail: VoucherDetail
  voucherCode: string
  voucherAmount: string
}

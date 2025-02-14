export interface TblPaymentShortcut {
  id: string
  shortcutName: string
  groupName: string
  sort: number
  dineInTax: number
  memberId?: number
  sellPrice: string
  typeCode: string
  paymentOptionId?: number
  machine?: number
  bank?: number
  cardNameRequired: number
  cardNoRequired: number
  consignmentPaymentType: number
  createdBy: string
  createdAt?: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}

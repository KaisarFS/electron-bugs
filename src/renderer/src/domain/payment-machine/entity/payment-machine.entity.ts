export interface TblPaymentMachine {
  id: string
  name: string
  paymentOption: string
  qrisImage: string
  accountId?: number
  accountIdReal: string
  accountIdUnreal: string
  storeHide: string
  createdBy: string
  createdAt?: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}

export interface TblBalance {
  id: string
  seqValue: number
  storeId: number
  userId: number
  approveUserId?: number
  shiftId: number
  description: string
  open: Date
  closed?: Date
  approve?: Date
  updating: number
  createdBy: string
  createdAt?: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}

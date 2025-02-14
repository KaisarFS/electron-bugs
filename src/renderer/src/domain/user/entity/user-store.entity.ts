export interface TblUserStore {
  id: string
  userId: string
  userStoreId?: number
  defaultStore?: boolean
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
}

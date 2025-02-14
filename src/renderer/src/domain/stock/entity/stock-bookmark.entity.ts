export interface TblStockBookmark {
  id: string
  type: string
  productId: number
  groupId: number
  shortcutCode: string
  bookmarkImage: string
  createdBy: string
  createdAt?: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: string
  details: {
    productName: string
    name: string
    productImage: string
    shortName: string
  }
}

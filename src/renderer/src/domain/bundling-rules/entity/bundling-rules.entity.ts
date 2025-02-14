export interface TblBundlingRules {
  id: string
  type: string
  bundleId: number
  productId?: number
  serviceId?: number
  qty: number
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
}

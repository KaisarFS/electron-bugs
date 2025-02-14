export interface TblBundlingReward {
  id: string
  type: string
  bundleId: number
  productId?: number
  serviceId?: number
  categoryCode: string
  qty: number
  sellPrice?: number | string
  distPrice01?: number
  distPrice02?: number
  distPrice03?: number
  distPrice04?: number
  distPrice05?: number
  distPrice06?: number
  distPrice07?: number
  distPrice08?: number
  distPrice09?: number
  discount?: number
  disc1?: number
  disc2?: number
  disc3?: number
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
  replaceable: number
  hide: number
}

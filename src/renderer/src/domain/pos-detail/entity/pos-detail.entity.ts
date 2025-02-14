export interface TblPosDetail {
  id: string
  storeId: number
  categoryCode: string
  bundlingId?: number
  employeeId?: number
  transNo: string
  productId: number
  productCode: string
  qty: number
  sellPrice: number
  sellingPrice: number
  discount: number
  disc1: number
  disc2: number
  disc3: number
  discountLoyalty: number
  dpp: number
  ppn: number
  taxTypeId?: number
  divisionId?: number
  ppnOutValue: number
  total: number
  createdAt: Date
  updatedAt: Date
  typeCode: string
}

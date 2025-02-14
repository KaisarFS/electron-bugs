export interface TblStockDivision {
  id: string
  divisionName: string
  accountId?: number
  cogsAccountId?: number
  ppnOutAccountId: number
  ppnInAccountId: number
  taxTypeId?: number
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}

export interface TblStockDepartment {
  id: string
  departmentName: string
  divisionId: number
  divisionName: string
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}

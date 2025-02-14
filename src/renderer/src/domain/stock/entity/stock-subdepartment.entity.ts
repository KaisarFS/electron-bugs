export interface TblStockSubdepartment {
  id: string
  subDepartmentName: string
  divisionId: number
  divisionName: string
  departmentId: number
  departmentName: string
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
  categoryImage?: string
  categoryColor?: string
  loyaltyException: number
  commerceException: number
}

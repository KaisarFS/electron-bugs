export interface TblService {
  id: string
  serviceCode: string
  serviceName: string
  cost: number
  serviceCost: number
  serviceTypeId: string
  active: string
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
}

export interface TblUser {
  id: string
  companyId: number
  userId: string
  mobileNumber: string
  userName: string
  email: string
  fullName?: string
  active: boolean
  isEmployee?: boolean
  advancedForm: string
  hash: string
  salt: string
  totp?: string
  mobile: boolean
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
}

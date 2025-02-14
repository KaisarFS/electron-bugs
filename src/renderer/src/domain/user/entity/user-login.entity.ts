export interface TblUserLogin {
  id: string
  sessionId: string
  userId: string
  ipAddress1: string
  ipAddress2: string
  role: string
  storeId?: number
  permission: string
  loginTime?: Date
  logoutTime?: Date
}

export interface Store {
  id: number
  consignmentid?: number | null
  companyid: number
  storecode: string
  storename: string
  storeparentid?: number | null
  centralkitchenparent?: number | null
  mergestore?: number | null
  xendituserid?: string | null
  paymentuserid?: string | null
  paymentsecretkey?: string | null
  address01: string
  address02: string
  cityid: number
  status: boolean
  state?: string | null
  zipcode?: string | null
  mobileNumber: string
  phonenumber?: string | null
  email?: string | null
  initial: string
  photoqris?: string | null
  createdby: string
  createdat: string
  updatedby?: string | null
  updatedat?: string | null
  companyname?: string | null
  taxid: string
  taxconfirmdate?: string | null
  taxtype?: 'E' | 'B' | 'C' | null
  shortname?: string | null
  latitude?: number | null
  longitude?: number | null
  cashiershift?: string | null
  cashiercounter?: string | null
  settingvalue?: string | null
}

export interface UserStore {
  value: number
  companyName: string
  label: string
  code: string
  address01: string
  address02: string
  companyEmail: string | null
  mobileNumber: string
  consignmentId: number | null
  companyAddress01: string | null
  companyAddress02: string | null
  companyMobileNumber: string | null
  companyPhoneNumber: string | null
  taxID: string
  taxConfirmDate: string // ISO date string format
  taxType: string
  initial: string
}

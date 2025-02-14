import storeNetwork from '.'

export interface StoreResponse {
  success: boolean
  message: string
  data: {
    storeId: number
    storeName: string
    storeCode: string
    storeAddress: string
    storeCity: string
    storePhone: string
    storeEmail: string
    storeLogo: string
    storeQr: string
    storeQr2: string
    storeQr3: string
    storeQr4: string
  }
}

export interface AdvertisingResponse {
  success: boolean
  message: string
  data: {
    id: string
    typeAds: string
    width: string
    height: string
    name: string
    image: string | string[] // This can be a string or an array of strings
    sort: string
    createdBy: string
    updatedBy: string
  }[]
}

export class StoreService {
  static async listStoresId(id: string, token: string): Promise<StoreResponse> {
    try {
      const res = await storeNetwork.listStoresById(id, token)
      if (res.success) {
        return res
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error)?.message ?? 'Failed to get store. Please try again.',
        data: {
          storeId: 0,
          storeName: '',
          storeCode: '',
          storeAddress: '',
          storeCity: '',
          storePhone: '',
          storeEmail: '',
          storeLogo: '',
          storeQr: '',
          storeQr2: '',
          storeQr3: '',
          storeQr4: ''
        }
      }
    }
  }

  static async listAdvertising(): Promise<AdvertisingResponse> {
    try {
      const res = await storeNetwork.listAdvertising()
      if (res.success) {
        return res
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error)?.message ?? 'Failed to get store. Please try again.',
        data: []
      }
    }
  }
}

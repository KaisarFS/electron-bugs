import { GrabMartInvoice } from '@renderer/presentation/entity/grabMartInvoice.entity'
import httpClient from '../httpClient'
import Cookies from 'js-cookie'
import { APIError } from '@renderer/presentation/entity/errorAPI.entity'

const tokenJWT = Cookies.get('pos_v2')

const grabMartNetwork = {
  getGrabMartInvoice: async (payload: { shortOrderNumber: string; storeId: number }) => {
    try {
      const response: GrabMartInvoice = await httpClient(tokenJWT).post('/grabmart-code', payload)
      return response
    } catch (error) {
      const errorMessage =
        (error as APIError).response?.status === 404 ||
        (error as APIError).response?.data?.success == false
          ? (error as APIError).response?.data?.message
          : (error as APIError).message || 'An error occurred during login'
      throw new Error(errorMessage)
    }
  }
}

export default grabMartNetwork

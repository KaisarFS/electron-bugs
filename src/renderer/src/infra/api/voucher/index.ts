import Cookies from 'js-cookie'
import httpClient from '../httpClient'
import { message } from 'antd'
import { APIError } from '@renderer/presentation/entity/errorAPI.entity'

const tokenJWT = Cookies.get('pos_v2')

const voucherNetwork = {
  validateVoucher: async (payload: { voucherCode: string }) => {
    try {
      const response = await httpClient(tokenJWT).get(`/marketing-voucher-validate/${payload}`)
      return response.data
    } catch (error) {
      const errorMessage =
        (error as APIError)?.response &&
        (error as APIError)?.response?.data &&
        (error as APIError)?.response?.data?.message
          ? (error as APIError)?.response?.data?.message
          : (error as Error).message
      console.error('Failed to validate voucher:', errorMessage)
      message.error(`${errorMessage}`)
      throw new Error(errorMessage)
    }
  }
}

export default voucherNetwork

import httpClient from '../httpClient'
import Cookies from 'js-cookie'

const tokenJWT = Cookies.get('pos_v2')

const consignmentNetwork = {
  getConsignment: async (payload: { page?: number; outlet_id: number; q?: string }) => {
    try {
      const response = await httpClient(tokenJWT).get('/consignment-api/stock', {
        params: payload
      })
      return response.data
    } catch (error) {
      console.error('Consignment Stock Error:', (error as Error).message)
      throw error
    }
  }
}

export default consignmentNetwork

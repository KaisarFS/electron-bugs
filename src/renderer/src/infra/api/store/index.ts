import httpClient from '../httpClient'
import Cookies from 'js-cookie'
const tokenJWT = Cookies.get('pos_v2')

const storeNetwork = {
  listStoresById: async (id: string, token: string) => {
    try {
      const response = await httpClient(token).get(`/users/${id}/stores`, {
        params: {
          mode: 'lov'
        }
      })
      return response.data
    } catch (error) {
      console.error('StoreService listStoresById Error:', (error as Error).message)
      throw error
    }
  },
  //   membersTypes: async (token: string) => {
  //     try {
  //       const response = await httpClient(token).get('/members/types')
  //       return response.data
  //     } catch (error) {
  //       console.error('AuthService MembersTypes Error:', (error as Error).message)
  //       throw error
  //     }
  //   }
  listAdvertising: async () => {
    try {
      const response = await httpClient(tokenJWT).get(
        '/advertising?type=all&typeAds[]=CUSTVIEW&typeAds[]=CUSTROLL&order=sort'
      )
      return response.data
    } catch (error) {
      console.error('StoreService listAdvertising Error:', (error as Error).message)
      throw error
    }
  }
}

export default storeNetwork

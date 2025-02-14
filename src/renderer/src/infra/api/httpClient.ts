import axios, { AxiosInstance } from 'axios'
import Cookies from 'js-cookie'

const tokenJWT = Cookies.get('pos_v2')

// const env = import.meta.env.VITE_ELECTRIC_URL
const NEWPOS_BASE_URL = import.meta.env.VITE_NEWPOS_BASE_URL

const httpClient = (token: string = ''): AxiosInstance => {
  const headers =
    token !== '' || tokenJWT
      ? {
          'Content-Type': 'application/json',
          Authorization: `JWT ${tokenJWT ? tokenJWT : token !== '' ? token : tokenJWT}`
        }
      : {
          'Content-Type': 'application/json'
        }

  return axios.create({
    baseURL: `${NEWPOS_BASE_URL}/api/v1`,
    timeout: 5000,
    headers
  })
}

const client = httpClient()
client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('HTTP Client Error:', error)
    return Promise.reject(error)
  }
)

export default httpClient

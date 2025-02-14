import { APIError } from '@renderer/presentation/entity/errorAPI.entity'
import httpClient from '../httpClient'
import Cookies from 'js-cookie'

const tokenJWT = Cookies.get('pos_v2')

const authNetwork = {
  login: async (loginData: { userid: string; password: string; device: string }) => {
    try {
      const response = await httpClient('').post('/users/login', loginData)
      return response.data
    } catch (error) {
      const errorMessage =
        (error as APIError).response?.status === 401 ||
        (error as APIError).response?.data?.message === 'Unauthorized'
          ? 'Unauthorized'
          : (error as APIError).message || 'An error occurred during login'
      console.error('AuthService Login Error:', errorMessage)
      throw new Error(errorMessage)
    }
  },
  membersTypes: async (token: string) => {
    try {
      const response = await httpClient(token).get('/members/types')
      return response.data
    } catch (error) {
      console.error('AuthService MembersTypes Error:', (error as Error).message)
      throw error
    }
  },
  searchMember: async (query: string) => {
    try {
      const response = await httpClient(tokenJWT).get(`/members?q=${query}&page=1`)
      return response.data
    } catch (error) {
      console.error('AuthService SearchMember Error:', (error as Error).message)
      throw error
    }
  },
  memberCashback: async (id: string) => {
    try {
      const response = await httpClient().get(`/members/cashback/${id}`)
      return response.data
    } catch (error) {
      console.error('AuthService MemberCashback Error:', (error as Error).message)
      throw error
    }
  },
  createMember: async (memberData: {
    gender: string
    memberCode: string
    memberGetDefault: boolean
    memberGroupId: number
    memberName: string
    memberTypeId: number
    mobileNumber: string
    phoneNumber: string
  }) => {
    try {
      const response = await httpClient().post(`/members/${memberData.phoneNumber}`, memberData)
      return response.data
    } catch (error) {
      console.error('AuthService CreateMember Error:', (error as Error).message)
      throw error
    }
  }
}

export default authNetwork

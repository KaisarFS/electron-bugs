import httpClient from '../httpClient'

export interface EmployeeFingerprintData {
  fingerprint: string
  employeeId: number
  applicationSource: string
  endpoint: string
  transType: string
  validationType: string
}

export interface PettyCashData {
  dateTime: string
  expenseTotal: number
  discount: number
  employeeName: string
  reference: string
  description: string
  storeId: number
}

const pettyCashNetwork = {
  getPettyCash: async (storeId: string) => {
    try {
      const response = await httpClient('').get(`/petty-cash-employee?storeId=${storeId}`)
      return response.data
    } catch (error) {
      console.error('Get Petty Cash Employee Error:', (error as Error).message)
      throw error
    }
  },
  registerEmployeeFingerprint: async (data: EmployeeFingerprintData) => {
    try {
      const response = await httpClient('').post('/fingerprint-employee/register', data)
      return response.data
    } catch (error) {
      console.error('Register Employee Fingerprint Error:', (error as Error).message)
      throw error
    }
  },
  submitPettyCash: async (data: PettyCashData) => {
    try {
      const response = await httpClient('').post('/petty-cash-detail', data)
      if (response.status === 200 && response.data.success) {
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to submit petty cash')
      }
    } catch (error) {
      console.error('Submit Petty Cash Error:', (error as Error).message)
      throw error
    }
  }
}

export default pettyCashNetwork

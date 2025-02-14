import pettyCashNetwork from '.'

interface PettyCashResponse {
  success: boolean
  message: string
}

interface EmployeeFingerprintData {
  fingerprint: string
  employeeId: number
}

export class PettyCashService {
  static async getPettyCash(storeId: string): Promise<PettyCashResponse | Error> {
    try {
      const res = await pettyCashNetwork.getPettyCash(storeId)
      if (res.success) {
        return res
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      return new Error(
        (error as Error)?.message ?? 'Failed to get petty cash employee. Please try again.'
      )
    }
  }

  static async registerEmployeeFingerprint(
    params: EmployeeFingerprintData
  ): Promise<PettyCashResponse | Error> {
    try {
      const res = await pettyCashNetwork.registerEmployeeFingerprint(params)

      if (res.success) {
        return res
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      return new Error(
        (error as Error)?.message ?? 'Failed to register employee fingerprint. Please try again.'
      )
    }
  }

  static async submitPettyCash(): Promise<PettyCashResponse | Error> {
    try {
      const pettyCashData = {
        dateTime: '',
        expenseTotal: 0,
        discount: 0,
        employeeName: '',
        reference: '',
        description: '',
        storeId: 0
      }
      const res = await pettyCashNetwork.submitPettyCash(pettyCashData)

      if (res.success) {
        return res
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      return new Error(
        (error as Error)?.message ?? 'Failed to submit petty cash. Please try again.'
      )
    }
  }
}

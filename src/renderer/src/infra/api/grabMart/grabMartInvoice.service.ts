import { GrabMartInvoice } from '@renderer/presentation/entity/grabMartInvoice.entity'
import grabMartNetwork from '.'

export class GrabMartService {
  static async grabMartInvoice(payload: {
    shortOrderNumber: string
    storeId: number
  }): Promise<GrabMartInvoice | Error> {
    try {
      const res = await grabMartNetwork.getGrabMartInvoice(payload)
      if (res.success) {
        return res
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      return new Error(
        (error as Error)?.message ?? 'Failed to post grabmart invoice. Please try again.'
      )
    }
  }
}

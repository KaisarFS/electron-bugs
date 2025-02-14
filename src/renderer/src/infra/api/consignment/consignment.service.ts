import { Consignment } from '@renderer/presentation/entity/consignment.entity'
import consignmentNetwork from '.'

export class ConsignmentService {
  static async consignmentStock(payload: {
    page?: number
    outlet_id: number
    q?: string
  }): Promise<Consignment | Error> {
    try {
      const res = await consignmentNetwork.getConsignment(payload)
      if (res.success) {
        return res
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      return new Error(
        (error as Error)?.message ?? 'Failed to get consignment stock. Please try again.'
      )
    }
  }
}

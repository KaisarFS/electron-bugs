import voucherNetwork from '.'

interface VoucherResponse {
  success: boolean
  message: string
}

export class VoucherService {
  static async getVoucher(payload: { voucherCode }): Promise<VoucherResponse | Error> {
    try {
      const res = await voucherNetwork.validateVoucher(payload)
      if (res.success) {
        return res
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      return new Error((error as Error)?.message ?? 'Failed to get voucher')
    }
  }
}

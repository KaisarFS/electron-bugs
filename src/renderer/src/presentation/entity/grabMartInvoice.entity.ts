export interface GrabMartInvoice {
  success: boolean
  message: string
  data: GrabMartInvoiceData
}

export interface GrabMartInvoiceData {
  id: string
  orderId: string
  merchantId: string
  partnerMerchantId: string
  shortOrderNumber: string
  paymentType: string
  currencyCode: string
  currencySymbol: string
  currencyExponent: number
  cutlery: boolean
  completeTime: string | null
  orderTime: string
  submitTime: string | null
  priceSubtotal: string
  priceTax: string
  priceDeliveryFee: string
  priceEaterPayment: string
  priceGrabFundPromo: string
  priceMerchantFundPromo: string
  priceMerchantChargeFee: string
  featureFlagsOrderAcceptedType: string
  featureFlagsOrderType: string
  featureFlagsIsMexEditOrder: boolean
  dineIn: string | null
  status: string
  cancelMessage: string | null
  driverETA: string | null
  scheduledTime: string
  membershipId: string
  createdBy: string
  updatedBy: string | null
  deletedBy: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  campaigns: GrabMartCampaign[]
  campaignItem: string[]
}

export interface GrabMartCampaign {
  id: string
  orderId: string
  campaignId: string
  campaignName: string
  deductedAmount: string
  deductedPart: string
  level: string
  mexFundedRatio: string
  type: string
  usageCount: string
  freeItemId: string
  freeItemName: string
  qty: string
  price: string
  createdBy: string
  updatedBy: string | null
  deletedBy: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  appliedItemIDs: string[]
}

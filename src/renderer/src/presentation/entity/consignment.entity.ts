export interface Consignment {
  id: number
  outlet_id: number
  product_id: number
  price: number
  quantityTotal: number
  quantity: number
  created_at: string
  updated_at: string
  price_grabfood_gofood: number | null
  price_grabmart: number
  price_shopee: number
  product: Product
}

export interface Product {
  id: number
  vendor_id: number
  product_code: string
  product_name: string
  photo: string
  barcode: string | null
  noLicense: string | null
  grabCategoryId: number | null
  grabCategoryName: string | null
  grabmartPublished: number
  productImage: string | null
  weight: number | null
  created_at: string
  updated_at: string
  description: string | null
  deleted_at: string | null
  category_id: number
  subcategory_id: number
  capital: number
  vendor: Vendor
}

interface Vendor {
  id: number
  name: string
  vendor_code: string
}

export interface ConsignmentResponse {
  success: boolean
  message: string
  pageSize: number
  page: string
  total: number
  data: Consignment[]
}

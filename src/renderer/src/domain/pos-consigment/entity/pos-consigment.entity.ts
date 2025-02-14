interface Product {
  id: number
  barcode: string
  capital: number
  category_id: number
  created_at: string
  deleted_at?: string | null
  description: string
  grabCategoryId?: number | null
  grabCategoryName?: string | null
  grabmartPublished: number
  noLicense?: string | null
  photo?: string | null
  productImage: string
  product_code: string
  product_name: string
  subcategory_id: number
  updated_at: string
  vendor: Vendor
  vendor_id: number
  weight: string
}

interface Vendor {
  id: number
  name: string
  vendor_code: string
}

export interface TblPosConsignment {
  id: number
  outlet_id: number
  price: number
  price_grabfood_gofood: number
  price_grabmart: number
  price_shopee: number
  product_id: number
  product: Product
  quantity: number
  quantityTotal: number
  created_at: string
  updated_at: string
}

import { ListCategory } from '@renderer/redux/store/slices/cashierSlice'

export interface Products {
  name: string
  active: number
  activeShop: number
  alertQty: string
  aspectRatio: string | null
  barCode01: string
  barCode02: string
  brandId: number
  categoryId: number
  costPrice: number
  countryName: string
  createdAt: string
  createdBy: string
  departmentId: number
  description: string
  dimension: string
  dimensionBox: string
  dimensionPack: string
  distPrice01: string
  distPrice02: string
  distPrice03: string
  distPrice04: string
  distPrice05: string
  distPrice06: string
  distPrice07: string
  distPrice08: string
  distPrice09: string
  divisionId: number
  dummyCode: string
  dummyName: string
  exception01: number
  expressActive: number
  expressBrandId: string | null
  expressBrandName: string | null
  expressCategoryId: string | null
  expressCategoryName: string | null
  expressItemId: string | null
  expressReturnPolicy: string | null
  expressUploaded: string
  grabCategoryId: number
  grabCategoryName: string
  id: number
  isHalal: number
  isStaging: number
  isStockOpname: number
  location01: string
  location02: string
  locationId: number
  otherName01: string | null
  otherName02: string | null
  ppn: string
  productBaseTag: string
  productCode: string
  productImage: string[]
  productName: string
  productTag: string
  publishDate: string | null
  rimDiameter: string | null
  sectionWidth: string | null
  sellPrice: string
  sellPricePre: string
  stockOpnameAccount: number
  subdepartmentId: number
  supplierId: number
  supplierSource: number
  taxType: string
  trackQty: number
  updatedAt: string
  updatedBy: string
  usageMileage: number
  usageTimePeriod: number
  weight: string
  qty: number
  productId: number
  type: string
  product: {
    product_name: string
    product_code: string
    productCode: string
    productName: string
  }
  price: number
  serviceCode: string
  serviceName: string
  serviceCost: number
  listCategory: ListCategory[]
  shortName: string
}

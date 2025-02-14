export interface CategoryValue {
  id: number
  qty: number
  code: string
  name: string
}

export interface SelectedCategory {
  id: number
  bundleId: number
  categoryName: string
  categoryCode: number
  selectedItem: { id: number; qty: number; code: string; name: string }
}

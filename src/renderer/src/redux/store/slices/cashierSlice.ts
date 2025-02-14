/* eslint-disable @typescript-eslint/no-unused-vars */

import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../index'
import { PGlite } from '@electric-sql/pglite'
import localStorage from '../../../presentation/ui/helper/localStorage'
import { TblPaymentShortcut } from '@renderer/domain/payment-shortcut/entity/payment-shortcut.entity'
import { TblService } from '@renderer/domain/service/entity/service.entity'
import { TblStock } from '@renderer/domain/stock/entity/stock.entity'
import { TblBundling } from '@renderer/domain/bundling/entity/bundling.entity'
import { ConsignmentService } from '@renderer/infra/api/consignment/consignment.service'
import { Products } from '@renderer/presentation/entity/product.entity'
import { TblBundlingReward } from '@renderer/domain/bundling-reward/entity/bundling-reward.entity'
import { Misc } from '@renderer/domain/misc/entity/misc.entity'
import { TblStockCategory } from '@renderer/domain/stock/entity/stock-category.entity'
import { AllValues } from '@renderer/presentation/entity/itemDetail.entity'
import { ConsignmentResponse } from '@renderer/presentation/entity/consignment.entity'

export type DetailProduct = {
  disc1: number
  disc2: number
  disc3: number
  discount: number
}

export interface TransactionHistory {
  invoiceNumber: number
  reference: string
  transDate: string
  totalAmount: number
}

export type Product = {
  listCategory: ListCategory[]
  name: string
  id: number
  qty: string
  price: string
  disc1: string | number
  disc2: string | number
  disc3: string | number
  discount: string | number
  type: string
  categoryCode: number
  productId: number
  bundleId: number
  serviceCost: string
}

export interface ProductList {
  typeProduct: string
  productListCode: string | null
  productListName: string | null
  qty: string
  price: string
  totalPrice: string | number
  detailProduct: Product | Product[]
}

export interface ListCategory {
  id: number
  qty: string | number
  code: string
  name: string
}

export interface ProductListCategory {
  id: number
  bundleId: string | number
  categoryName: string
  categoryCode: string
  listCategory: ListCategory[]
}

export interface CashierState {
  productList: ProductList[]
  productListCategory: ProductListCategory[]
  isModalItemDetailVisible: boolean
  isModalQuantityVisible: boolean
  isModalChooseCategoryVisible: boolean
  isModalTransactionHistoryVisible: boolean
  indexItem: null | number
  paymentType: number
  paymentShortcut: TblPaymentShortcut
  transactionHistory: TransactionHistory[]
  errorMessage: string
}

const initialState: CashierState = {
  productList: localStorage.getCashierTrans() || [],
  productListCategory: [],
  isModalItemDetailVisible: false,
  isModalQuantityVisible: false,
  isModalChooseCategoryVisible: false,
  isModalTransactionHistoryVisible: false,
  indexItem: null,
  paymentType: 1,
  paymentShortcut: localStorage.getPaymentShortcut() || {},
  transactionHistory: [],
  errorMessage: ''
}

const cashierSlice = createSlice({
  name: 'cashier',
  initialState,
  reducers: {
    setPaymentType(state, action: PayloadAction<number>) {
      state.paymentType = action.payload
    },
    setPaymentShortcut(state, action: PayloadAction<TblPaymentShortcut>) {
      state.paymentShortcut = action.payload

      if (state.productList && state.productList.length > 0) {
        const sellPriceKey =
          action.payload.sellPrice === 'retailPrice' ? 'sellPrice' : action.payload.sellPrice

        state.productList = state.productList.map((product) => {
          if (product.typeProduct === 'Service' || product.typeProduct === 'Consignment') {
            return product
          }
          let priceType = 0
          if (Array.isArray(product.detailProduct)) {
            const detailPrices = product.detailProduct.map((detail) => {
              const sellPrice = parseFloat(detail[sellPriceKey] || '0')
              priceType = parseFloat(detail[sellPriceKey] || '0')
              return sellPrice * parseInt(product.qty, 10)
            })

            const totalPrice = detailPrices.reduce((acc, curr) => acc + curr, 0)

            return {
              ...product,
              price:
                product.typeProduct === 'Bundle' ? totalPrice.toFixed(2) : priceType.toFixed(2),
              totalPrice: totalPrice.toFixed(2)
            }
          }

          const sellPrice = parseFloat(product.detailProduct[sellPriceKey] || '0')
          const qty = parseInt(product.qty, 10)
          const totalPrice = sellPrice * qty

          return {
            ...product,
            price: sellPrice.toFixed(2),
            totalPrice: totalPrice.toFixed(2)
          }
        })

        localStorage.setCashierTrans(state.productList)
      }
    },
    setItemDetailVisible(
      state,
      action: PayloadAction<{ isOpen: boolean; indexItem: number | null, isModalQuantityVisible: boolean }>
    ) {
      state.isModalItemDetailVisible = action.payload.isOpen
      state.isModalQuantityVisible = action.payload.isModalQuantityVisible
      state.indexItem = action.payload.indexItem
    },
    setChooseCategoryVisible(state, action: PayloadAction<boolean>) {
      state.isModalChooseCategoryVisible = action.payload

      if (!action.payload) {
        state.productListCategory = []
      }
    },
    setChooseCategory(state, action: PayloadAction<ProductListCategory | ProductListCategory[]>) {
      if (Array.isArray(action.payload)) {
        state.productListCategory = [...state.productListCategory, ...action.payload]
      } else {
        state.productListCategory.push(action.payload)
      }
    },
    setProductList(
      state: CashierState,
      action: PayloadAction<{ data: ProductList | ProductList[]; canAdd: boolean }>
    ) {
      const sellPriceKey =
        state.paymentShortcut.sellPrice === 'retailPrice'
          ? 'sellPrice'
          : state.paymentShortcut.sellPrice
      const isCanAadd = action.payload.canAdd
      if (Array.isArray(action.payload.data)) {
        action.payload.data.forEach((newProduct) => {
          const existingProductIndex = state.productList.findIndex(
            (product) =>
              product.typeProduct === newProduct.typeProduct &&
              product.productListCode === newProduct.productListCode
          )

          if (existingProductIndex !== -1) {
            const existingProduct = state.productList[existingProductIndex]

            if (
              !isCanAadd &&
              (newProduct.typeProduct === 'Product' ||
                newProduct.typeProduct === 'Consignment' ||
                newProduct.typeProduct === 'Service')
            ) {
              state.errorMessage = 'Item Already Exist'
            } else {
              existingProduct.qty = (
                parseInt(existingProduct.qty) + parseInt(newProduct.qty)
              ).toString()
              let price = 0

              if (Array.isArray(existingProduct.detailProduct)) {
                price = existingProduct.detailProduct.reduce((acc, detail) => {
                  const detailPrice = parseFloat(detail[sellPriceKey] || '0')
                  return acc + detailPrice
                }, 0)
              } else {
                const detailProductt: Product = existingProduct.detailProduct
                price = detailProductt[sellPriceKey]
                  ? parseFloat(detailProductt[sellPriceKey])
                  : parseFloat(
                      existingProduct.typeProduct === 'Consignment'
                        ? detailProductt.price
                        : detailProductt.serviceCost
                    )
              }
              const totalPrice = price * parseInt(existingProduct.qty, 10)

              state.productList[existingProductIndex] = {
                ...existingProduct,
                price: price.toFixed(2),
                totalPrice: parseFloat(totalPrice.toFixed(2))
              }
            }
          } else {
            let price = 0
            if (Array.isArray(newProduct.detailProduct)) {
              price = newProduct.detailProduct.reduce((acc, detail) => {
                const detailPrice = parseFloat(detail[sellPriceKey] || '0')
                return acc + detailPrice
              }, 0)
            } else {
              const detailProductt: Product = newProduct.detailProduct
              price = detailProductt[sellPriceKey]
                ? parseFloat(detailProductt[sellPriceKey])
                : parseFloat(
                    newProduct.typeProduct === 'Consignment'
                      ? detailProductt.price
                      : detailProductt.serviceCost
                  )
            }

            const totalPrice = price * parseInt(newProduct.qty, 10)

            state.productList.push({
              ...newProduct,
              price: price.toFixed(2),
              totalPrice: parseFloat(totalPrice.toFixed(2))
            })
          }
        })
      } else {
        const newProduct = action.payload.data
        const existingProductIndex = state.productList.findIndex(
          (product) =>
            product.typeProduct === newProduct.typeProduct &&
            product.productListCode === newProduct.productListCode
        )

        if (existingProductIndex !== -1) {
          const existingProduct = state.productList[existingProductIndex]

          if (
            !isCanAadd &&
            (newProduct.typeProduct === 'Product' ||
              newProduct.typeProduct === 'Consignment' ||
              newProduct.typeProduct === 'Service')
          ) {
            state.errorMessage = 'Item Already Exist'
          } else {
            existingProduct.qty = (
              parseInt(existingProduct.qty) + parseInt(newProduct.qty)
            ).toString()
            existingProduct.totalPrice = (
              parseFloat(existingProduct.totalPrice.toString()) +
              parseFloat(newProduct.totalPrice.toString())
            ).toFixed(2) // ✅ Konversi ke string
          }
        } else {
          const price = newProduct.detailProduct[sellPriceKey] || parseFloat(newProduct.price)
          const totalPrice = price * parseInt(newProduct.qty, 10)

          state.productList.push({
            ...newProduct,
            price: price.toFixed(2),
            totalPrice: parseFloat(totalPrice.toFixed(2))
          })
        }
      }

      localStorage.setCashierTrans(state.productList)
      const serializableData = JSON.parse(JSON.stringify(state.productList))
      window.api.send('update-products', serializableData)
    },
    updateItem(state, action: PayloadAction<AllValues>) {
      const { no, qty, disc1, disc2, disc3, discount } = action.payload
      console.log(no, "<==== no updateItem cashierSlice.ts")

      // Temukan produk berdasarkan indeks `no`
      const product = state.productList.find((_, index) => {
        return index === no
      })
      // const product = state.productList[no];

      // if (isNaN(no) || no < 0 || no >= state.productList.length) {
      //   console.error(`Invalid product index: ${no}`);
      //   return;
      // }
      
      // const product = state.productList[no]; // Use direct indexing
      

      if (product) {
        // Konversi harga ke angka untuk memastikan perhitungan
        const price = parseFloat(product.price)

        // Hitung totalPrice
        let totalPrice = price * qty - (price * qty * (disc1 + disc2 + disc3)) / 100 - discount

        // console.log('===== DIATAS CEK DATA LUARxx cashierSlies.ts=====')
        // console.log(price, '<=== price')
        // console.log(totalPrice, '<=== totalPrice')
        // console.log(
        //   'cek data luar xx=>',
        //   'price:',
        //   price,
        //   'no:',
        //   no,
        //   'qty:',
        //   qty,
        //   'disc1:',
        //   disc1,
        //   'disc2:',
        //   disc2,
        //   'disc3',
        //   disc3,
        //   'discount:',
        //   discount,
        //   'totalPrice:',
        //   totalPrice
        // )
        if (totalPrice < 0) {
          totalPrice = 0
        }

        // Perbarui qty dan totalPrice di productList
        product.qty = qty.toString()
        product.totalPrice = totalPrice

        // Perbarui disc1, disc2, disc3, dan discount di detailProduct
        if (Array.isArray(product.detailProduct)) {
          console.log('cek data if', current(product.detailProduct))
          // const detailProductt: Product[] = product.detailProduct
          // detailProductt.map((detail) => ({
          //   ...detail,
          //   disc1: disc1,
          //   disc2: disc2,
          //   disc3: disc3,
          //   discount: discount
          // }))
          product.detailProduct.forEach((detail) => {
            detail.disc1 = disc1
            detail.disc2 = disc2
            detail.disc3 = disc3
            detail.discount = discount
          })
        } else {
          // console.log('cek data else', current(product.detailProduct), product.totalPrice)
          product.detailProduct = {
            ...product.detailProduct,
            disc1,
            disc2,
            disc3,
            discount
          }
        }

        localStorage.setCashierTrans(state.productList)
        const serializableData = JSON.parse(JSON.stringify(state.productList))
        window.api.send('update-products', serializableData)
      } else {
        console.error('Product not found for index:', no)
      }
    },

    updateListCategoryInDetailProduct(
      state,
      action: PayloadAction<
        {
          id: number
          bundleId: number
          categoryName: string
          categoryCode: number
          selectedItem: { id: number; qty: number; code: string; name: string }
        }[]
      >
    ) {
      action.payload.forEach((selection) => {
        if (!selection.categoryCode || !selection.bundleId) {
          console.error('Category code or bundleId is missing in selection:', selection)
          return
        }

        const parsedSelectedItem =
          typeof selection.selectedItem === 'string'
            ? JSON.parse(selection.selectedItem)
            : selection.selectedItem

        const updateDetailProduct = (item: ProductList, type: string) => {
          // Pastikan detailProduct adalah array sebelum melakukan map
          if (!Array.isArray(item.detailProduct)) {
            console.error(`detailProduct is not an array for item:`, item)
            return
          }

          item.detailProduct = item.detailProduct.map((detail: Product) => {
            if (
              detail.bundleId === selection.bundleId &&
              ((type === 'P' && detail.productId === selection.categoryCode) ||
                (type === 'S' && detail.categoryCode === selection.categoryCode))
            ) {
              const existingIndex = detail.listCategory.findIndex(
                (cat: ListCategory) =>
                  cat.id === parsedSelectedItem.id && cat.code === parsedSelectedItem.code
              )

              if (existingIndex !== -1) {
                detail.listCategory[existingIndex].qty =
                  (Number(detail.listCategory[existingIndex].qty) || 0) +
                  (Number(parsedSelectedItem.qty) || 1) // ✅ Pastikan semua menjadi number
              } else {
                detail.listCategory = [...detail.listCategory, parsedSelectedItem]
              }

              return {
                ...detail,
                name: '',
                code: ''
              }
            }
            return detail
          })
        }

        // Perbarui produk jika cocok
        const product = state.productList.find(
          (item) =>
            Array.isArray(item.detailProduct) &&
            item.detailProduct.some(
              (detail: Product) =>
                detail.bundleId === selection.bundleId &&
                detail.productId === selection.categoryCode &&
                detail.type === 'P'
            )
        )
        if (product) {
          updateDetailProduct(product, 'P')
        }

        // Perbarui layanan jika cocok
        const service = state.productList.find(
          (item) =>
            Array.isArray(item.detailProduct) &&
            item.detailProduct.some(
              (detail: Product) =>
                detail.bundleId === selection.bundleId &&
                detail.categoryCode === selection.categoryCode &&
                detail.type === 'S'
            )
        )
        if (service) {
          updateDetailProduct(service, 'S')
        }
      })
    },
    deleteItem(state, action: PayloadAction<number>) {
      const no = action.payload

      // Validasi apakah index valid
      if (no >= 0 && no < state.productList.length) {
        state.productList.splice(no, 1)
      } else {
        state.errorMessage = `Invalid index for deletion: ${no}`
      }

      localStorage.setCashierTrans(state.productList)
      const serializableData = JSON.parse(JSON.stringify(state.productList))
      window.api.send('update-products', serializableData)
    },

    setTranscationHistory(state, action: PayloadAction<boolean>) {
      state.isModalTransactionHistoryVisible = action.payload
    },
    setClearProductList(state, action: PayloadAction<ProductList[]>) {
      state.productList = action.payload
      localStorage.removeCashierTrans()
    },
    setErrorMessage(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload
    },
    clearErrorMessage(state) {
      state.errorMessage = ''
    }
  }
})

export const setProductQuery =
  (db: PGlite, productId?: number, type?: string): AppThunk =>
  async (dispatch) => {
    try {
      if (!productId || !type) {
        dispatch(setErrorMessage('Product ID and Type are required'))
        return
      }

      const productUnityData: ProductList[] = []

      if (type === 'PRODUCT') {
        // Query untuk mendapatkan data dari tbl_stock
        const productQuery = `SELECT * FROM tbl_stock WHERE "id" = ${productId}`
        const productResult = await db.query(productQuery)
        if (productResult.rows.length > 0) {
          const product = productResult.rows[0]

          const detailProduct = (productResult.rows as TblStock[]).map((item) => ({
            ...item,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            discount: 0,
            listCategory: []
          }))

          productUnityData.push({
            typeProduct: 'Product',
            productListCode: (product as Products).productCode,
            productListName: (product as Products).productName,
            qty: '1',
            price: (product as Products).sellPrice,
            totalPrice: (product as Products).sellPrice,
            detailProduct: detailProduct as unknown as Product
          })
        }
      } else if (type === 'BUNDLE') {
        // Query untuk mendapatkan data dari tbl_bundling
        const bundleQuery = `SELECT * FROM tbl_bundling WHERE "id" = ${productId}`
        const bundleResult = await db.query(bundleQuery)

        if (bundleResult.rows.length > 0) {
          const bundle = bundleResult.rows[0] as TblBundling

          // Query untuk mendapatkan data dari tbl_bundling_reward
          const rewardQuery = `SELECT * FROM tbl_bundling_reward WHERE "bundleId" = ${(bundle as TblBundling).id}`
          const rewardResult = await db.query(rewardQuery)

          let totalPrice = 0

          const detailProduct = await Promise.all(
            (rewardResult.rows as TblBundlingReward[]).map(async (reward) => {
              if (
                reward.type === 'P' &&
                reward.categoryCode === null &&
                reward.productId !== null
              ) {
                // Jika type adalah P, ambil data dari tbl_stock
                const stockQuery = `SELECT * FROM tbl_stock WHERE "id" = ${reward.productId}`
                const stockResult = await db.query(stockQuery)
                const stock = stockResult.rows[0] as TblStock
                // totalPrice += parseFloat(reward.sellPrice) // Tambahkan sellPrice
                if (reward.sellPrice !== undefined) {
                  totalPrice += parseFloat(reward.sellPrice.toString())
                } else {
                  totalPrice += 0
                }
                return {
                  ...reward,
                  name: stock?.productName || '',
                  code: stock?.productCode || '',
                  listCategory: []
                }
              } else if (
                reward.type === 'S' &&
                reward.categoryCode === null &&
                reward.serviceId !== null
              ) {
                // Jika type adalah S, ambil data dari tbl_service
                const serviceQuery = `SELECT * FROM tbl_service WHERE "id" = ${reward.serviceId}`
                const serviceResult = await db.query(serviceQuery)
                const service = serviceResult.rows[0] as TblService
                // totalPrice += parseFloat(reward.sellPrice) // Tambahkan sellPrice
                if (reward.sellPrice !== undefined) {
                  totalPrice += parseFloat(reward.sellPrice.toString())
                } else {
                  totalPrice += 0
                }
                return {
                  ...reward,
                  name: service?.serviceName || '',
                  code: service?.serviceCode || '',
                  listCategory: []
                }
              } else if (
                reward.categoryCode !== null &&
                reward.serviceId !== null &&
                reward.type === 'S'
              ) {
                // Jika categoryCode tidak null, serviceId tidak null, dan type adalah S
                const miscQuery = `SELECT * FROM tbl_misc WHERE "id" = ${reward.serviceId}`
                const miscResult = await db.query(miscQuery)
                const misc = miscResult.rows[0] as Misc

                const serviceCategoryQuery = `SELECT * FROM tbl_service WHERE "serviceTypeId" = '${reward.categoryCode}'`
                const serviceCategoryResult = await db.query(serviceCategoryQuery)

                const listCategory = (serviceCategoryResult.rows as TblService[]).map(
                  (service, i) => ({
                    id: i + 1,
                    qty: 1,
                    code: service.serviceCode,
                    name: service.serviceName
                  })
                )

                // Perbanyak kategori sesuai dengan reward.qty
                const duplicatedCategories: ProductListCategory[] = Array.from({
                  length: reward.qty || 1
                }).map((_, idx) => ({
                  id: idx + 1,
                  bundleId: reward.bundleId,
                  categoryName: `Service Category ${idx + 1}: ${misc?.miscName || ''}`,
                  categoryCode: reward.categoryCode,
                  listCategory // Sama untuk semua duplikasi
                }))

                // Dispatch semua kategori yang dibuat
                duplicatedCategories.forEach((category: ProductListCategory) => {
                  dispatch(setChooseCategory(category))
                })

                if (listCategory.length > 0) dispatch(setChooseCategoryVisible(true))

                // totalPrice += parseFloat(reward.sellPrice) // Tambahkan sellPrice
                if (reward.sellPrice !== undefined) {
                  totalPrice += parseFloat(reward.sellPrice.toString())
                } else {
                  totalPrice += 0
                }
                return {
                  ...reward,
                  code: listCategory[0]?.code || '',
                  name: listCategory[0]?.name || '',
                  listCategory: []
                }
              } else if (
                reward.categoryCode !== null &&
                reward.productId !== null &&
                reward.type === 'P'
              ) {
                // Jika categoryCode tidak null, productId tidak null, dan type adalah P
                const stockCategoryQuery = `SELECT * FROM tbl_stock_category WHERE "categoryCode" = '${reward.categoryCode}'`
                const stockCategoryResult = await db.query(stockCategoryQuery)
                const category = stockCategoryResult.rows[0] as TblStockCategory

                const productCategoryQuery = `SELECT * FROM tbl_stock WHERE "categoryId" = '${category?.id}'`
                const productCategoryResult = await db.query(productCategoryQuery)

                const listCategory = (productCategoryResult.rows as TblStock[]).map(
                  (product, i) => ({
                    id: i + 1,
                    qty: 1,
                    code: product.productCode,
                    name: product.productName
                  })
                )

                // Perbanyak ProductListCategory sesuai dengan reward.qty
                const duplicatedCategories: ProductListCategory[] = Array.from({
                  length: reward.qty || 1
                }).map((_, idx) => ({
                  id: idx + 1,
                  bundleId: reward.bundleId,
                  categoryName: `Product Category ${idx + 1}: ${category?.categoryName || ''}`,
                  categoryCode: category?.id,
                  listCategory // Gunakan listCategory yang sama untuk semua duplikasi
                }))

                // Dispatch semua kategori yang dibuat
                duplicatedCategories.forEach((category: ProductListCategory) => {
                  dispatch(setChooseCategory(category))
                })

                if (listCategory.length > 0) dispatch(setChooseCategoryVisible(true))

                // totalPrice += parseFloat(reward.sellPrice)
                if (reward.sellPrice !== undefined) {
                  totalPrice += parseFloat(reward.sellPrice.toString())
                } else {
                  totalPrice += 0
                }
                return {
                  ...reward,
                  name: listCategory[0]?.name || '',
                  code: listCategory[0]?.code || '',
                  listCategory: []
                }
              }

              return reward
            })
          )

          productUnityData.push({
            typeProduct: 'Bundle',
            productListCode: bundle.code,
            productListName: bundle.name,
            qty: '1',
            price: totalPrice.toString(), // Untuk type B saja
            totalPrice: totalPrice,
            detailProduct: detailProduct as unknown as Product // Semua hasil tbl_bundling_reward
          })
        }
      }
      dispatch(setProductList({ data: productUnityData, canAdd: true }))
    } catch (error) {
      console.error('Error processing product list data:', error)
      dispatch(setErrorMessage('Failed to process product list data'))
    }
  }

export const fetchProductQuery =
  (db: PGlite, value: string, outlet_id: number): AppThunk =>
  async (dispatch) => {
    try {
      let query = `SELECT * FROM tbl_stock WHERE "barCode01" = '${value}'`
      let result = await db.query(query)

      if (result.rows.length > 0) {
        const data = result.rows[0] as TblStock

        const productListData = [
          {
            typeProduct: 'Product',
            productListCode: data.productCode,
            productListName: data.productName,
            qty: '1',
            price: data.sellPrice,
            totalPrice: data.sellPrice,
            detailProduct: { ...data, disc1: 0, disc2: 0, disc3: 0, discount: 0 }
          }
        ]

        dispatch(
          setProductList({
            data: productListData as unknown as ProductList | ProductList[],
            canAdd: true
          })
        )
        return
      }

      query = `SELECT * FROM tbl_service WHERE "serviceCode" = '${value}'`
      result = await db.query(query)

      if (result.rows.length > 0) {
        const record = result.rows[0] as TblService

        const productListData = [
          {
            typeProduct: 'Service',
            productListCode: record.serviceCode,
            productListName: record.serviceName,
            qty: '1',
            price: record.serviceCost,
            totalPrice: record.serviceCost,
            detailProduct: { ...record, disc1: 0, disc2: 0, disc3: 0, discount: 0 }
          }
        ]

        dispatch(
          setProductList({
            data: productListData as unknown as ProductList | ProductList[],
            canAdd: true
          })
        )
        return
      }

      query = `SELECT * FROM tbl_bundling WHERE "code" = '${value}'`
      result = await db.query(query)

      if (result.rows.length > 0) {
        const data = result.rows[0] as TblBundling
        dispatch(setProductQuery(db, data.id, 'BUNDLE'))
        return
      }

      const payload: { page?: number; outlet_id: number; q?: string } = {
        outlet_id: outlet_id
      }

      if (value) {
        payload.q = value
      } else {
        payload.page = 0
      }

      const consignmentStock = await ConsignmentService.consignmentStock(payload)
      console.log('cek data consignmentStock', JSON.stringify(consignmentStock))
      if (
        (consignmentStock as unknown as ConsignmentResponse).success &&
        (consignmentStock as unknown as ConsignmentResponse).data &&
        (consignmentStock as unknown as ConsignmentResponse).data.length > 0
      ) {
        const consignmentData = (consignmentStock as unknown as ConsignmentResponse).data[0]

        const productListData = [
          {
            typeProduct: 'Consignment',
            productListCode: consignmentData.product.product_code,
            productListName: consignmentData.product.product_name,
            qty: '1',
            price: consignmentData.price,
            totalPrice: consignmentData.price,
            detailProduct: { ...consignmentData, disc1: 0, disc2: 0, disc3: 0, discount: 0 }
          }
        ]
        // console.log('cek data 12', productListData)
        dispatch(
          setProductList({
            data: productListData as unknown as ProductList | ProductList[],
            canAdd: true
          })
        )
        return
      }
      dispatch(setErrorMessage('Barcode Not found'))
    } catch (error) {
      dispatch(setErrorMessage('Error fetching product'))
    }
  }

export const {
  setErrorMessage,
  clearErrorMessage,
  setClearProductList,
  setProductList,
  deleteItem,
  updateItem,
  setChooseCategory,
  updateListCategoryInDetailProduct,
  setChooseCategoryVisible,
  setItemDetailVisible,
  setTranscationHistory,
  setPaymentType,
  setPaymentShortcut
} = cashierSlice.actions
export const cashierReducers = cashierSlice.reducer

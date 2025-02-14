import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../index'
import { PGlite, PGliteInterface } from '@electric-sql/pglite'
import { Products } from '@renderer/presentation/entity/product.entity'
import { Services } from '@renderer/presentation/entity/service.entity'
import { Consignment } from '@renderer/presentation/entity/consignment.entity'
import { TblBundling } from '@renderer/domain/bundling/entity/bundling.entity'
import { TblStockBookmark } from '@renderer/domain/stock/entity/stock-bookmark.entity'
import { TblStockBookmarkGroup } from '@renderer/domain/stock/entity/stock-bookmark-group.entity'
import localStorage from '@renderer/presentation/ui/helper/localStorage'
import { setErrorMessage, setPaymentShortcut, setPaymentType } from './cashierSlice'
import pettyCashNetwork, {
  EmployeeFingerprintData,
  PettyCashData
} from '@renderer/infra/api/pettyCash'
import { TblPaymentShortcut } from '@renderer/domain/payment-shortcut/entity/payment-shortcut.entity'
import {
  GrabMartInvoice,
  GrabMartInvoiceData
} from '@renderer/presentation/entity/grabMartInvoice.entity'
import { GrabMartService } from '@renderer/infra/api/grabMart/grabMartInvoice.service'

export interface ConsignmentPagination {
  page: number
  pageSize: number
  total: number
}

export interface ShortcutState {
  isModalPaymentVisible: boolean
  isModalMemberVisible: boolean
  isModalProductVisible: boolean
  isModalServiceVisible: boolean
  isModalConsignmentVisible: boolean
  isModalBundlingVisible: boolean
  isModalBookmarkGroupVisible: boolean
  isModalBookmarkVisible: boolean
  isModalPettyCashVisible: boolean
  isModalVoucherVisible: boolean
  isModalVoidVisible: boolean
  isModalEDCVisible: boolean
  isModalGrabMartVisible: boolean
  products: Products[]
  services: Services[]
  consignment: Consignment[]
  bundling: TblBundling[]
  bookmarkGroup: TblStockBookmarkGroup[]
  bookmark: TblStockBookmark[]
  consignmentPagination: ConsignmentPagination
  grabMartOrder: GrabMartInvoiceData
}

const initialState: ShortcutState = {
  isModalPaymentVisible: false,
  isModalMemberVisible: false,
  isModalProductVisible: false,
  isModalServiceVisible: false,
  isModalConsignmentVisible: false,
  isModalBundlingVisible: false,
  isModalBookmarkGroupVisible: false,
  isModalBookmarkVisible: false,
  isModalPettyCashVisible: false,
  isModalVoucherVisible: false,
  isModalVoidVisible: false,
  isModalEDCVisible: false,
  isModalGrabMartVisible: false,
  products: [],
  services: [],
  consignment: [],
  consignmentPagination: { page: 1, pageSize: 10, total: 0 },
  bundling: [],
  bookmarkGroup: [],
  bookmark: [],
  grabMartOrder: localStorage.getGrabmartOrder() || {}
}

const fetchPettyCash = createAsyncThunk('pettyCash/fetch', async (storeId: string) => {
  const response = await pettyCashNetwork.getPettyCash(storeId)
  return response.json()
})

const registerEmployeeFingerprint = createAsyncThunk(
  'pettyCash/register',
  async (params: EmployeeFingerprintData) => {
    const response = await pettyCashNetwork.registerEmployeeFingerprint(params)
    return response.json()
  }
)

export const submitPettyCash = createAsyncThunk(
  'pettyCash/submit',
  async (params: PettyCashData, { rejectWithValue }) => {
    try {
      const response = await pettyCashNetwork.submitPettyCash(params)
      if (response.success) {
        return response
      } else {
        return rejectWithValue('Failed to submit petty cash')
      }
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

const shortcutSlice = createSlice({
  name: 'shortcut',
  initialState,
  reducers: {
    setPaymentVisible(state, action: PayloadAction<boolean>) {
      state.isModalPaymentVisible = action.payload
    },
    setMemberVisible(state, action: PayloadAction<boolean>) {
      state.isModalMemberVisible = action.payload
    },
    setProductsVisible(state, action: PayloadAction<boolean>) {
      state.isModalProductVisible = action.payload

      if (!action.payload) {
        state.products = []
      }
    },
    setServiceVisible(state, action: PayloadAction<boolean>) {
      state.isModalServiceVisible = action.payload
      if (!action.payload) {
        state.services = []
      }
    },
    setConsignmentVisible(state, action: PayloadAction<boolean>) {
      state.isModalConsignmentVisible = action.payload

      if (!action.payload) {
        state.consignment = []
        state.consignmentPagination = { page: 1, pageSize: 10, total: 0 }
      }
    },
    setBundlingVisible(state, action: PayloadAction<boolean>) {
      state.isModalBundlingVisible = action.payload
    },
    setBookmarkGroupVisible(state, action: PayloadAction<boolean>) {
      state.isModalBookmarkGroupVisible = action.payload
    },
    setBookmarkVisible(state, action: PayloadAction<boolean>) {
      state.isModalBookmarkVisible = action.payload
    },
    setPettyCashVisible(state, action: PayloadAction<boolean>) {
      state.isModalPettyCashVisible = action.payload
      // }
    },
    setVoidVisible(state, action: PayloadAction<boolean>) {
      state.isModalVoidVisible = action.payload
    },
    setEDCVisible(state, action: PayloadAction<boolean>) {
      state.isModalEDCVisible = action.payload
    },
    setVoucherVisible(state, action: PayloadAction<boolean>) {
      state.isModalVoucherVisible = action.payload
    },
    setGrabMartVisible(state, action: PayloadAction<boolean>) {
      state.isModalGrabMartVisible = action.payload
    },
    setProducts(state, action: PayloadAction<Products[]>) {
      state.products = action.payload
    },
    setServices(state, action: PayloadAction<Services[]>) {
      state.services = action.payload
    },
    setConsignment(
      state,
      action: PayloadAction<{ consignment: Consignment[]; pagination: ConsignmentPagination }>
    ) {
      state.consignment = action.payload.consignment
      state.consignmentPagination = action.payload.pagination
    },
    setBundling(state, action: PayloadAction<TblBundling[]>) {
      state.bundling = action.payload
    },
    setBookmarkGroup(state, action: PayloadAction<TblStockBookmarkGroup[]>) {
      state.bookmarkGroup = action.payload
    },
    setBookmark(state, action: PayloadAction<TblStockBookmark[]>) {
      state.bookmark = action.payload
    },
    setGrabMartInvoice(state, action: PayloadAction<GrabMartInvoiceData>) {
      state.grabMartOrder = action.payload
    }
  }
})

export const openModalWithPettyCash =
  (
    storeId: string,
    applicationSource: string,
    endpoint: string,
    transType: string,
    validationType: string
  ) =>
  (dispatch) => {
    dispatch(setPettyCashVisible(true))
    dispatch(fetchPettyCash(storeId))
    dispatch(
      registerEmployeeFingerprint({
        fingerprint: 'some-fingerprint-value',
        employeeId: 123,
        applicationSource,
        endpoint,
        transType,
        validationType
      })
    )
  }

export const getProductsAll =
  (db: PGlite, storeId: number): AppThunk =>
  async (dispatch) => {
    try {
      const query = `
        SELECT 
          s.*,
          ss.qty AS qty 
        FROM 
          tbl_stock s
        LEFT JOIN 
          tbl_saldo_stock ss ON s."productCode" = ss."productCode" 
        WHERE 
          (ss."storeId" = '${storeId}' OR ss."storeId" IS NULL)
      `
      const result = await db.query(query)

      const products = (result.rows as Products[]).map((row) => ({
        ...row,
        productImage: JSON.parse((row.productImage || '[]').toString())
      }))

      dispatch(setProducts(products))
    } catch (error) {
      console.error('Error fetching predefined products:', error)
      dispatch(setErrorMessage('Failed to fetch products'))
    }
  }

export const getServices =
  (db: PGlite): AppThunk =>
  async (dispatch) => {
    try {
      const query = `SELECT * FROM tbl_service WHERE active = '1'`
      const result = await db.query(query)

      const servicesData = (result.rows as Services[]).map((row) => ({
        ...row
      }))

      dispatch(setServices(servicesData))
    } catch (error) {
      console.error('Error fetching predefined services:', error)
      dispatch(setErrorMessage('Failed to fetch services'))
    }
  }

export const getBundling =
  (db: PGlite, storeId: number, alwaysOn: boolean): AppThunk =>
  async (dispatch) => {
    try {
      const today = new Date()
      const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay()
      const currentDate = today.toISOString().split('T')[0]
      const currentTime = today.toTimeString().split(' ')[0]

      let query = `
        SELECT 
          "id", "type", "code", "name", "barcode01", "alwaysOn", "minimumPayment", 
          "paymentOption", "paymentBankId", "buildComponent", "haveTargetPrice", 
          "targetRetailPrice", "targetCostPrice", "startDate", "endDate", 
          "startHour", "endHour", "availableDate", "availableStore", 
          "applyMultiple", "status", "productImage", "weight", "bundlingCategoryId", 
          "activeShop", "grabCategoryId", "categoryId", "subcategoryId", 
          "grabCategoryName", "description", "isPosHighlight", "createdBy", 
          "createdAt", "updatedBy", "updatedAt"
        FROM "tbl_bundling"
        WHERE "status" = '1'
          AND (
            "availableStore" ILIKE $1
            OR "availableStore" ILIKE $2
            OR "availableStore" ILIKE $3
            OR "availableStore" ILIKE $4
            OR "availableStore" IS NULL
          )
          AND (
            "availableDate" ILIKE $5
            OR "availableDate" ILIKE $6
            OR "availableDate" ILIKE $7
            OR "availableDate" ILIKE $8
            OR "availableDate" IS NULL
          )
          AND "endDate" >= $9
          AND "startDate" <= $9
          AND "endHour" >= $10
          AND "startHour" <= $10
          AND "type" = '1'
      `

      const values: (string | number | Date | boolean)[] = [
        `${storeId}`,
        `%${storeId},%`,
        `%,${storeId}`,
        `${storeId},%`,
        `${dayOfWeek}`,
        `%${dayOfWeek},%`,
        `%,${dayOfWeek}`,
        `${dayOfWeek},%`,
        currentDate,
        currentTime
      ]

      if (alwaysOn) {
        query += ` AND "alwaysOn" = $11`
        values.push(true)
      }

      query += ` ORDER BY "id" DESC;`

      const result = await db.query(query, values)

      const bundlingData = (result.rows as TblBundling[]).map((row) => ({
        ...row
      }))

      dispatch(setBundling(bundlingData))
    } catch (error) {
      console.error('Error fetching bundling data:', error)
      dispatch(setErrorMessage('Failed to fetch bundling'))
    }
  }

export const getBookmarkGroup =
  (db: PGlite): AppThunk =>
  async (dispatch) => {
    try {
      const query = `SELECT * FROM tbl_stock_bookmark_group`
      const result = await db.query(query)

      const bookmarkGroupData = (result.rows as TblStockBookmarkGroup[]).map((row) => ({
        ...row
      }))

      dispatch(setBookmarkGroup(bookmarkGroupData))
    } catch (error) {
      console.error('Error fetching predefined bookmark group:', error)
      dispatch(setErrorMessage('Failed to fetch bookmark'))
    }
  }

export const getBookmark =
  (db: PGlite, id?: number): AppThunk =>
  async (dispatch) => {
    try {
      // Ambil data bookmark
      const query = `SELECT * FROM tbl_stock_bookmark WHERE "groupId" = '${id}'`
      const result = await db.query(query)

      const bookmarkData = (result.rows as TblStockBookmark[]).map((row) => ({
        ...row
      }))

      // Pisahkan berdasarkan type
      const productIds = bookmarkData
        .filter((item) => item.type === 'PRODUCT')
        .map((item) => item.productId)
      const bundleIds = bookmarkData
        .filter((item) => item.type === 'BUNDLE')
        .map((item) => item.productId)

      // console.log('cek productIds ', bookmarkData)
      // Query untuk type PRODUCT
      let productData: Products[] = []
      if (productIds.length > 0) {
        const productQuery = `SELECT * FROM tbl_stock WHERE "id" IN (${productIds.join(',')})`
        const productResult = await db.query(productQuery)
        productData = productResult.rows as Products[]
      }

      // Query untuk type BUNDLE
      let bundleData: TblBundling[] = []
      if (bundleIds.length > 0) {
        const bundleQuery = `SELECT * FROM tbl_bundling WHERE "id" IN (${bundleIds.join(',')})`
        const bundleResult = await db.query(bundleQuery)
        bundleData = bundleResult.rows as TblBundling[]
      }

      // Gabungkan hasil
      const processedData = [
        ...bookmarkData
          .filter((item) => item.type === 'PRODUCT')
          .map((item) => ({
            ...item,
            details: productData.find((p) => p.id === item.productId) || null
          })),
        ...bookmarkData
          .filter((item) => item.type === 'BUNDLE')
          .map((item) => ({
            ...item,
            details: bundleData.find((b) => b.id === item.productId) || null
          }))
      ]

      // console.log('Processed Bookmark Data:', processedData)
      dispatch(setBookmark(processedData as unknown as TblStockBookmark[]))
      dispatch(setBookmarkVisible(true))
    } catch (error) {
      console.error('Error processing bookmark data:', error)
      dispatch(setErrorMessage('Failed to process bookmark data'))
    }
  }

export const getPaymentShortcut =
  (db: PGliteInterface, paymentType: number): AppThunk =>
  async (dispatch) => {
    try {
      const query = `SELECT * FROM tbl_payment_shortcut WHERE id = ${paymentType}`

      const result = await db.query(query)

      const data = (result.rows as TblPaymentShortcut[])[0]
      localStorage.setPaymentShortcut(data)
      dispatch(setPaymentShortcut(data))
      dispatch(setPaymentType(paymentType))
    } catch (error) {
      console.error('Error fetching predefined payment shortcut:', error)
      dispatch(setErrorMessage('Failed to fetch payment shortcut'))
    }
  }

export const handlePostGrabMartInvoice =
  (shortOrderNumber: string, storeId: number): AppThunk =>
  async (dispatch) => {
    try {
      const reqGrabMart = {
        shortOrderNumber: shortOrderNumber,
        storeId: storeId
      }
      const grabMartInvoice = await GrabMartService.grabMartInvoice(reqGrabMart)
      if ((grabMartInvoice as unknown as GrabMartInvoice).success) {
        dispatch(setGrabMartInvoice((grabMartInvoice as unknown as GrabMartInvoice).data))
        dispatch(setGrabMartVisible(false))
      } else {
        throw new Error(`Failed set grabmart order: ${(grabMartInvoice as Error)?.message}`)
      }
    } catch (error) {
      dispatch(setErrorMessage((error as Error)?.message ?? 'Failed set grabmart order'))
    }
  }

export const {
  setPaymentVisible,
  setMemberVisible,
  setProductsVisible,
  setServiceVisible,
  setConsignmentVisible,
  setBundlingVisible,
  setBookmarkGroupVisible,
  setBookmarkVisible,
  setPettyCashVisible,
  setVoidVisible,
  setEDCVisible,
  setVoucherVisible,
  setGrabMartVisible,
  setProducts,
  setServices,
  setConsignment,
  setBundling,
  setBookmarkGroup,
  setBookmark,
  setGrabMartInvoice
} = shortcutSlice.actions
export const shortcutReducers = shortcutSlice.reducer

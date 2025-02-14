/* eslint-disable @typescript-eslint/no-unused-vars */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../index'
import { PGlite, PGliteInterface } from '@electric-sql/pglite'
import localStorage from '@renderer/presentation/ui/helper/localStorage'
import { TblPaymentShortcut } from '@renderer/domain/payment-shortcut/entity/payment-shortcut.entity'
import { getConnection, getRemoteConnection } from '@renderer/lib/pouchdb/pouchdb-connection'
import { saveToPouchDB, syncWithCouchDB } from '@renderer/lib/pouchdb/pouchdb-impl'
import moment from 'moment'

interface ListOpt {
  id: number
  name: string
  parentId: number | null
  accountId: number | null
  paymentParentId: number | null
  paymentParentCode: string | null
  paymentParentName: string | null
  sort: number
  typeCode: string
  typeName: string
  description: string
  status: string
  cashBackNominal: number
  cashBackPercent: number
  discNominal: number
  discPercent: number
  createdBy: string
  createdAt: string
  updatedBy: string | null
  updatedAt: string
  accountCode: {
    id: number
    accountCode: string
    accountName: string
    accountParentId: number
  }
}
interface PaymentCost {
  id: number
  machineId: number
  bankId: number
  chargePercent: string
  chargeNominal: string
  active: boolean
  machine: {
    id: number
    name: string
    paymentOption: string
  }
  bank: {
    id: number
    code: string
    name: string
    chargeFee: string
    chargeFeePercent: string
    status: string
  }
}

interface PaymentEdc {
  id: number
  amount: number
}

interface ListOpts {
  id: number
  name: string
}

export interface PaymentState {
  availablePaymentType: string
  errorMessage: string
  payShortcut: TblPaymentShortcut[]
  paymentCosts: PaymentCost[]
  paymentEdc: PaymentEdc[]
  listOpts: ListOpts[]
}

interface Row {
  machineId: number
}

interface PaymentCostRow {
  id: number
  machineId: number
  bankId: number
  chargePercent: number
  chargeNominal: number
  active: boolean
  machine: {
    id: number
    name: string
    paymentOption: string
  }
  bank: {
    id: number
    code: string
    name: string
    chargeFee: number
    chargeFeePercent: number
    status: string
  }
  machineName: string
  machinePaymentOption: string
  bankName: string
  bankCode: string
  bankChargeFee: number
  bankChargeFeePercent: number
  bankStatus: string
}

interface PaymentOptionRow {
  id: number
  parentId: number
  accountId: number
  paymentParentId: number
  paymentParentCode: string
  paymentParentName: string
  sort: number
  typeCode: string
  typeName: string
  description: string
  status: string
  cashBackNominal: number
  cashBackPercent: number
  discNominal: number
  discPercent: number
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

interface PaymentEdcRow {
  id: number
  amount: number
}

const initialState: PaymentState = {
  availablePaymentType: '',
  errorMessage: '',
  payShortcut: localStorage.getPayShortcut() || [],
  paymentCosts: localStorage.getPaymentCost() || [],
  paymentEdc: localStorage.getPaymentEdc() || [],
  listOpts: []
}

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentType(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload
    },
    setPayShortcut(state, action: PayloadAction<TblPaymentShortcut[]>) {
      state.payShortcut = action.payload
    },
    setPaymentCosts(state, action: PayloadAction<PaymentCost[]>) {
      state.paymentCosts = action.payload
    },
    setPaymentEdc(state, action: PayloadAction<PaymentEdcRow[]>) {
      state.paymentEdc = action.payload
    },
    setListOpts(state, action: PayloadAction<ListOpt[]>) {
      state.listOpts = action.payload
    },
    setErrorMessage(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload
    },
    clearErrorMessage(state) {
      state.errorMessage = ''
    }
  }
})

export const fetchPaymentShortcut =
  (db: PGliteInterface): AppThunk =>
  async (dispatch) => {
    try {
      const query = `
        SELECT 
          "id", 
          "shortcutName", 
          "groupName", 
          "sort", 
          "dineInTax", 
          "memberId", 
          "sellPrice", 
          "typeCode", 
          "paymentOptionId", 
          "machine", 
          "bank", 
          "cardNameRequired", 
          "cardNoRequired", 
          "consignmentPaymentType" 
        FROM "tbl_payment_shortcut"
        WHERE "deletedAt" IS NULL;
      `

      const result = await db.query(query)
      const data = result.rows as TblPaymentShortcut[]

      localStorage.setPayShortcut(data)
      dispatch(setPayShortcut(data))
    } catch (error) {
      console.error('Error fetching payment shortcuts:', error)
      dispatch(setErrorMessage('Failed to fetch payment shortcuts'))
    }
  }

export const getAvailablePaymentType =
  (db: PGliteInterface): AppThunk =>
  async (dispatch) => {
    try {
      const query = `SELECT * FROM tbl_parameter WHERE "paramCode" = 'availablePOSPaymentType'`
      const result = await db.query(query)

      const data = result.rows[0] as {
        paramValue: string
      }
      if (data) {
        localStorage.setAvailablePaymentType(data.paramValue)
        dispatch(setPaymentType(data.paramValue))
      } else {
        dispatch(setErrorMessage('Failed to fetch bookmark'))
      }
    } catch (error) {
      console.error('Error fetching predefined parameter:', error)
      dispatch(setErrorMessage('Failed to fetch bookmark'))
    }
  }

// Async function to fetch payment costs dynamically
export const fetchPaymentCosts =
  (db: PGliteInterface, storeId: number): AppThunk =>
  async (dispatch) => {
    try {
      // Step 1: Fetch machineId list from tbl_payment_machine_store where storeId = 30
      const machineQuery = `
        SELECT "machineId"
        FROM "tbl_payment_machine_store"
        WHERE "deletedAt" IS NULL
          AND "storeId" = ${storeId}
      `

      const machineResult = await db.query(machineQuery)

      if (!machineResult.rows.length) {
        dispatch(setErrorMessage(`No machines found for storeId ${storeId}`))
        return
      }

      // Extract machineId values into an array for use in the next query
      const machineIds = (machineResult.rows as Row[]).map((row) => row.machineId)

      // Step 2: Fetch payment costs using the retrieved machineIds
      const paymentCostQuery = `
        SELECT 
          "tbl_payment_cost"."id", 
          "tbl_payment_cost"."machineId", 
          "tbl_payment_cost"."bankId", 
          "tbl_payment_cost"."chargePercent", 
          "tbl_payment_cost"."chargeNominal", 
          "tbl_payment_cost"."active", 
          "machine"."id" AS "machineId", 
          "machine"."name" AS "machineName", 
          "machine"."paymentOption" AS "machinePaymentOption", 
          "bank"."id" AS "bankId", 
          "bank"."bankCode" AS "bankCode", 
          "bank"."bankName" AS "bankName", 
          "bank"."chargeFee" AS "bankChargeFee", 
          "bank"."chargeFeePercent" AS "bankChargeFeePercent", 
          "bank"."status" AS "bankStatus"
        FROM 
          "tbl_payment_cost" AS "tbl_payment_cost"
        INNER JOIN 
          "tbl_payment_machine" AS "machine" 
          ON "tbl_payment_cost"."machineId" = "machine"."id"
        INNER JOIN 
          "tbl_bank" AS "bank" 
          ON "tbl_payment_cost"."bankId" = "bank"."id"
        WHERE 
          "tbl_payment_cost"."deletedAt" IS NULL 
          AND "tbl_payment_cost"."machineId" IN (${machineIds.map((id) => `'${id}'`).join(', ')})
          AND "tbl_payment_cost"."active" = 1
      `

      const paymentCostResult = await db.query(paymentCostQuery)

      if (!paymentCostResult.rows.length) {
        dispatch(setErrorMessage('No payment costs found for the retrieved machines'))
        return
      }

      // Step 3: Transform the result into the required format
      const formattedPaymentCosts = (paymentCostResult.rows as PaymentCostRow[]).map((row) => ({
        id: row.id,
        machineId: row.machineId,
        bankId: row.bankId,
        chargePercent: parseFloat(row.chargePercent.toString()).toFixed(2), // Ensure 2 decimal places
        chargeNominal: parseFloat(row.chargeNominal.toString()).toFixed(2), // Ensure 2 decimal places
        active: Boolean(row.active), // Convert 1/0 to boolean
        machine: {
          id: row.machineId,
          name: row.machineName,
          paymentOption: row.machinePaymentOption
        },
        bank: {
          id: row.bankId,
          code: row.bankCode,
          name: row.bankName,
          chargeFee: parseFloat(row.bankChargeFee.toString()).toFixed(6), // Ensure 6 decimal places
          chargeFeePercent: parseFloat(row.bankChargeFeePercent.toString()).toFixed(6),
          status: row.bankStatus.toString()
        }
      }))

      // Step 4: Store results in state and localStorage
      // console.log('Formatted Payment Costs:', JSON.stringify(formattedPaymentCosts, null, 2))
      localStorage.setPaymentCost(formattedPaymentCosts)
      dispatch(setPaymentCosts(formattedPaymentCosts))
    } catch (error) {
      console.error('Error fetching payment costs:', error)
      dispatch(setErrorMessage('Failed to fetch payment costs'))
    }
  }

export const fetchPaymentMachine =
  (db: PGliteInterface, storeId: number): AppThunk =>
  async (dispatch) => {
    try {
      const query = `SELECT 
          "tbl_payment_machine"."id", 
          "tbl_payment_machine"."name", 
          "tbl_payment_machine"."paymentOption", 
          "tbl_payment_machine"."accountId", 
          "tbl_payment_machine"."storeHide", 
          "tbl_payment_machine"."qrisImage"
      FROM 
          "tbl_payment_machine" AS "tbl_payment_machine"
      INNER JOIN 
          "tbl_payment_machine_store" AS "machineStore" 
          ON "tbl_payment_machine"."id" = "machineStore"."machineId"
          AND "machineStore"."deletedAt" IS NULL 
          AND "machineStore"."storeId" = ${storeId}
      WHERE 
          "tbl_payment_machine"."deletedAt" IS NULL;
      `
      const result = await db.query(query)

      // console.log('cek result ', result.rows)
      localStorage.setPaymentEdc(result.rows)
      dispatch(setPaymentEdc(result.rows as PaymentEdcRow[]))
    } catch (error) {
      console.error('Error fetching predefined parameter:', error)
      dispatch(setErrorMessage('Failed to fetch bookmark'))
    }
  }

export const fetchPaymentOptions =
  (db: PGlite): AppThunk =>
  async (dispatch) => {
    try {
      const query = `
        SELECT 
          p."id", 
          p."parentId", 
          p."accountId", 
          p."paymentParentId", 
          p."paymentParentCode", 
          p."paymentParentName", 
          p."sort", 
          p."typeCode", 
          p."typeName", 
          p."description", 
          p."status", 
          p."cashBackNominal", 
          p."cashBackPercent", 
          p."discNominal", 
          p."discPercent", 
          p."createdBy", 
          p."createdAt", 
          p."updatedBy", 
          p."updatedAt",
          a."id" AS "accountCode.id", 
          a."accountCode" AS "accountCode.accountCode", 
          a."accountName" AS "accountCode.accountName", 
          a."accountParentId" AS "accountCode.accountParentId"
        FROM "vw_payment_option_001" p
        LEFT JOIN "tbl_account_code" a ON p."accountId" = a."id"
        WHERE p."status" = '1'
        ORDER BY p."sort";
      `

      const result = await db.query(query)

      if (!result.rows || result.rows.length === 0) {
        throw new Error('No payment options found')
      }

      const formattedData = (result.rows as PaymentOptionRow[]).map((row) => ({
        id: row.id,
        name: row.typeName,
        parentId: row.parentId ?? null,
        accountId: row.accountId ?? null,
        paymentParentId: row.paymentParentId ?? null,
        paymentParentCode: row.paymentParentCode ?? null,
        paymentParentName: row.paymentParentName ?? null,
        sort: row.sort,
        typeCode: row.typeCode,
        typeName: row.typeName,
        description: row.description,
        status: row.status,
        cashBackNominal: row.cashBackNominal,
        cashBackPercent: row.cashBackPercent,
        discNominal: row.discNominal,
        discPercent: row.discPercent,
        createdBy: row.createdBy ?? null,
        createdAt: row.createdAt ? moment.utc(row.createdAt).format() : null,
        updatedBy: row.updatedBy ?? null,
        updatedAt: row.updatedAt ? moment.utc(row.createdAt).format() : null,
        accountCode: row.accountId
          ? {
              id: row['accountCode.id'],
              accountCode: row['accountCode.accountCode'],
              accountName: row['accountCode.accountName'],
              accountParentId: row['accountCode.accountParentId']
            }
          : {
              id: 0,
              accountCode: '',
              accountName: '',
              accountParentId: 0
            }
      }))

      dispatch(setListOpts(formattedData))
    } catch (error) {
      console.error('Error fetching payment options:', error)
      dispatch(setErrorMessage('Failed to fetch payment options'))
    }
  }

export const createTransaction =
  (payload): AppThunk =>
  async (dispatch) => {
    console.log(payload, '**paymentSlice.createTransaction.payload')

    // window.electron.ipcRenderer.send('ping')
    // todo: fix this, can't save to pouchdb
    const localdb = getConnection('transactions')
    const remoteDB = getRemoteConnection('transactions')
    await saveToPouchDB(localdb, payload)

    try {
      syncWithCouchDB(localdb, remoteDB)
      console.log('Success syncing with CouchDB:', payload)
    } catch (error) {
      console.error('Error syncing with CouchDB:', error)
      // throw error
    }
  }

export const getTransactionHistories = (): AppThunk => async (dispatch) => {
  // get connection pouchdb
  // get ke pouchdb
  // await transactionStorage.getTransaction(examplePayload);
}

export const manualSyncTransaction =
  (db: PGlite): AppThunk =>
  async (dispatch) => {
    // const db = pouchTransactionDb()
    // try {
    //   syncWithCouchDB(db)
    // } catch (error) {
    //   console.error('Error syncing with CouchDB:', error)
    //   throw error
    // }
  }

export const {
  setPaymentType,
  setPayShortcut,
  setPaymentCosts,
  setPaymentEdc,
  setListOpts,
  setErrorMessage,
  clearErrorMessage
} = paymentSlice.actions

export const paymentReducer = paymentSlice.reducer

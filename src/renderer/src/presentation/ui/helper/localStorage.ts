import { TblPaymentShortcut } from '@renderer/domain/payment-shortcut/entity/payment-shortcut.entity'
import { UserStore } from '@renderer/domain/store/entity/store.entity'
import { MembersTypes } from '@renderer/presentation/entity/membersTypes.entiy'
import { ProductList } from '@renderer/redux/store/slices/cashierSlice'
import moment from 'moment'

// member types
const setMemberTypes = (priceList: MembersTypes[]) => {
  return localStorage.setItem('memberTypes', JSON.stringify(priceList || '[]'))
}

const getMemberTypes = () => {
  const memberTypes = localStorage.getItem('memberTypes')
  return memberTypes ? JSON.parse(memberTypes) : []
}

const removeMemberTypes = () => {
  localStorage.removeItem('memberTypes')
}

// user store list
const setUserStoreList = async (priceList: UserStore[]) => {
  const response = await localStorage.setItem('userStoreList', JSON.stringify(priceList || '[]'))
  console.log('response', localStorage.getItem('userStoreList'))
  return response
}

const getUserStoreList = () => {
  const storedList = localStorage.getItem('userStoreList')
  return storedList ? JSON.parse(storedList) : []
}

const removeUserStoreList = () => {
  localStorage.removeItem('userStoreList')
}

// cashier trans
const setCashierTrans = (productList: ProductList[]) => {
  return localStorage.setItem('cashierTrans', JSON.stringify(productList || '[]'))
}

const getCashierTrans = () => {
  const storedValue = localStorage.getItem('cashierTrans')
  return storedValue ? JSON.parse(storedValue) : []
}

const removeCashierTrans = () => {
  localStorage.removeItem('cashierTrans')
}

// Payment Shortcut
const setPaymentShortcut = (paymentShortcutData: TblPaymentShortcut) => {
  return localStorage.setItem('payShortcutSelected', JSON.stringify(paymentShortcutData || '{}'))
}

const getPaymentShortcut = () => {
  const storedValue = localStorage.getItem('payShortcutSelected')
  return storedValue ? JSON.parse(storedValue) : {}
}

const removePaymentShortcut = () => {
  localStorage.removeItem('payShortcutSelected')
}

// Pay Shortcut
const setPayShortcut = (payShortcut: TblPaymentShortcut[]) => {
  return localStorage.setItem('payShortcut', JSON.stringify(payShortcut || '[]'))
}

const getPayShortcut = () => {
  const storedValue = localStorage.getItem('payShortcut')
  return storedValue ? JSON.parse(storedValue) : []
}

const removePayShortcut = () => {
  localStorage.removeItem('payShortcut')
}

// Available Payment type
const getAvailablePaymentType = () => {
  return localStorage.getItem('availablePaymentType')
    ? localStorage.getItem('availablePaymentType')
    : null
}

const setAvailablePaymentType = (data) => {
  return localStorage.setItem('availablePaymentType', data)
}

const removeAvailablePaymentType = () => {
  return localStorage.removeItem('availablePaymentType')
}

// Member data on Member shortcut
const getMember = () => {
  return localStorage.getItem('member')
    ? JSON.parse(localStorage.getItem('member') as string)
    : null
}

const setMember = (data) => {
  return localStorage.setItem('member', JSON.stringify([data]))
}

const removeMember = () => {
  return localStorage.removeItem('member')
}

// Payment Cost
const getPaymentCost = () => {
  const cachedData = localStorage.getItem('payment_cost')
  if (cachedData !== null) {
    const parsedData = JSON.parse(cachedData)
    if (parsedData) {
      const { data, ttl } = parsedData
      const ttlTimestamp = Number(ttl)
      const currentTimeStamp = moment().valueOf()
      if (ttlTimestamp > currentTimeStamp) {
        return data
      }
    }
  }
  return null
}

const setPaymentCost = (data) => {
  const ttl = moment().set({ hours: 23, minutes: 59, seconds: 59 }).valueOf()
  return localStorage.setItem('payment_cost', JSON.stringify({ data, ttl }))
}

const removePaymentCost = () => {
  return localStorage.removeItem('payment_cost')
}

// Payment Edc
const getPaymentEdc = () => {
  const cachedData = localStorage.getItem('payment_edc')
  if (cachedData === null) {
    return null
  }
  const parsedData = JSON.parse(cachedData)
  if (parsedData) {
    const { data, ttl } = parsedData
    const ttlTimestamp = Number(ttl)
    const currentTimeStamp = moment().valueOf()
    if (ttlTimestamp > currentTimeStamp) {
      return data
    }
  }
  return null
}

const setPaymentEdc = (data) => {
  const ttl = moment().set({ hours: 23, minutes: 59, seconds: 59 }).valueOf()
  return localStorage.setItem('payment_edc', JSON.stringify({ data, ttl }))
}

const removePaymentEdc = () => {
  return localStorage.removeItem('payment_edc')
}

// Grabmart Order
const getGrabmartOrder = () => {
  return localStorage.getItem('grabmartOrder')
    ? JSON.parse(localStorage.getItem('grabmartOrder') as string)
    : {}
}

const setGrabmartOrder = (grabOrder) => {
  return localStorage.setItem('grabmartOrder', JSON.stringify(grabOrder || '{}'))
}

const removeGrabmartOrder = () => {
  return localStorage.removeItem('grabmartOrder')
}

// Clear All Store
const clearAllLocalStorage = () => {
  localStorage.clear()
}

const getVoucherList = () => {
  const voucherList = localStorage.getItem('voucher_list')
  return voucherList ? JSON.parse(voucherList) : []
}

const setVoucherList = (data) => {
  return localStorage.setItem('voucher_list', data.data.header)
}

export default {
  setMemberTypes,
  setUserStoreList,
  setCashierTrans,
  setPaymentShortcut,
  setPayShortcut,
  setPaymentCost,
  setAvailablePaymentType,
  setPaymentEdc,
  setMember,
  getMemberTypes,
  getUserStoreList,
  getCashierTrans,
  getPaymentShortcut,
  getPayShortcut,
  getAvailablePaymentType,
  getPaymentCost,
  getPaymentEdc,
  getMember,
  getGrabmartOrder,
  removeMemberTypes,
  removeUserStoreList,
  removeCashierTrans,
  removePaymentCost,
  removeAvailablePaymentType,
  removePaymentShortcut,
  removePayShortcut,
  removePaymentEdc,
  removeMember,
  removeGrabmartOrder,
  clearAllLocalStorage,
  getVoucherList,
  setVoucherList,
  setGrabmartOrder
}

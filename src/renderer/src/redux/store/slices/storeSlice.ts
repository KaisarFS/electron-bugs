import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserStore } from '@renderer/domain/store/entity/store.entity'

export interface StoreState {
  userStore: UserStore // Profile tanpa token
  listStores: UserStore[] // Token dipisahkan
  errorMessage: string
}

const initialState: StoreState = {
  userStore: {
    value: 0,
    companyName: '',
    label: '',
    code: '',
    address01: '',
    address02: '',
    companyEmail: '',
    mobileNumber: '',
    consignmentId: 0,
    companyAddress01: '',
    companyAddress02: '',
    companyMobileNumber: '',
    companyPhoneNumber: '',
    taxID: '',
    taxConfirmDate: '',
    taxType: '',
    initial: ''
  },
  listStores: [],
  errorMessage: ''
}

const storeSlice = createSlice({
  name: 'storeSlice',
  initialState,
  reducers: {
    setUserStore(state, action: PayloadAction<UserStore>) {
      state.userStore = action.payload
    },
    setListStore(state, action: PayloadAction<UserStore[]>) {
      state.listStores = action.payload
    },
    setErrorMessage(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload
    }
  }
})

export const { setUserStore, setListStore, setErrorMessage } = storeSlice.actions
export const mainStoreReducer = storeSlice.reducer

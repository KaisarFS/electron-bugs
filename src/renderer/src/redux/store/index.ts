import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'

import { paymentReducer, PaymentState } from './slices/paymentSlice'
import { authReducer } from './slices/authSlice'
import { cashierReducers, CashierState } from './slices/cashierSlice'
import { shortcutReducers, ShortcutState } from './slices/shortcutSlice'
import { mainStoreReducer as storeReducer, StoreState } from './slices/storeSlice'
import { voucherReducer, VoucherState } from './slices/voucherSlice'

export interface RootState {
  payment: PaymentState
  authentication: ReturnType<typeof authReducer>
  cashier: CashierState
  shortcut: ShortcutState
  mainStoreReducer: StoreState
  voucher: VoucherState
}

const store = configureStore({
  reducer: {
    payment: paymentReducer,
    authentication: authReducer,
    cashier: cashierReducers,
    shortcut: shortcutReducers,
    mainStoreReducer: storeReducer,
    voucher: voucherReducer
  }
})

export type AppDispatch = typeof store.dispatch

export { store }

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

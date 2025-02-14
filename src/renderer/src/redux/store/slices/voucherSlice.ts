import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import voucherNetwork from '@renderer/infra/api/voucher'
import { APIError } from '@renderer/presentation/entity/errorAPI.entity'
import { VoucherInterface } from '@renderer/presentation/entity/voucher.entity'

export interface VoucherState {
  vouchers: VoucherInterface[]
  validationStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  validationError: string | null
}

const loadVouchersFromStorage = (): VoucherInterface[] => {
  const storedVouchers = localStorage.getItem('vouchers')
  return storedVouchers ? JSON.parse(storedVouchers) : []
}

const initialState: VoucherState = {
  vouchers: loadVouchersFromStorage(),
  validationStatus: 'idle',
  validationError: null
}

// ✅ Create an async thunk for validating vouchers
export const validateVoucher = createAsyncThunk(
  'voucher/validateVoucher',
  async (payload: { voucherCode }, { rejectWithValue }) => {
    try {
      const { voucherCode } = payload

      const response = await voucherNetwork.validateVoucher(voucherCode)

      if (response.success) {
        return {
          data: Array.isArray(response.data) ? response.data : [response.data],
          ttl: Date.now()
        }
      } else {
        return rejectWithValue('Validation failed')
      }
    } catch (error: APIError | unknown) {
      return rejectWithValue((error as APIError).response?.data?.message || 'Validation failed')
    }
  }
)

const voucherSlice = createSlice({
  name: 'voucher',
  initialState,
  reducers: {
    addVoucher: (state, action: PayloadAction<VoucherInterface>) => {
      state.vouchers.push(action.payload)
      localStorage.setItem('voucher_list', JSON.stringify(state.vouchers))
    },
    removeVoucher: (state, action: PayloadAction<string>) => {
      state.vouchers = state.vouchers.filter((v) => v.header.id !== action.payload)
      localStorage.setItem('voucher_list', JSON.stringify(state.vouchers))
    },
    clearVouchers: (state) => {
      state.vouchers = []
      localStorage.removeItem('voucher_list')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateVoucher.pending, (state) => {
        state.validationStatus = 'loading'
        state.validationError = null
      })
      .addCase(
        validateVoucher.fulfilled,
        (state, action: PayloadAction<{ data: VoucherInterface[]; ttl: number }>) => {
          state.validationStatus = 'succeeded'
          state.vouchers = [...state.vouchers, ...action.payload.data]
        }
      )
      .addCase(validateVoucher.rejected, (state, action) => {
        state.validationStatus = 'failed'
        state.validationError = action.payload as string
      })
  }
})

export const { addVoucher, removeVoucher, clearVouchers } = voucherSlice.actions
export const voucherReducer = voucherSlice.reducer

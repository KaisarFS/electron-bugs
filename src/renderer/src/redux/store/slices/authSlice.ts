import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import localStorage from '@renderer/presentation/ui/helper/localStorage'
import Cookies from 'js-cookie'

export interface UserData {
  token: string
  istotp: boolean
  permission: string
  userRole: string
  userStore: number
  userName: string
  userCompany: string
  userLoginTime: string
  userId: string
  sessionId: string
  userIp: string
  consignmentId: number
}

export interface MemberData {
  phoneNumber: string
}

export interface AuthState {
  isLogout: boolean
  userData: Omit<UserData, 'token'> // Profile tanpa token
  memberData: MemberData
  token: string // Token dipisahkan
  errorMessage: string
}

const initialState: AuthState = {
  isLogout: false,
  userData: {
    istotp: false,
    permission: '',
    userRole: '',
    userStore: 0,
    userName: '',
    userCompany: '',
    userLoginTime: '',
    userId: '',
    sessionId: '',
    userIp: '',
    consignmentId: 0
  },
  memberData: {
    phoneNumber: ''
  },
  token: '',
  errorMessage: ''
}

const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setLogout(state, action: PayloadAction<boolean>) {
      state.isLogout = action.payload
    },
    setUserData(state, action: PayloadAction<Partial<UserData>>) {
      const { token, ...profileData } = action.payload

      if (token) {
        state.token = token
        // Simpan token ke Cookies
        Cookies.set('pos_v2', token, {
          expires: 365,
          sameSite: 'strict',
          secure: true
        })
      }

      state.userData = {
        ...state.userData,
        ...profileData
      }

      // Simpan profile ke Cookies
      Cookies.set('pos_acc_v2', JSON.stringify(profileData), {
        expires: 365,
        sameSite: 'strict',
        secure: true
      })
    },
    setMemberData(state, action: PayloadAction<Partial<MemberData>>) {
      state.memberData = {
        ...state.memberData,
        ...action.payload
      }
      localStorage.setMember(state.memberData)
    },

    setErrorMessage(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload
    },
    clearErrorMessage(state) {
      state.errorMessage = ''
    },
    logout(state) {
      state.userData = initialState.userData
      state.memberData = initialState.memberData
      state.token = ''
      state.errorMessage = ''
      state.isLogout = false

      localStorage.clearAllLocalStorage()
    }
  }
})

export const { setLogout, setUserData, setMemberData, setErrorMessage, clearErrorMessage, logout } =
  authSlice.actions
export const authReducer = authSlice.reducer

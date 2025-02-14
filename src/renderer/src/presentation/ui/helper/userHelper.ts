import { UserStore } from '@renderer/domain/store/entity/store.entity'
import { UserService } from '@renderer/infra/api/user/user.service'
import { setMemberData, setUserData } from '@renderer/redux/store/slices/authSlice'
import { message } from 'antd'
import { useDispatch } from 'react-redux'
import localStorage from './localStorage'
import { AppDispatch } from '@renderer/redux/store'
import { clearErrorMessage, setErrorMessage } from '@renderer/redux/store/slices/cashierSlice'

const getUserStores = (userStore: string): UserStore | null => {
  const listStore: UserStore[] = localStorage.getUserStoreList()
  const selectedStore = listStore.find((filtered) => filtered.value == parseInt(userStore, 10))
  if (selectedStore) {
    return selectedStore
  }

  return null
}

const getStores = (): UserStore[] | null => {
  const listStore = localStorage.getUserStoreList()

  if (listStore) {
    return listStore
  }

  return null
}

const voidSubmit = async (values: { userId: string; password: string }) => {
  try {
    const { userId, password } = values
    const dispatch = useDispatch()
    console.log(userId, password)

    const reqLogin = {
      userid: userId,
      password: password,
      device: 'web'
    }

    const user = await UserService.userLogin(reqLogin)
    if (user.id_token) {
      dispatch(
        setUserData({
          token: user.id_token,
          userRole: user.profile.role,
          userStore: user.profile.store,
          userName: user.profile.username,
          userCompany: user.profile.usercompany,
          userLoginTime: user.profile.userlogintime,
          userId: user.profile.userid,
          sessionId: user.profile.sessionid,
          userIp: user.profile.useripaddr2,
          consignmentId: user.profile.consignmentId,
          permission: user.profile.permission
        })
      )
      dispatch(clearErrorMessage())
      message.success('Successful!')
    } else {
      dispatch(setErrorMessage(user.message))
      message.error(user.message)
    }
  } catch (error) {
    const dispatch = useDispatch()
    dispatch(
      setErrorMessage((error as Error).message ?? 'Failed to log in user. Please try again.')
    )
    message.error((error as Error).message ?? 'Failed to log in user. Please try again.')
  }
}

const getMember = async (dispatch: AppDispatch, query: string) => {
  try {
    const member = await UserService.searchMember(query)

    if ('data' in member) {
      if (Array.isArray(member.data)) {
        const findMemberUmum = member.data.find((member) => member.memberCode === 'UMUM')

        if (findMemberUmum) {
          dispatch(setMemberData(findMemberUmum))
          window.api.send('update-member', findMemberUmum)
        }
      } else {
        dispatch(setErrorMessage('Expected data to be an array.'))
        message.error('Expected data to be an array.')
      }
    } else {
      dispatch(setErrorMessage('Failed to fetch member data.'))
      message.error('Failed to fetch member data.')
    }
  } catch (error) {
    // Type assertion to ensure `error` is an instance of `Error`
    dispatch(setErrorMessage((error as Error).message ?? 'An unexpected error occurred.'))
    message.error((error as Error).message ?? 'An unexpected error occurred.')
  }
}

export { getUserStores, getStores, voidSubmit, getMember }

import { message } from 'antd'
import { UserService } from '@renderer/infra/api/user/user.service'
import {
  clearErrorMessage,
  setErrorMessage,
  setUserData
} from '@renderer/redux/store/slices/authSlice'
import { AppDispatch } from '@renderer/redux/store'

/**
 * Authenticates a user with given credentials.
 * @param values - The login credentials (userId, password, device).
 * @param allowedRoles - An array of roles that are authorized.
 * @param dispatch - Redux dispatch function.
 * @param onSuccess - Callback function when authentication is successful.
 * @param onError - Callback function when authentication fails.
 */

export const authenticateUser = async (
  values: { userId: string; password: string; device?: string },
  allowedRoles: string[],
  dispatch: AppDispatch,
  onSuccess?: () => void,
  onError?: (error: string) => void
) => {
  try {
    const { userId, password } = values

    const reqLogin = {
      userid: userId,
      password: password,
      device: values.device || 'web'
    }

    const user = await UserService.userLogin(reqLogin)

    if (user.id_token) {
      const userRole = user.profile.role
      console.log('userRole:', userRole)

      if (!allowedRoles.includes(userRole)) {
        const errorMessage = 'Access denied: Unauthorized role'
        message.error(errorMessage)
        dispatch(setErrorMessage(errorMessage))
        onError?.(errorMessage)
        return
      }

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

      onSuccess?.()
    } else {
      dispatch(setErrorMessage(user.message))
      message.error(user.message)
      onError?.(user.message)
    }
  } catch (error) {
    const errorMsg = (error as Error).message ?? 'Failed to log in user. Please try again.'
    dispatch(setErrorMessage(errorMsg))
    message.error(errorMsg)
    onError?.(errorMsg)
  }
}

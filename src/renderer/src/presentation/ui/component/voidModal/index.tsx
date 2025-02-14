import { message, Modal } from 'antd'
import React, { useState } from 'react'
import Void from '../shortcut/void'
import { UserService } from '@renderer/infra/api/user/user.service'
import { useDispatch } from 'react-redux'
import { setUserData } from '@renderer/redux/store/slices/authSlice'
import { clearErrorMessage, setErrorMessage } from '@renderer/redux/store/slices/cashierSlice'

type Props = {
  isModalOpen: boolean
  closeModal: () => void
  handleDeleteConfirmation: () => void
}

function VoidModal({ isModalOpen, closeModal, handleDeleteConfirmation }: Props) {
  const [isVoidModalVisible, setIsVoidModalVisible] = React.useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const showVoidModal = () => {
    closeModal()
    setIsVoidModalVisible(true)
  }

  const closeVoidModal = () => {
    setIsVoidModalVisible(false)
  }

  const handleVoidSubmit = async (values: { userId: string; password: string; device: string }) => {
    setLoading(true)
    try {
      const { userId, password } = values
      console.log(userId, password)

      const reqLogin = {
        userid: userId,
        password: password,
        device: 'web'
      }

      const user = await UserService.userLogin(reqLogin)

      if (user.id_token) {
        const userRole = user.profile.role
        console.log('userRole:', userRole)

        const allowedRoles = ['OWN', 'ITS', 'SPR', 'HFC', 'SFC', 'PCS', 'HPC', 'HKS', 'SPC']

        if (!allowedRoles.includes(userRole)) {
          message.error('Access denied: Unauthorized role')
          dispatch(setErrorMessage('Access denied: Unauthorized role'))
          return
        }
      }

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
        handleDeleteConfirmation()
      } else {
        dispatch(setErrorMessage(user.message))
        message.error(user.message)
      }
    } catch (error) {
      dispatch(
        setErrorMessage((error as Error).message ?? 'Failed to log in user. Please try again.')
      )
      message.error((error as Error).message ?? 'Failed to log in user. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Modal
        title="Delete Item"
        open={isModalOpen}
        onCancel={closeModal}
        onOk={showVoidModal}
        onClose={closeModal}
        okButtonProps={{
          style: {
            backgroundColor: '#106C6B',
            color: '#fff',
            padding: 20,
            width: 100,
            borderRadius: 10
          }
        }}
        cancelButtonProps={{
          style: {
            backgroundColor: '#D7EFEF',
            color: '#106C6B',
            padding: 20,
            width: 100,
            borderRadius: 10
          }
        }}
      >
        <div style={{ padding: 20 }}>
          <h3>Are you sure you want to delete this item?</h3>
        </div>
      </Modal>
      <Void
        isVisible={isVoidModalVisible}
        onCancel={closeVoidModal}
        onSubmit={handleVoidSubmit}
        // handleDeleteConfirmation={handleDeleteConfirmation}
        loading={loading}
      />
    </>
  )
}

export default VoidModal

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState } from 'react'
import { Form, Input, Button, Spin, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
// import { useNavigate } from 'react-router-dom'
import { UserService } from '@renderer/infra/api/user/user.service'
// import { usePGlite } from '@electric-sql/pglite-react'
import {
  clearErrorMessage,
  setErrorMessage,
  setUserData
} from '@renderer/redux/store/slices/authSlice'
import { useDispatch } from 'react-redux'
import logoK3 from '../../../../../../../resources/backdrop-login.png'
import backdropLogin from '../../../../../../../resources/backdrop-login.png'
import localStorage from '../../helper/localStorage'
import { StoreService } from '@renderer/infra/api/store/store.service'

const { Title } = Typography

export function LoginPage() {
  const [loading, setLoading] = useState(false)
  // const navigate = useNavigate()
  const dispatch = useDispatch()

  const onFinish = async (values) => {
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
        const memberTypes = await UserService.getMemberTypes(user.id_token)
        const userStore = await StoreService.listStoresId(user?.profile?.userid, user.id_token)
        if (userStore.success) {
          const storeData = Array.isArray(userStore.data)
            ? userStore.data.map((store) => ({
                value: store.storeId,
                companyName: store.storeName,
                label: store.storeCode,
                code: store.storeCode,
                address01: store.storeAddress,
                address02: '',
                companyEmail: store.storeEmail,
                mobileNumber: store.storePhone,
                consignmentId: 0,
                companyAddress01: '',
                companyAddress02: '',
                companyMobileNumber: '',
                companyPhoneNumber: '',
                taxID: '',
                taxConfirmDate: '',
                taxType: '',
                initial: ''
              }))
            : [
                {
                  value: userStore.data.storeId,
                  companyName: userStore.data.storeName,
                  label: userStore.data.storeCode,
                  code: userStore.data.storeCode,
                  address01: userStore.data.storeAddress,
                  address02: '',
                  companyEmail: userStore.data.storeEmail,
                  mobileNumber: userStore.data.storePhone,
                  consignmentId: 0,
                  companyAddress01: '',
                  companyAddress02: '',
                  companyMobileNumber: '',
                  companyPhoneNumber: '',
                  taxID: '',
                  taxConfirmDate: '',
                  taxType: '',
                  initial: ''
                }
              ]
          localStorage.setUserStoreList(storeData)
        }
        if (memberTypes.success) {
          localStorage.setMemberTypes(memberTypes.data)
        }
        dispatch(
          setUserData({
            token: user.id_token, // Menyimpan id_token
            userRole: user.profile.role,
            userStore: parseInt(user.profile.store),
            userName: user.profile.username,
            userCompany: user.profile.usercompany,
            userLoginTime: user.profile.userlogintime,
            userId: user.profile.userid,
            sessionId: user.profile.sessionid,
            userIp: user.profile.useripaddr2,
            consignmentId: parseInt(user.profile.consignmentId),
            permission: user.profile.permission
          })
        )
        dispatch(clearErrorMessage())
        message.success('Login successful!')
        window.location.href = '/kasir'
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

  // const fakeLogin = (userId: string, password: string) => {
  //   return new Promise<boolean>((resolve) => {
  //     setTimeout(() => {
  //       resolve(userId === 'admin' && password === 'password123')
  //     }, 1000)
  //   })
  // }

  return (
    <div
      style={{
        height: '100vh',
        padding: '30px',
        backgroundColor: '#E7FFFC',
        backgroundImage: `url(${backdropLogin})`,
        backgroundSize: 'cover',
        backgroundPositionY: '10vh',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div
        style={{
          maxWidth: 400,
          margin: 'auto',
          padding: '30px 60px',
          background: '#FFF ',
          borderRadius: 30,
          marginTop: '20vh',
          boxShadow: '6px 6px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <img
          src={logoK3}
          alt="logoK3"
          style={{
            maxWidth: '30%',
            maxHeight: '30%',
            alignSelf: 'center',
            margin: '-30px 100px'
          }}
        />
        <Title level={1} style={{ textAlign: 'center', marginBottom: -10, marginTop: '5vh' }}>
          Welcome!
        </Title>
        <p style={{ color: '#6D7C8A', textAlign: 'center', marginBottom: 43 }}>
          please login to continue
        </p>

        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ maxWidth: 300, color: '#000000' }}
          layout="vertical"
        >
          {/* Username Input */}
          <Form.Item
            name="userId"
            label={
              <span>
                UserId <span style={{ color: 'red' }}>*</span>
              </span>
            }
            required
            rules={[{ required: true, message: 'Please input your user id!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="User Id" disabled={loading} />
          </Form.Item>

          {/* Password Input */}
          <Form.Item
            name="password"
            label={
              <span>
                Password <span style={{ color: 'red' }}>*</span>
              </span>
            }
            required
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" disabled={loading} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              disabled={loading}
              style={{ background: '#187F7E', padding: '18px 0px' }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        {loading && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Spin size="large" />
          </div>
        )}
      </div>
    </div>
  )
}

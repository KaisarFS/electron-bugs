import React, { useState } from 'react'
import { Modal, Input, Select, Button, Form, Typography, message } from 'antd'
import { UserService } from '@renderer/infra/api/user/user.service'
import { setMemberData } from '@renderer/redux/store/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/redux/store'
import NewMember from '../memberModal/newMember'
import localStorage from '../../helper/localStorage'
import VirtualNumpad from './numpad'

const { Title } = Typography
const { Option } = Select

interface MemberModalProps {
  isVisible: boolean
  onCancel: () => void
  onSubmit: (values: { phone: string; gender: string }) => void
}

// interface ApiResponseWithData<T> {
//   success: boolean
//   message: string
//   data: T
// }

// interface ApiResponseWithoutData {
//   success: boolean
//   message: string
// }

// type ApiResponse<T> = ApiResponseWithData<T> | ApiResponseWithoutData

const Member: React.FC<MemberModalProps> = ({ isVisible, onCancel }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [isNewMemberVisible, setIsNewMemberVisible] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  // const [memberPhone, setMemberPhone] = useState(localStorage.getMember()[0].mobileNumber)
  const [, setInputValue] = useState<string>('')
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false)
  const [activeInput, setActiveInput] = useState<string>('')

  const memberData = useSelector((state: RootState) => state.authentication.memberData)
  const memberPhone = memberData.phoneNumber

  const showOnlyLastWord = (words: string, digitToShow: number) => {
    if (!words) return words

    return words
      .split('')
      .map((char, index) => (index >= words.length - digitToShow ? char : 'X'))
      .join('')
  }

  const registerNewMember = async (values: { phone: string; gender: string }) => {
    setLoading(true)

    const memberData = {
      memberCode: values.phone,
      gender: values.gender,
      memberGetDefault: false,
      memberGroupId: 2,
      memberTypeId: 2,
      memberName: showOnlyLastWord(values.phone, 4),
      mobileNumber: values.phone,
      phoneNumber: values.phone
    }

    try {
      const response = await UserService.createMember(memberData)

      if (response instanceof Error) {
        throw response
      }
      setLoading(false)
      dispatch(setMemberData({ phoneNumber: values.phone }))

      if (response.success) {
        localStorage.setMember(response.data)
        message.success(`Member with phone number ${values.phone} has been successfully created.`)
        handleMemberCashback(response.data.id)
        form.resetFields()
        onCancel()
      } else {
        throw new Error(response.message || 'Failed to create member.')
      }
    } catch (error: unknown) {
      setIsSuccess(false)
      setLoading(false)
      message.error(`Failed to get member cashback. Details: ${(error as Error).message || error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleMemberCashback = async (id: string) => {
    setLoading(true)
    try {
      const response = await UserService.memberCashback(id)
      if (response instanceof Error) {
        throw response
      }
      if (response.success) {
        const memberData = localStorage.getMember() || []
        if (memberData.length > 0) {
          memberData[0].cashback = response.data
          localStorage.setMember(memberData[0])
          window.api.send('update-member', memberData[0])
        }

        form.resetFields()
        onCancel()
      } else {
        setLoading(false)
        throw new Error(
          `Member Cashback Error: ${response.message || 'Failed to get member cashback.'}`
        )
      }
    } catch (error: unknown) {
      setIsSuccess(false)
      setLoading(false)
      message.error(`Failed to get member cashback. Details: ${(error as Error).message || error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = async (values: { phone: string; gender: string }) => {
    setLoading(true)
    try {
      const response = await UserService.searchMember(values.phone)
      // console.log(response, '<==== ini response handleFinish')
      if (response instanceof Error) {
        throw response
      }
      if (response.message === 'Ok' && response.data?.length > 0) {
        const memberData = response.data[0]
        // console.log(memberData, '<====== memberData handleFinish')
        dispatch(setMemberData(memberData))
        // localStorage.setMember(memberData)
        window.api.send('update-member', memberData)
        message.success(
          `Member ${memberData.memberName} with phone number ${values.phone} already exists.`
        )
        handleMemberCashback(memberData.id)
      } else {
        setIsNewMemberVisible(true)
      }
    } catch (error) {
      setIsSuccess(false)
      setLoading(false)
      message.error(`Failed to create member with phone number ${values.phone}.`)
    } finally {
      setLoading(false)
    }
  }

  const closeNewMemberModal = () => {
    setIsNewMemberVisible(false)
  }

  return (
    <>
      <Modal
        open={isVisible}
        footer={null}
        onCancel={onCancel}
        centered
        width={400}
        closeIcon={false}
      >
        <Title style={{ marginTop: 0 }} level={4}>
          Member
        </Title>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <div className="form-container">
            <Form.Item
              label="No. Telp"
              name="phone"
              rules={[{ required: true, message: 'Nomor telepon wajib diisi!' }]}
            >
              <Input
                prefix="+62"
                placeholder={memberPhone || 'Masukkan nomor telepon'}
                className="form-input"
                onFocus={() => {
                  setIsKeyboardVisible(true)
                  setActiveInput('phone')
                }}
                onChange={(event) => setInputValue(event.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: 'Gender wajib dipilih!' }]}
            >
              <Select placeholder="Pilih" className="form-select">
                <Option value="1">Pria</Option>
                <Option value="2">Wanita</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="button-container">
            <Button onClick={onCancel} className="cancel-button">
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
              className="submit-button"
              loading={loading}
            >
              Lanjutkan
            </Button>
          </div>
        </Form>
        {isKeyboardVisible && (
          <VirtualNumpad
            onChange={(value) => {
              form.setFieldsValue({ [activeInput]: value })
            }}
            onClose={() => setIsKeyboardVisible(false)}
            targetInput={activeInput}
          />
        )}
      </Modal>
      <NewMember
        isModalOpen={isNewMemberVisible}
        closeModal={closeNewMemberModal}
        isSuccess={isSuccess}
        registerNewMember={registerNewMember}
        phone={form.getFieldValue('phone')}
        gender={form.getFieldValue('gender')}
        loading={loading}
      />
    </>
  )
}

export default Member

import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, Form } from 'antd'
import fingetPrintIcon from '../../../../../../../resources/finger-print.png'
import VirtualKeyboard from './keyboard'

interface VoidProps {
  isVisible: boolean
  onCancel: () => void
  onSubmit: (values: { userId: string; password: string; device: string }) => void
  loading: boolean
}

const Void: React.FC<VoidProps> = ({
  isVisible,
  onCancel,
  onSubmit,
  // handleDeleteConfirmation,
  loading
}) => {
  const [form] = Form.useForm()
  const [inputValue, setInputValue] = useState<string>('')
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false)
  const [modalStyle, setModalStyle] = useState<{ marginTop: string }>({ marginTop: '0px' })
  const [activeInput, setActiveInput] = useState<string>('')

  const handleSubmit = (values: { userId: string; password: string; device: string }) => {
    onSubmit(values)
    form.resetFields()
  }

  useEffect(() => {
    setModalStyle({ marginTop: isKeyboardVisible ? '-300px' : '0px' })
  }, [isKeyboardVisible])

  return (
    <Modal
      open={isVisible}
      title={'Void'}
      footer={null}
      onCancel={onCancel}
      centered
      width={400}
      style={modalStyle}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="form-container">
          <Form.Item
            label="User Id"
            name="userId"
            hasFeedback
            rules={[{ required: true, message: 'User Id diperlukan!' }]}
          >
            <Input
              placeholder="Enter user id"
              value={inputValue}
              className="form-input"
              onFocus={() => {
                setIsKeyboardVisible(true)
                setActiveInput('userId')
              }}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            hasFeedback
            rules={[{ required: true, message: 'Password diperlukan!' }]}
          >
            <Input
              placeholder="Enter password"
              value={inputValue}
              type="password"
              className="form-input"
              onFocus={() => {
                setIsKeyboardVisible(true)
                setActiveInput('password')
              }}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Form.Item>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20
          }}
        >
          <Button
            icon={<img src={fingetPrintIcon} alt="Fingerprint" style={{ width: 20, height: 20 }} />}
            style={{
              flex: 1,
              marginRight: 10,
              backgroundColor: '#FFFFFF',
              borderColor: 'transparent',
              borderRadius: 8,
              height: 40
            }}
          />
          <Button
            type="primary"
            htmlType="submit"
            style={{
              flex: 3,
              backgroundColor: '#106C6B',
              borderColor: 'transparent',
              color: '#fff',
              borderRadius: 8,
              height: 40
            }}
            loading={loading}
          >
            Sign In
          </Button>
        </div>
      </Form>
      {isKeyboardVisible && (
        <VirtualKeyboard
          onChange={(value) => {
            form.setFieldsValue({ [activeInput]: value })
          }}
          onClose={() => setIsKeyboardVisible(false)}
          targetInput={activeInput}
        />
      )}
    </Modal>
  )
}

export default Void

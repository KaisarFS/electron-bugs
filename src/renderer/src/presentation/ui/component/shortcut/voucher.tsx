import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, Form } from 'antd'
import VirtualKeyboard from './keyboard'

interface VoucherProps {
  isVisible: boolean
  onCancel: () => void
  onSubmit: (values: { voucherCode: string }) => void
  loading: boolean
}

const Voucher: React.FC<VoucherProps> = ({ isVisible, onCancel, onSubmit, loading }) => {
  const [form] = Form.useForm()
  const [inputValue, setInputValue] = useState<string>('')
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false)
  const [modalStyle, setModalStyle] = useState<{ marginTop: string }>({ marginTop: '0px' })
  const [activeInput, setActiveInput] = useState<string>('')

  const handleFinish = (values: { voucherCode: string }) => {
    onSubmit(values)
    form.resetFields()
  }

  useEffect(() => {
    setModalStyle({ marginTop: isKeyboardVisible ? '-300px' : '0px' })
  }, [isKeyboardVisible])

  return (
    <Modal
      open={isVisible}
      title={'Voucher'}
      footer={null}
      onCancel={onCancel}
      centered
      width={'100vh'}
      style={modalStyle}
    >
      <Form form={form} layout="horizontal" onFinish={handleFinish}>
        <Form.Item
          label="Voucher Code Scan"
          name="voucherCode"
          rules={[{ required: true, message: 'Voucher Code is required!' }]}
          className="form-container"
        >
          <Input
            placeholder="Enter Voucher Code"
            value={inputValue}
            className="form-input"
            onFocus={() => {
              setIsKeyboardVisible(true)
              setActiveInput('voucherCode')
            }}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Form.Item>

        <div className="button-container">
          <Button onClick={onCancel} className="cancel-button">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" className="submit-button" loading={loading}>
            Submit
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

export default Voucher

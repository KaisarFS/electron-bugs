import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, Form } from 'antd'
import VirtualKeyboard from './keyboard'

interface GrabMartInvoiceProps {
  isVisible: boolean
  onCancel: () => void
  onSubmit: (values: { shortOrderNumber: string }) => void
  loading: boolean
}

const GrabMartInvoice: React.FC<GrabMartInvoiceProps> = ({
  isVisible,
  onCancel,
  onSubmit,
  loading
}) => {
  const [form] = Form.useForm()
  const [inputValue, setInputValue] = useState<string>('')
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false)
  const [modalStyle, setModalStyle] = useState<{ marginTop: string }>({ marginTop: '0px' })
  const [activeInput, setActiveInput] = useState<string>('')

  const handleFinish = (values: { shortOrderNumber: string }) => {
    onSubmit(values)
    form.resetFields()
  }

  useEffect(() => {
    setModalStyle({ marginTop: isKeyboardVisible ? '-300px' : '0px' })
  }, [isKeyboardVisible])

  return (
    <Modal
      open={isVisible}
      title={'Input your Grabmart Invoice Code'}
      footer={null}
      onCancel={onCancel}
      centered
      width={'50vh'}
      style={modalStyle}
    >
      <Form form={form} layout="horizontal" onFinish={handleFinish}>
        <Form.Item
          label="Invoice Code"
          name="shortOrderNumber"
          rules={[
            { required: true, message: 'input 3 nomor dari GM-123, contohnya: 123 atau 123F' }
          ]}
          className="form-container"
        >
          <Input
            placeholder="123 or 123F"
            value={inputValue}
            className="form-input"
            onFocus={() => {
              setIsKeyboardVisible(true)
              setActiveInput('shortOrderNumber')
            }}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Form.Item>

        <div className="button-container">
          {/* <Button onClick={onCancel} className="cancel-button">
            Cancel
          </Button> */}
          <Button
            type="primary"
            htmlType="submit"
            className="submit-button-grabmart"
            loading={loading}
          >
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

export default GrabMartInvoice

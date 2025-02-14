import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, Form } from 'antd'
import dayjs from 'dayjs'
import VirtualKeyboard from './keyboard'

interface PettyCashProps {
  isVisible: boolean
  onCancel: () => void
  onSubmit: (values: {
    dateTime: string
    expenseTotal: number
    discount: number
    employeeName: string
    reference: string
    description: string
    storeId: number
  }) => void
  registerFingerprint?: (data: RegisterFingerprintParams) => void
  validationType?: string
  loading?: boolean
}

interface RegisterFingerprintParams {
  employeeId: string
  endpoint: string
  validationType?: string
  applicationSource: string
  loading: boolean
}

const PettyCash: React.FC<PettyCashProps> = ({ isVisible, onCancel, onSubmit, loading }) => {
  const [form] = Form.useForm()
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false)
  const [modalStyle, setModalStyle] = useState<{ marginTop: string }>({ marginTop: '0px' })
  const [activeInput, setActiveInput] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')

  const handleFinish = (values: {
    dateTime: string
    expenseTotal: number
    discount: number
    employeeName: string
    reference: string
    description: string
    storeId: number
  }) => {
    onSubmit(values)
    form.resetFields()
  }

  useEffect(() => {
    setModalStyle({ marginTop: isKeyboardVisible ? '-300px' : '0px' })
  }, [isKeyboardVisible])

  return (
    <Modal
      open={isVisible}
      title={'Petty Cash'}
      footer={null}
      onCancel={onCancel}
      centered
      width={500}
      style={modalStyle}
    >
      <Form
        form={form}
        layout="horizontal"
        onFinish={handleFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        labelAlign={'left'}
        colon={false}
      >
        <div className="form-container">
          <Form.Item
            label="Date"
            name="dateTime"
            rules={[{ required: true, message: 'Date is required!' }]}
            initialValue={dayjs().format('YYYY-MM-DD')}
            hasFeedback
          >
            <Input
              className="form-input"
              readOnly
              suffix={<span style={{ color: '#28a745' }}>✔</span>}
              value={inputValue}
              onFocus={() => {
                setIsKeyboardVisible(true)
                setActiveInput('dateTime')
              }}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Expense"
            name="expenseTotal"
            hasFeedback
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value <= 0) {
                    return Promise.reject(new Error('Expense must be greater than 0!'))
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <Input
              type="number"
              placeholder="Enter expense"
              className="form-input"
              value={inputValue}
              onFocus={() => {
                setIsKeyboardVisible(true)
                setActiveInput('expenseTotal')
              }}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Discount"
            name="discount"
            hasFeedback
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value <= 0) {
                    return Promise.reject(new Error('Discount must be greater than 0!'))
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <Input
              type="number"
              placeholder="Enter discount"
              className="form-input"
              value={inputValue}
              onFocus={() => {
                setIsKeyboardVisible(true)
                setActiveInput('discount')
              }}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Employee"
            name="employeeName"
            hasFeedback
            rules={[{ required: true, message: 'Employee is required!' }]}
          >
            <Input
              // disabled
              defaultValue={'1'}
              className="form-input"
              value={inputValue}
              onFocus={() => {
                setIsKeyboardVisible(true)
                setActiveInput('employeeName')
              }}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Reference"
            name="reference"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Reference is required!'
              },
              {
                pattern: /^[a-zA-Z0-9]+$/,
                message: 'Description can only contain alphanumeric characters (a-z, A-Z, 0-9)!'
              },
              {
                min: 5,
                message: 'Description must be at least 5 characters long!'
              },
              {
                max: 40,
                message: 'Description must not exceed 40 characters!'
              }
            ]}
          >
            <Input
              placeholder="Enter reference"
              className="form-input"
              value={inputValue}
              onFocus={() => {
                setIsKeyboardVisible(true)
                setActiveInput('reference')
              }}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Description is required!'
              },
              {
                pattern: /^[a-zA-Z0-9]+$/,
                message: 'Description can only contain alphanumeric characters (a-z, A-Z, 0-9)!'
              },
              {
                min: 20,
                message: 'Description must be at least 20 characters long!'
              },
              {
                max: 99999,
                message: 'Description must not exceed 99999 characters!'
              }
            ]}
          >
            <Input
              placeholder="Enter description"
              className="form-input"
              value={inputValue}
              onFocus={() => {
                setIsKeyboardVisible(true)
                setActiveInput('description')
              }}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Form.Item>
        </div>

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

export default PettyCash

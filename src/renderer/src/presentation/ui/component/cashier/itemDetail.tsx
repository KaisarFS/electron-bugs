import React, { useState } from 'react'
import { Modal, Input, Button, Form, Table } from 'antd'
import { ProductList, DetailProduct, Product } from '@renderer/redux/store/slices/cashierSlice'
import VoidModal from '../voidModal'
import VirtualNumpad from '../shortcut/numpad'
import { AllValues } from '@renderer/presentation/entity/itemDetail.entity'

interface Record {
  id: number | string
  parentQty: number | string
  name: string
}
interface ItemDetailProps {
  isVisible: boolean
  productList: ProductList
  indexItem: number | null
  isModalQuantityVisible: boolean
  onCancel: () => void
  onDelete: (no: number) => void
  // onSubmit: (values: AllValues) => void

  onSubmit: (values: {
    no: number
    price: number
    qty: number
    disc1: number
    disc2: number
    disc3: number
    discount: number
    total: number
  }) => void
}

const ItemDetail: React.FC<ItemDetailProps> = ({
  isVisible,
  productList,
  indexItem,
  isModalQuantityVisible,
  onCancel,
  onDelete,
  onSubmit
}) => {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false)
  const [activeInput, setActiveInput] = useState<string>('')
  const [errors, setErrors] = useState({
    qty: '',
    disc1: '',
    disc2: '',
    disc3: '',
    discount: ''
  })
  const [qty, setQty] = useState<number>(Number(productList.qty) || 0)

  const handleQtyChange = (value: number) => {
    if (value < 0) return 
    setQty(value)
    form.setFieldsValue({ qty: value })
  }

  const handleValidation = (field: string, value: number) => {
    if (value < 0 || isNaN(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: 'Tidak boleh kurang dari 0'
      }))
      form.setFieldsValue({ [field]: 0 })
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: ''
      }))
    }
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleDeleteConfirmation = () => {
    onDelete(indexItem as number)
    closeModal()
  }

  const calculateTotal = (values: {
    price: number | string
    // qty: number | string
    disc1: number | string
    disc2: number | string
    disc3: number | string
    discount: number | string
  }) => {
    const price = Number(values.price) || 0
    // const qty = parseInt((values.qty || '0').toString(), 10)
    const disc1 = parseFloat((values.disc1 || '0').toString())
    const disc2 = parseFloat((values.disc2 || '0').toString())
    const disc3 = parseFloat((values.disc3 || '0').toString())
    const discount = parseFloat((values.discount || '0').toString())

    // const total = price * qty - (price * qty * (disc1 + disc2 + disc3)) / 100 - discount
    const discountPercentage = (disc1 + disc2 + disc3) / 100
    const discountedPrice = price * qty * (1 - discountPercentage) - discount

    return Math.max(0, discountedPrice) // Ensure the total is not negative
    // return total < 0 ? 0 : total
  }

  const onValuesChange = (_changedValues: Partial<AllValues>, allValues: AllValues) => {
    const total = calculateTotal(allValues)

    // form.setFieldsValue({ total: total.toLocaleString('id-ID') })
    form.setFieldsValue({ total })
  }

  const handleFinish = (values: {
    // edited kaisar
    no: number
    price: number
    disc1: number
    disc2: number
    disc3: number
    discount: number
    total: number
  }) => {
    onSubmit({
      no: (indexItem as number) + 1,
      qty,
      price: form.getFieldValue('price') || 0,
      disc1: form.getFieldValue('disc1') || 0,
      disc2: form.getFieldValue('disc2') || 0,
      disc3: form.getFieldValue('disc3') || 0,
      discount: form.getFieldValue('discount') || 0,
      total: calculateTotal({
        price: form.getFieldValue('price') || 0,
        qty,
        disc1: form.getFieldValue('disc1') || 0,
        disc2: form.getFieldValue('disc2') || 0,
        disc3: form.getFieldValue('disc3') || 0,
        discount: form.getFieldValue('discount') || 0
      })
    })
    form.resetFields()
  }

  const processedData = []
  if (Array.isArray(productList.detailProduct)) {
    for (const detail of productList.detailProduct) {
      if (detail.name === '' && detail.listCategory.length > 0) {
        for (const item of detail.listCategory) {
          ;(processedData as unknown as Record[]).push({
            ...item,
            id: `${detail.id}-${item.id}`,
            parentQty: detail.qty
          })
        }
      } else {
        ;(processedData as unknown as Product[]).push({ ...detail })
      }
    }
  }

  return (
    <Modal
      open={isVisible}
      title={isModalQuantityVisible ? 'Edit Quantity' : 'Edit Item Details'}
      footer={null}
      onCancel={onCancel}
      centered
      width={600}
    >
      {productList.typeProduct === 'Bundle' ? (
        <>
          <Table
            dataSource={processedData}
            columns={[
              {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (text: string, record: Record) =>
                  record.parentQty ? `${record.name}` : text
              },
              {
                title: 'Qty',
                dataIndex: 'qty',
                key: 'qty',
                render: (text: string, record: Record) => (record.parentQty ? `${text}` : text)
              }
            ]}
            pagination={false}
            rowKey="id"
            style={{ marginBottom: 20 }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={openModal}
              style={{
                backgroundColor: '#D7EFEF',
                borderColor: 'transparent',
                color: '#106C6B',
                borderRadius: 8,
                height: 40
              }}
            >
              Delete
            </Button>
            <Button
              onClick={onCancel}
              style={{
                backgroundColor: '#106C6B',
                borderColor: 'transparent',
                color: '#FFF',
                borderRadius: 8,
                height: 40
              }}
            >
              Cancel
            </Button>
          </div>
          <VoidModal
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            handleDeleteConfirmation={handleDeleteConfirmation}
          />
        </>
      ) : (
        <>
          <Form
            form={form}
            layout="horizontal"
            onFinish={handleFinish}
            onValuesChange={onValuesChange}
            labelCol={{ span: 6 }}
            labelAlign="left"
            wrapperCol={{ span: 18 }}
            initialValues={{
              no: (indexItem as number) + 1,
              price: Number(productList.price),
              qty: productList.qty,
              disc1: Array.isArray(productList.detailProduct)
                ? Number(productList.detailProduct?.[0]?.disc1 || 0)
                : Number((productList.detailProduct as DetailProduct)?.disc1 || 0),
              disc2: Array.isArray(productList.detailProduct)
                ? Number(productList.detailProduct?.[0]?.disc2 || 0)
                : Number((productList.detailProduct as DetailProduct)?.disc2 || 0),
              disc3: Array.isArray(productList.detailProduct)
                ? Number(productList.detailProduct?.[0]?.disc3 || 0)
                : Number((productList.detailProduct as DetailProduct)?.disc3 || 0),
              discount: Array.isArray(productList.detailProduct)
                ? Number(productList.detailProduct?.[0]?.discount || 0)
                : Number((productList.detailProduct as DetailProduct)?.discount || 0),
              total: Number(productList.totalPrice)
            }}
          >
            {/* <Title level={5} style={{ marginBottom: 20 }}>
              Edit Item
            </Title> */}

            {/* <Form.Item label="Employee" name="employee">
            <Select>
              <Option value={userEmployee}>{userEmployee}</Option>
            </Select>
          </Form.Item> */}

            {isModalQuantityVisible ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: '#eef3f1',
                  padding: 15,
                  borderRadius: 10,
                  margin: 0,
                  marginBottom: 15
                }}
              >
                <Button
                  onClick={() => handleQtyChange(qty - 1)}
                  style={{
                    fontSize: 24,
                    width: 50,
                    height: 50,
                    backgroundColor: '#2F7F7A',
                    color: 'white',
                    borderRadius: 10
                  }}
                >
                  -
                </Button>

                {/* Regular input field instead of <Form.Item> */}
                <input
                  type="number"
                  value={qty}
                  className="custom-input"
                  style={{
                    textAlign: 'center',
                    fontSize: 24,
                    width: '100%',
                    height: 30,
                    margin: 0,
                    padding: 9,
                    border: '1px solid #ccc',
                    borderRadius: 5,
                    flexGrow: 1
                  }}
                  onFocus={() => {
                    setIsKeyboardVisible(true)
                    setActiveInput('qty')
                  }}
                  onChange={(event) => {
                    handleQtyChange(parseInt(event.target.value, 10))
                  }}
                />

                <Button
                  onClick={() => handleQtyChange(qty + 1)}
                  style={{
                    fontSize: 24,
                    width: 50,
                    height: 50,
                    backgroundColor: '#2F7F7A',
                    color: 'white',
                    borderRadius: 10
                  }}
                >
                  +
                </Button>
              </div>
            ) : (
              <>
                <Form.Item label="No" name="no">
                  <Input readOnly disabled />
                </Form.Item>

                <Form.Item label="Price" name="price">
                  <Input type="number" disabled />
                </Form.Item>

                <Form.Item
                  label="Disc1(%)"
                  name="disc1"
                  getValueFromEvent={(event) => Number(event.target.value)}
                  validateStatus={errors.disc1 ? 'error' : ''}
                  help={errors.disc1}
                >
                  <Input
                    type="number"
                    value={inputValue}
                    disabled={productList.typeProduct === 'Consignment'}
                    onFocus={() => {
                      setIsKeyboardVisible(true)
                      setActiveInput('disc1')
                    }}
                    onChange={(event) => {
                      const value = event.target.value
                      setInputValue(value)
                      handleValidation('disc1', parseFloat(value))
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Disc2(%)"
                  name="disc2"
                  getValueFromEvent={(event) => Number(event.target.value)}
                  validateStatus={errors.disc2 ? 'error' : ''}
                  help={errors.disc2}
                >
                  <Input
                    type="number"
                    disabled={productList.typeProduct === 'Consignment'}
                    value={inputValue}
                    onFocus={() => {
                      setIsKeyboardVisible(true)
                      setActiveInput('disc2')
                    }}
                    onChange={(event) => {
                      const value = event.target.value
                      setInputValue(value)
                      handleValidation('disc2', parseFloat(value))
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Disc3(%)"
                  name="disc3"
                  getValueFromEvent={(event) => Number(event.target.value)}
                  validateStatus={errors.disc3 ? 'error' : ''}
                  help={errors.disc3}
                >
                  <Input
                    type="number"
                    disabled={productList.typeProduct === 'Consignment'}
                    onFocus={() => {
                      setIsKeyboardVisible(true)
                      setActiveInput('disc3')
                    }}
                    onChange={(event) => {
                      const value = event.target.value
                      // setInputValue(value)
                      handleValidation('disc3', parseFloat(value))
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Discount Nominal"
                  name="discount"
                  validateStatus={errors.discount ? 'error' : ''}
                  help={errors.discount}
                >
                  <Input
                    type="number"
                    disabled={productList.typeProduct === 'Consignment'}
                    onFocus={() => {
                      setIsKeyboardVisible(true)
                      setActiveInput('discount')
                    }}
                    onChange={(event) => {
                      handleValidation('discount', parseFloat(event.target.value))
                    }}
                  />
                </Form.Item>

                <Form.Item label="Total" name="total">
                  <Input readOnly disabled />
                </Form.Item>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                onClick={openModal}
                // style={{
                //   backgroundColor: '#D7EFEF',
                //   borderColor: 'transparent',
                //   color: '#106C6B',
                //   borderRadius: 8,
                //   height: 40
                // }}
                className="delete-button"
              >
                Delete
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                // style={{
                //   backgroundColor: '#106C6B',
                //   borderColor: 'transparent',
                //   color: '#fff',
                //   borderRadius: 8,
                //   height: 40
                // }}
                className="submit-button"
              >
                Submit
              </Button>
            </div>
          </Form>
          <VoidModal
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            handleDeleteConfirmation={handleDeleteConfirmation}
          />
          <div>
            {/* {isKeyboardVisible && (
              <VirtualKeyboard
                onChange={(value) => {
                  setInputValue(value);
                  form.setFieldsValue({ qty: value }); // Ensure form state updates
                }}
                onClose={() => setIsKeyboardVisible(false)}
                targetInput="qty"
              />
            )} */}
            {isKeyboardVisible && (
              <VirtualNumpad
                onChange={(value) => {
                  form.setFieldsValue({ [activeInput]: value })
                }}
                onClose={() => setIsKeyboardVisible(false)}
                targetInput={activeInput}
              />
            )}
          </div>
        </>
      )}
    </Modal>
  )
}

export default ItemDetail

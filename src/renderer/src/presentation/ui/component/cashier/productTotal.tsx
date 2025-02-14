import React from 'react'
import { Table, Form, Button, AutoComplete } from 'antd'
import logoK3 from '../../../../../../../resources/logo-k3mart.png'
import { ProductList } from '@renderer/redux/store/slices/cashierSlice'

interface Product {
  id: string
  name: string
  price: number
  qty: number
}

interface PaymentPageProps {
  productList: ProductList[]
  totalPrice: string
  handleNameChange: (value: string) => void
  openDetail: (openOptions: string, index: number, isModalQuantityVisible: boolean) => void
}

const ProductTotal: React.FC<PaymentPageProps> = ({
  productList,
  totalPrice,
  handleNameChange,
  openDetail
}) => {
  const [form] = Form.useForm()

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (values.name) {
        handleNameChange(values.name)
        form.resetFields()
      }
    })
  }

  const columns = [
    {
      title: 'No',
      key: 'no',
      className: 'green-text',
      width: '5%',
      render: (_: Product, __: string, index: number) => (
        <div style={{ textAlign: 'center', color: '#000000', fontWeight: 'normal', fontSize: 14 }}>
          {productList.length - index}
        </div>
      )
    },
    {
      title: 'Type',
      dataIndex: 'typeProduct',
      key: 'typeProduct',
      className: 'green-text',
      width: '5%',
      render: (typeProduct: string) => (
        <div style={{ textAlign: 'center', color: '#000000', fontWeight: 'normal', fontSize: 14 }}>
          {typeProduct}
        </div>
      )
    },
    {
      title: 'PLU',
      dataIndex: 'productListCode',
      key: 'productListCode',
      className: 'green-text',
      width: '10%',
      render: (productListCode: string) => (
        <div style={{ textAlign: 'center', color: '#000000', fontWeight: 'normal', fontSize: 14 }}>
          {productListCode}
        </div>
      )
    },
    {
      title: 'Product',
      dataIndex: 'productListName',
      key: 'productListName',
      className: 'green-text',
      width: '45%',
      render: (productListName: string) => (
        <div style={{ textAlign: 'left', color: '#000000', fontWeight: 'normal', fontSize: 14 }}>
          {productListName}
        </div>
      )
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      className: 'green-text',
      render: (_: number, record: Product, index: number) => (
        <div
          style={{
            textAlign: 'center',
            color: '#000000',
            fontWeight: 'normal',
            fontSize: 14,
            padding: '3.5px 10px',
            background: '#FFF',
            borderRadius: 10,
            border: '1px solid #A0AFBD'
          }}
          onClick={(e) => {
            e.stopPropagation() // Prevents the row click event from triggering
            const rowIndex = productList.findIndex(
              (p) => p.productListCode === record.productListCode
            )

            if (Number(rowIndex) !== -1) {
              openDetail('itemDetail', Number(rowIndex), true)
            } else {
              console.error('Product index not found for', record.productListCode)
            }
          }}
        >
          {record.qty}
        </div>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      className: 'green-text',
      render: (price: string) => (
        <div style={{ textAlign: 'end', color: '#000000', fontWeight: 'normal', fontSize: 14 }}>
          {parseFloat(price).toLocaleString('id-ID')}
        </div>
      )
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      className: 'green-text',
      render: (totalPrice: string) => (
        <div style={{ textAlign: 'end', color: '#000000', fontWeight: 'normal', fontSize: 14 }}>
          {parseFloat(totalPrice).toLocaleString('id-ID')}
        </div>
      )
    }
  ]

  const components = {
    header: {
      cell: ({ children, className, ...restProps }) => (
        <th
          {...restProps}
          className={className}
          style={{
            backgroundColor: '#106C6B',
            color: '#FFFFFF',
            textAlign: 'center',
            fontWeight: 'bold',
            padding: '10px'
          }}
        >
          {children}
        </th>
      )
    }
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
        <div style={{ flex: 0.1 }}>
          <img src={logoK3} alt="logoK3" style={{ width: '100%', height: 'auto' }} />
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#F3F5F6',
            padding: '10px 20px',
            borderRadius: '8px'
          }}
        >
          <p style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Total</p>
          <p style={{ fontSize: 36, fontWeight: 700, margin: 0 }}>
            {parseFloat(totalPrice).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Search and Submit */}
      <Form
        form={form}
        layout="inline"
        style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}
      >
        <Form.Item
          style={{ flex: 1, margin: 0 }}
          name="name"
          rules={[{ required: true, message: 'Please enter product name!' }]}
        >
          <AutoComplete
            style={{ width: '100%', borderRadius: '10px', height: 44 }}
            placeholder="Product (F2); ie. 2*Barcode"
            // options={productList.map((product) => ({
            //   value: product.productListCode,
            //   label: `${product?.productListCode} - ${product?.productListName}`
            // }))}
            // onChange={handleNameChange}
          />
        </Form.Item>
        <Button
          style={{
            background: '#106C6B',
            borderRadius: '10px',
            color: '#FFF',
            padding: '10px 20px',
            fontWeight: 500,
            height: 44
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Form>

      {/* Table */}
      <Table
        style={{
          border: '0.1px solid #C4CDD6',
          borderRadius: '8px',
          overflow: 'scroll',
          height: '50vh',
          maxHeight: '50vh'
        }}
        bordered={true}
        rowClassName={(_, index) => (index % 2 !== 0 ? 'even-row' : '')}
        dataSource={productList.slice().reverse()}
        columns={columns}
        components={components}
        pagination={false}
        rowKey="key"
        scroll={{ x: 'max-content', y: 'max-content' }}
        sticky={true}
        onRow={(_, reversedIndex) => ({
          onClick: (e) => {
            if (reversedIndex !== undefined) {
              // Ensure clicking on row does not interfere with the Qty click
              if (!(e.target as HTMLElement).closest('.qty-clickable')) {
                const originalIndex = productList.length - 1 - reversedIndex
                openDetail('itemDetail', originalIndex, false)
              }
            } else {
              console.error('reversedIndex is undefined')
            }
          }
        })}
      />
    </>
  )
}

export default ProductTotal

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { usePGlite } from '@electric-sql/pglite-react'
import { Button, Card, Table, Row, Col, Space, Modal, Input, Drawer, Descriptions } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const { confirm } = Modal

interface Order {
  order_number: number
  total_amount: number
}

interface OrderItem {
  order_number: number
  product_id: number
  quantity: number
  price: number
  total_amount: number
}

const OrderPage = (): JSX.Element => {
  const db = usePGlite()

  // TODO: move to redux, for testing only
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [orderDetails, setOrderDetails] = useState<OrderItem | null>(null)
  const [orderItems, setOrderItems] = useState<[]>([])

  const dataColumns: ColumnsType<{
    order_number: number
    total_amount: number
  }> = [
    {
      title: 'Order Number',
      dataIndex: 'order_number',
      key: 'order_number',
      width: '20%'
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: '20%',
      render: (value) => {
        if (value) {
          return `$${Number(value)?.toFixed(2)}`
        }
        return null
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => viewOrderDetail(record.order_number)}>
          View Detail
        </Button>
      )
    }
  ]

  const loadOrders = async (): Promise<void> => {
    try {
      const result = await db.exec(`SELECT * FROM orders`)
      const orderList = result?.[0]?.rows ?? []
      setOrders(orderList)
    } catch (error) {
      console.error('Query Error:', error)
    }
  }

  const viewOrderDetail = async (orderNumber: number): Promise<void> => {
    try {
      const [orderResult, orderItemResult] = await Promise.all([
        db.exec(`SELECT * FROM orders WHERE order_number = ${orderNumber}`),
        db.exec(`SELECT * FROM order_items WHERE order_number = ${orderNumber}`)
      ])

      setOrderDetails(orderResult?.[0]?.rows?.[0] || null)
      setOrderItems(orderItemResult?.[0]?.rows || [])
      setDrawerVisible(true)
    } catch (error) {
      console.error('Query Error:', error)
    }
  }

  const clearData = async (): Promise<void> => {
    try {
      await db.exec(`DROP TABLE IF EXISTS order_items; DROP TABLE IF EXISTS orders;`)
      await loadOrders()
    } catch (error) {
      console.error('Query Error:', error)
    }
  }

  const showClearConfirm = (): void => {
    confirm({
      title: 'Are you sure you want to clear all orders?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Clear',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => clearData()
    })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const closeDrawer = (): void => {
    setDrawerVisible(false)
    setOrderDetails(null)
    setOrderItems([])
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toString().includes(searchQuery) ||
      order.total_amount.toString().includes(searchQuery)
  )

  return (
    <div style={{ padding: '20px' }}>
      <Card title="Order Management" bordered={false}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <h3>Manage Orders</h3>
          </Col>
          <Col>
            <Space>
              <Input
                placeholder="Search by order number or amount"
                value={searchQuery}
                onChange={handleSearch}
                style={{ width: 200 }}
              />
              <Button type="primary" onClick={loadOrders}>
                Show Orders
              </Button>
              <Button danger onClick={showClearConfirm}>
                Clear Orders
              </Button>
            </Space>
          </Col>
        </Row>
        <Table
          dataSource={filteredOrders}
          columns={dataColumns}
          rowKey="order_number"
          pagination={{ pageSize: 5 }}
          bordered
        />
      </Card>

      <Drawer
        title={`Order Details - #${orderDetails?.order_number}`}
        placement="right"
        onClose={closeDrawer}
        visible={drawerVisible}
        width={400}
      >
        {orderDetails ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Order Number">{orderDetails.order_number}</Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              ${Number(orderDetails?.total_amount)?.toFixed(2)}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>No order details available.</p>
        )}

        <h3 style={{ marginTop: '16px' }}>Order Items</h3>
        <Table
          dataSource={orderItems}
          columns={[
            { title: 'Product Name', dataIndex: 'product_name', key: 'product_name' },
            {
              title: 'Price',
              dataIndex: 'price',
              key: 'price',
              render: (value) => `$${Number(value)?.toFixed(2)}`
            },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
            {
              title: 'Total',
              dataIndex: 'total',
              key: 'total',
              render: (value) => `$${Number(value)?.toFixed(2)}`
            }
          ]}
          rowKey="id"
          pagination={false}
          bordered
        />
      </Drawer>
    </div>
  )
}

export default OrderPage

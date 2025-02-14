/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react'
import { usePGlite } from '@electric-sql/pglite-react'
import { Button, Card, Table, Row, Col, Space, Modal, Input, Spin } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const { confirm } = Modal

const ProductPage = (): JSX.Element => {
  const db = usePGlite()

  const [data, setData] = useState<[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const dataColumns: ColumnsType<{
    id: number
    name: string
    price: number
    stock: number
    description: string
  }> = [
    {
      title: 'SKU',
      dataIndex: 'id',
      key: 'id',
      width: '10%'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '15%',
      render: (value) => {
        if (value) {
          return `$${Number(value)?.toFixed(2)}`
        }
        return null
      }
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: '10%'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '45%'
    }
  ]

  useEffect(() => {
    //   async function initializeTable(): Promise<void> {
    //     try {
    //       await db.exec(`
    //         CREATE TABLE IF NOT EXISTS product (
    //           id SERIAL PRIMARY KEY,
    //           name VARCHAR(255) NOT NULL,
    //           description TEXT,
    //           price DECIMAL(10, 2) NOT NULL,
    //           stock INT NOT NULL DEFAULT 0,
    //           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //         );
    //       `)
    //     } catch (error) {
    //       console.error('Query Error:', error)
    //     }
    //   }
    //   initializeTable()
  }, [db])

  const handleShowData = async (): Promise<void> => {
    setLoading(true)
    try {
      const result = await db.exec(`SELECT * FROM product`)
      const products = result?.[0]?.rows ?? []
      setData(products)
    } catch (error) {
      console.error('Query Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (): Promise<void> => {
    try {
      const randomPrice = Math.floor(Math.random() * 9) * 5000 + 10000

      await db.exec(`
        INSERT INTO product (name, description, price, stock)
        VALUES
          ('Product ${randomPrice}', 'Description of Product ${randomPrice}', ${randomPrice}, 50)
      `)
      await handleShowData()
    } catch (error) {
      console.error('Query Error:', error)
    }
  }

  const clearData = async (): Promise<void> => {
    setLoading(true)
    try {
      await db.exec(`
        TRUNCATE table product
      `)
      await handleShowData()
    } catch (error) {
      console.error('Query Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const showClearConfirm = (): void => {
    confirm({
      title: 'Are you sure you want to clear all data?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Clear',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => clearData()
    })
  }

  // TODO: make sure select column is work
  const handleSearchData = async (): Promise<void> => {
    setLoading(true)
    try {
      const result = await db.exec(
        `SELECT * FROM product WHERE LOWER(name) LIKE '%${searchQuery.toLowerCase()}%'`
      )
      const filteredProducts = result?.[0]?.rows ?? []
      setData(filteredProducts)
    } catch (error) {
      console.error('Query Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <Card title="Product Management" bordered={false}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <Space>
              <Input
                placeholder="Search product by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 200 }}
              />
              <Button type="primary" onClick={handleSearchData}>
                Search
              </Button>
              <Button type="default" onClick={handleAddProduct}>
                Insert Data
              </Button>
              <Button danger onClick={showClearConfirm}>
                Clear Data
              </Button>
            </Space>
          </Col>
        </Row>
        <Spin spinning={loading}>
          <Table
            dataSource={data}
            columns={dataColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
          />
        </Spin>
      </Card>
    </div>
  )
}

export default ProductPage

import React, { useEffect, useState } from 'react'
import { Modal, Button, Input, Table, Card } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Products } from '@renderer/presentation/entity/product.entity'
import { getDistPriceName } from '../../helper/stringModifications'

interface PaymentPageProps {
  visible: boolean
  onClose: () => void
  products: Products[]
  onRowClick: (record: Products, index: number) => void
}

const Product: React.FC<PaymentPageProps> = ({ visible, onClose, products, onRowClick }) => {
  const [searchText, setSearchText] = useState('')
  const [filteredProducts, setFilteredProducts] = useState(products)

  useEffect(() => {
    setFilteredProducts(products)
  }, [products])

  const handleSearch = () => {
    const filtered = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(searchText.toLowerCase()) ||
        product.barCode01.toLowerCase().includes(searchText.toLowerCase())
    )
    setFilteredProducts(filtered)
  }

  const handleReset = () => {
    setSearchText('')
    setFilteredProducts(products) // Reset ke semua produk
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      className: 'green-text',
      width: '5%',
      render: (id: number) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{id ?? 'N/A'}</div>
      )
    },
    {
      title: 'Product Code',
      dataIndex: 'barCode01',
      key: 'barCode01',
      className: 'green-text',
      width: '8%',
      render: (barCode01: string) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{barCode01 ?? 'N/A'}</div>
      )
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      className: 'green-text',
      render: (productName: string) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{productName ?? 'N/A'}</div>
      )
    },
    {
      title: getDistPriceName('sellPrice'),
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      className: 'green-text',
      render: (sellPrice: string) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>
          {parseFloat(sellPrice).toLocaleString('id-ID', { minimumFractionDigits: 2 }) ?? 'N/A'}
        </div>
      )
    },
    // {
    //   title: getDistPriceName('distPrice01'),
    //   dataIndex: 'distPrice01',
    //   key: 'distPrice01',
    //   className: 'green-text',
    //   render: (distPrice01: number) => (
    //     <div style={{ textAlign: 'center', color: '#000000' }}>
    //       {distPrice01.toLocaleString('id-ID', { minimumFractionDigits: 2 }) ?? 'N/A'}
    //     </div>
    //   )
    // },
    // {
    //   title: getDistPriceName('distPrice02'),
    //   dataIndex: 'distPrice02',
    //   key: 'distPrice02',
    //   className: 'green-text',
    //   render: (distPrice02: number) => (
    //     <div style={{ textAlign: 'center', color: '#000000' }}>
    //       {distPrice02.toLocaleString('id-ID', { minimumFractionDigits: 2 }) ?? 'N/A'}
    //     </div>
    //   )
    // },
    // {
    //   title: getDistPriceName('distPrice03'),
    //   dataIndex: 'distPrice03',
    //   key: 'distPrice03',
    //   className: 'green-text',
    //   render: (distPrice03: number) => (
    //     <div style={{ textAlign: 'center', color: '#000000' }}>
    //       {distPrice03.toLocaleString('id-ID', { minimumFractionDigits: 2 }) ?? 'N/A'}
    //     </div>
    //   )
    // },
    // {
    //   title: getDistPriceName('distPrice04'),
    //   dataIndex: 'distPrice04',
    //   key: 'distPrice04',
    //   className: 'green-text',
    //   render: (distPrice04: number) => (
    //     <div style={{ textAlign: 'center', color: '#000000' }}>
    //       {distPrice04.toLocaleString('id-ID', { minimumFractionDigits: 2 }) ?? 'N/A'}
    //     </div>
    //   )
    // },
    // {
    //   title: getDistPriceName('distPrice05'),
    //   dataIndex: 'distPrice05',
    //   key: 'distPrice05',
    //   className: 'green-text',
    //   render: (distPrice05: number) => (
    //     <div style={{ textAlign: 'center', color: '#000000' }}>
    //       {distPrice05.toLocaleString('id-ID', { minimumFractionDigits: 2 }) ?? 'N/A'}
    //     </div>
    //   )
    // },
    // {
    //   title: getDistPriceName('distPrice06'),
    //   dataIndex: 'distPrice06',
    //   key: 'distPrice06',
    //   className: 'green-text',
    //   render: (distPrice06: number) => (
    //     <div style={{ textAlign: 'center', color: '#000000' }}>
    //       {distPrice06.toLocaleString('id-ID', { minimumFractionDigits: 2 }) ?? 'N/A'}
    //     </div>
    //   )
    // },
    // {
    //   title: getDistPriceName('distPrice04'),
    //   dataIndex: 'distPrice07',
    //   key: 'distPrice07',
    //   className: 'green-text',
    //   render: (distPrice07: number) => (
    //     <div style={{ textAlign: 'center', color: '#000000' }}>
    //       {distPrice07.toLocaleString('id-ID', { minimumFractionDigits: 2 }) ?? 'N/A'}
    //     </div>
    //   )
    // },
    // {
    //   title: getDistPriceName('distPrice08'),
    //   dataIndex: 'distPrice08',
    //   key: 'distPrice08',
    //   className: 'green-text',
    //   render: (distPrice08: number) => (
    //     <div style={{ textAlign: 'center', color: '#000000' }}>
    //       {distPrice08.toLocaleString('id-ID', { minimumFractionDigits: 2 }) ?? 'N/A'}
    //     </div>
    //   )
    // },
    // {
    //   title: getDistPriceName('distPrice09'),
    //   dataIndex: 'distPrice09',
    //   key: 'distPrice09',
    //   className: 'green-text',
    //   render: (distPrice09: number) => (
    //     <div style={{ textAlign: 'center', color: '#000000' }}>
    //       {distPrice09.toLocaleString('id-ID', { minimumFractionDigits: 2 }) ?? 'N/A'}
    //     </div>
    //   )
    // },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      className: 'green-text',
      render: (qty: number) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{qty ?? 'N/A'}</div>
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
    <Modal visible={visible} title="Product" footer={null} onCancel={onClose} width={'95%'}>
      <Card style={{ border: 'none' }}>
        <Input
          placeholder="Search Product Name"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: '500px', padding: '10px', borderRadius: 10, marginRight: 10 }}
        />
        <Button
          type="primary"
          onClick={handleSearch}
          style={{ background: '#106C6B', padding: '20px 32px', borderRadius: 10, marginRight: 10 }}
        >
          Search
        </Button>
        <Button
          onClick={handleReset}
          style={{
            background: '#D7EFEF',
            padding: '20px 32px',
            color: '#106C6B',
            borderRadius: 10
          }}
        >
          Reset
        </Button>
      </Card>

      <Card style={{ border: 'none' }}>
        <Table
          style={{
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 10,
            borderColor: '#C4CDD6'
          }}
          bordered={true}
          rowClassName={(_, index) => (index % 2 !== 0 ? 'even-row' : '')}
          dataSource={filteredProducts}
          columns={columns}
          components={components}
          rowKey={(record) => record.id || record.barCode01}
          // scroll={{ x: 1290, y: 500 }}
          pagination={{
            pageSize: 10,
            total: filteredProducts.length,
            position: ['bottomCenter'],
            showSizeChanger: false,
            showQuickJumper: true
          }}
          onRow={(record, index) => ({
            onClick: () => {
              setFilteredProducts([])
              onRowClick(record, index as number)
            }
          })}
        />
      </Card>
    </Modal>
  )
}

export default Product

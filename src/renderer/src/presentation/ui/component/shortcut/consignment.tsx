import React, { useEffect, useState } from 'react'
import { Modal, Button, Input, Table, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Products } from '@renderer/presentation/entity/product.entity'
import { ConsignmentPagination } from '@renderer/redux/store/slices/shortcutSlice'
import { Consignment } from '@renderer/presentation/entity/consignment.entity'

interface Product {
  product_code: string
  product_name: string
  vendor: {
    name: string
  }
}

interface PaymentPageProps {
  visible: boolean
  onClose: () => void
  consignment: Consignment[]
  consignmentPagination: ConsignmentPagination
  onRowClick: (record: Products, index: number) => void
  onNext: (pageProps: number, search: string) => void
}

const Consignments: React.FC<PaymentPageProps> = ({
  visible,
  onClose,
  consignment,
  consignmentPagination,
  onRowClick,
  onNext
}) => {
  const [searchText, setSearchText] = useState('')
  const [filteredConsignment, setFilteredConsignment] = useState(consignment)
  const [pagination, setPagination] = useState(consignmentPagination)

  useEffect(() => {
    if (consignment) {
      setFilteredConsignment(consignment)
    }
    if (consignmentPagination) {
      setPagination(consignmentPagination)
    }
  }, [consignment, consignmentPagination])

  const handleSearch = () => {
    onNext(0, searchText)
    // const filtered = consignment.filter(
    //   (consignments) =>
    //     consignments.serviceCode.toLowerCase().includes(searchText.toLowerCase()) ||
    //   consignments.serviceName.toLowerCase().includes(searchText.toLowerCase())
    // )
    // setFilteredServices(filtered)
  }

  const handleReset = () => {
    onNext(1, '')
    setSearchText('')
    setFilteredConsignment(consignment) // Reset ke semua produk
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      className: 'green-text',
      width: 70,
      render: (id: string) => (
        <div
          style={{
            textAlign: 'center',
            color: '#000000'
            // border: '1px solid #ccc',
            // padding: '5px'
          }}
        >
          {id}
        </div>
      )
    },
    {
      title: 'Vendor',
      dataIndex: 'product',
      key: 'product',
      className: 'green-text',
      width: '28%',
      render: (product: Product) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{product?.vendor?.name ?? '-'}</div>
      )
    },
    {
      title: 'Product Code',
      dataIndex: 'product',
      key: 'product',
      className: 'green-text',
      render: (product: Product) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{product.product_code ?? '-'}</div>
      )
    },
    {
      title: 'Product Name',
      dataIndex: 'product',
      key: 'product',
      className: 'green-text',
      render: (product: Product) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{product.product_name ?? '-'}</div>
      )
    },
    {
      title: 'Sell Price',
      dataIndex: 'price',
      key: 'price',
      className: 'green-text',
      render: (price: string) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>
          {price ? price.toLocaleString() : '-'}
        </div>
      )
    },
    // {
    //   title: 'G Food',
    //   dataIndex: 'price_grabfood_gofood',
    //   key: 'price_grabfood_gofood',
    //   className: 'green-text',
    //   render: (gFood: string) => (
    //     <div style={{ textAlign: 'center', color: '#000000' }}>
    //       {gFood ? gFood.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
    //     </div>
    //   )
    // },
    // {
    //   title: 'G Mart',
    //   dataIndex: 'price_grabmart',
    //   key: 'price_grabmart',
    //   className: 'green-text',
    //   render: (gMart: string) => (
    //     <div style={{ textAlign: 'center', color: '#000000' }}>
    //       {gMart ? gMart.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
    //     </div>
    //   )
    // },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      className: 'green-text',
      render: (quantity: string) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{quantity ?? '-'}</div>
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

  //   console.log('pagination', pagination)

  return (
    <Modal visible={visible} title="Consignment" footer={null} onCancel={onClose} width={'95%'}>
      <Space style={{ margin: '25px 0px' }}>
        <Input
          placeholder="Search Product Name"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: '500px', padding: '10px', borderRadius: 10 }}
        />
        <Button
          type="primary"
          onClick={handleSearch}
          style={{ background: '#106C6B', padding: '20px 32px', borderRadius: 10 }}
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
      </Space>

      <Table
        style={{
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 10,
          borderColor: '#C4CDD6'
        }}
        bordered={true}
        rowClassName={(_, index) => (index % 2 !== 0 ? 'even-row' : '')}
        dataSource={filteredConsignment}
        columns={columns}
        components={components}
        rowKey={(record) => record.id}
        pagination={{
          pageSize: 10,
          total: pagination.total,
          position: ['bottomCenter'],
          showSizeChanger: false,
          showQuickJumper: true,
          current: pagination.page,
          onChange: (page) => onNext(page, searchText)
        }}
        onRow={(record, index) => ({
          onClick: () => onRowClick(record as unknown as Products, index as number)
        })}
      />
    </Modal>
  )
}

export default Consignments

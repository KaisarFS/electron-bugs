import React, { useEffect, useState } from 'react'
import { Modal, Button, Input, Table, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Products } from '@renderer/presentation/entity/product.entity'
import { Services } from '@renderer/presentation/entity/service.entity'

interface PaymentPageProps {
  visible: boolean
  onClose: () => void
  services: Services[]
  onRowClick: (record: Products, index: number) => void
}

const Service: React.FC<PaymentPageProps> = ({ visible, onClose, services, onRowClick }) => {
  const [searchText, setSearchText] = useState('')
  const [filteredServices, setFilteredServices] = useState(services)

  useEffect(() => {
    setFilteredServices(services)
  }, [services])

  const handleSearch = () => {
    const filtered = services.filter(
      (services) =>
        services.serviceCode.toLowerCase().includes(searchText.toLowerCase()) ||
        services.serviceName.toLowerCase().includes(searchText.toLowerCase())
    )
    setFilteredServices(filtered)
  }

  const handleReset = () => {
    setSearchText('')
    setFilteredServices(services) // Reset ke semua produk
  }

  const columns = [
    {
      title: 'No',
      key: 'no',
      className: 'green-text',
      width: '5%',
      render: (_: Products, __: Products, index: number) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{index + 1}</div>
      )
    },
    {
      title: 'Service Code',
      dataIndex: 'serviceCode',
      key: 'serviceCode',
      className: 'green-text',
      width: '20%',
      render: (serviceCode: string) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{serviceCode ?? 'N/A'}</div>
      )
    },
    {
      title: 'Description',
      dataIndex: 'serviceName',
      key: 'serviceName',
      className: 'green-text',
      width: '40%',
      render: (serviceName: string) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{serviceName ?? 'N/A'}</div>
      )
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      className: 'green-text',
      render: (active: number) => (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <div
            style={{
              textAlign: 'center',
              color: '#FFF',
              background: '#008DD3',
              width: '50%',
              borderRadius: 47
            }}
          >
            {active == 1 ? 'Active' : 'NonActive'}{' '}
          </div>
        </div>
      )
    },
    {
      title: 'Service Price',
      dataIndex: 'serviceCost',
      key: 'serviceCost',
      className: 'green-text',
      render: (serviceCost: string) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>
          {parseFloat(serviceCost).toLocaleString('id-ID') ?? 'N/A'}
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
    <Modal visible={visible} title="Service" footer={null} onCancel={onClose} width={'95%'}>
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
        dataSource={filteredServices}
        columns={columns}
        components={components}
        rowKey={(record) => record.id}
        pagination={{
          pageSize: 10,
          total: filteredServices.length,
          position: ['bottomCenter'],
          showSizeChanger: false,
          showQuickJumper: true
        }}
        onRow={(record, index) => ({
          onClick: () => onRowClick(record, index as number)
        })}
      />
    </Modal>
  )
}

export default Service

import React, { useEffect, useState } from 'react'
import { Modal, Button, Input, Table, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Products } from '@renderer/presentation/entity/product.entity'
import { TblBundling } from '@renderer/domain/bundling/entity/bundling.entity'
import { dayByNumber } from '../../helper/string'

interface PaymentPageProps {
  visible: boolean
  onClose: () => void
  bundling: TblBundling[]
  onRowClick: (record: TblBundling, index: number) => void
}

const Bundling: React.FC<PaymentPageProps> = ({ visible, onClose, bundling, onRowClick }) => {
  const [searchText, setSearchText] = useState('')
  const [filteredBundling, setFilteredBundling] = useState(bundling)

  useEffect(() => {
    setFilteredBundling(bundling)
  }, [bundling])

  const handleSearch = () => {
    const filtered = bundling.filter(
      (bundlings) =>
        bundlings.code.toLowerCase().includes(searchText.toLowerCase()) ||
        bundlings.name.toLowerCase().includes(searchText.toLowerCase())
    )
    setFilteredBundling(filtered)
  }

  const handleReset = () => {
    setSearchText('')
    setFilteredBundling(bundling) // Reset ke semua produk
  }

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      className: 'green-text',
      width: '15%',
      render: (type: string) => (
        <div style={{ textAlign: 'center', color: '#000000', fontSize: 14 }}>
          {type === '0' ? 'Buy X Get Y' : 'Buy X Get Discount Y'}
        </div>
      )
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      className: 'green-text',
      width: '10%',
      render: (code: string) => (
        <div style={{ textAlign: 'center', color: '#000000', fontSize: 14 }}>{code ?? 'N/A'}</div>
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      className: 'green-text',
      width: '15%',
      render: (name: string) => (
        <div style={{ textAlign: 'center', color: '#000000', fontSize: 14 }}>{name ?? 'N/A'}</div>
      )
    },
    {
      title: 'Period',
      dataIndex: 'Date',
      key: 'Date',
      className: 'green-text',
      width: '10%',
      render: (_, record) => {
        const formatDate = (date) => {
          const options = { day: '2-digit', month: 'short', year: 'numeric' } as const
          return new Date(date).toLocaleDateString('id-ID', options)
        }

        const startDate = record.startDate ? formatDate(record.startDate) : 'N/A'
        const endDate = record.endDate ? formatDate(record.endDate) : 'N/A'

        return (
          <div
            style={{ textAlign: 'center', color: '#000000', fontSize: 14 }}
          >{`${startDate} ~ ${endDate}`}</div>
        )
      }
    },
    {
      title: 'Avaible Date',
      dataIndex: 'availableDate',
      key: 'availableDate',
      className: 'green-text',
      width: '10%',
      render: (text: string) => {
        let date

        if (text !== null) {
          const sortedDates = text.split(',').sort()

          if (sortedDates.length === 7) {
            date = 'Everyday'
          } else {
            date = sortedDates.map((dateNumber) => dayByNumber(dateNumber))
          }
        } else {
          date = 'Everyday'
        }

        return (
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', fontSize: 14 }}>
            <div
              style={{
                textAlign: 'center',
                color: '#FFF',
                background: '#13AD25',
                width: '70%',
                padding: '2px 0px',
                borderRadius: 47
              }}
            >
              {date}
            </div>
          </div>
        )
      }
    },
    {
      title: 'Apply Multiple',
      dataIndex: 'applyMultiple',
      key: 'applyMultiple',
      className: 'green-text',
      width: '10%',
      render: (applyMultiple: string) => (
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            fontSize: applyMultiple == '1' ? 14 : 12
          }}
        >
          <div
            style={{
              textAlign: 'center',
              color: '#FFF',
              background: applyMultiple == '1' ? '#008DD3' : '#e1c349',
              width: applyMultiple == '1' ? '70%' : '90%',
              padding: '2px 0px',
              borderRadius: 47
            }}
          >
            {applyMultiple == '1' ? 'Multiple' : 'One Per Transaction'}
          </div>
        </div>
      )
    },
    {
      title: 'Available Hour',
      dataIndex: 'availableHour',
      key: 'availableHour',
      className: 'green-text',
      width: '15%',
      render: (_, record) => (
        <div style={{ textAlign: 'center', color: '#000000', fontSize: 14 }}>
          {`${record.startHour} ~ ${record.endHour}`}
        </div>
      )
    },
    {
      title: 'Use',
      // dataIndex: 'applyMultiple',
      key: 'use',
      className: 'green-text',
      render: () => (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', fontSize: 14 }}>
          <div
            style={{
              textAlign: 'center',
              color: '#FFF',
              background: '#106C6B',
              width: '50%',
              padding: '6px 0px',
              borderRadius: 10
            }}
          >
            Choose
          </div>
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
    <Modal visible={visible} title="Bundling" footer={null} onCancel={onClose} width={'95%'}>
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
        rowClassName={(_, index) => (index % 2 !== 0 ? 'even-row' : '')}
        dataSource={filteredBundling}
        columns={columns}
        components={components}
        rowKey={(_, index) => `${filteredBundling.length}-${index}`}
        pagination={{
          pageSize: 10,
          total: filteredBundling.length,
          position: ['bottomCenter'],
          showSizeChanger: false,
          showQuickJumper: true
        }}
        onRow={(record, index) => ({
          onClick: () => onRowClick(record as unknown as Products, index as number)
        })}
      />
    </Modal>
  )
}

export default Bundling

import React, { useEffect, useState } from 'react'
import { Modal, Button, Input, Table, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { TblStockBookmarkGroup } from '@renderer/domain/stock/entity/stock-bookmark-group.entity'

interface PaymentPageProps {
  visible: boolean
  onClose: () => void
  bookmarkGroup: TblStockBookmarkGroup[]
  onRowClick: (record: TblStockBookmarkGroup, index?: number) => void
}

interface ProductData {
  key: string | number
  name: string
  id: string
}

const BookmarkGroup: React.FC<PaymentPageProps> = ({
  visible,
  onClose,
  bookmarkGroup,
  onRowClick
}) => {
  const [searchText, setSearchText] = useState('')
  const [filteredBookmarkGroup, setFilteredBookmarkGroup] = useState(bookmarkGroup)

  useEffect(() => {
    setFilteredBookmarkGroup(bookmarkGroup)
  }, [bookmarkGroup])

  const handleSearch = () => {
    const filtered = bookmarkGroup.filter((bookmarksGroup) =>
      bookmarksGroup.name.toLowerCase().includes(searchText.toLowerCase())
    )
    setFilteredBookmarkGroup(filtered)
  }

  const handleReset = () => {
    setSearchText('')
    setFilteredBookmarkGroup(bookmarkGroup) // Reset ke semua produk
  }

  const columns = [
    {
      title: 'No',
      key: 'no',
      className: 'green-text',
      width: '5%',
      render: (_: ProductData, __: ProductData, index: number) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{index + 1}</div>
      )
    },
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      className: 'green-text',
      //   width: '50%',
      render: (name: string) => (
        <div style={{ textAlign: 'left', color: '#000000' }}>{name ?? 'N/A'}</div>
      )
    },
    {
      title: '',
      key: 'onChoose',
      className: 'green-text',
      width: '13%',
      render: (_: ProductData, __: ProductData) => (
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
    <Modal visible={visible} title="Bookmark" footer={null} onCancel={onClose} width={'95%'}>
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
        dataSource={filteredBookmarkGroup.map((group) => ({
          ...group,
          key: group.id
        }))}
        columns={columns}
        components={components}
        rowKey={(record) => record.id}
        pagination={{
          pageSize: 10,
          total: filteredBookmarkGroup.length,
          position: ['bottomCenter'],
          showSizeChanger: false,
          showQuickJumper: true
        }}
        onRow={(record, index) => ({
          onClick: () => onRowClick(record, index)
        })}
      />
    </Modal>
  )
}

export default BookmarkGroup

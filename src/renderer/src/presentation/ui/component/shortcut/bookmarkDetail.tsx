import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, Pagination, Card } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { TblStockBookmark } from '@renderer/domain/stock/entity/stock-bookmark.entity'
import { Products } from '@renderer/presentation/entity/product.entity'
import defaultImageK3Mart from '../../../../../../../resources/default-image-k3mart.png'

import { IMAGEURL } from '../../helper/string'

const { Grid } = Card

interface PaymentPageProps {
  visible: boolean
  onClose: () => void
  bookmark: TblStockBookmark[]
  onRowClick: (record: Products, index: number) => void
}

const BookmarkDetail: React.FC<PaymentPageProps> = ({ visible, onClose, bookmark, onRowClick }) => {
  const [searchText, setSearchText] = useState('')
  const [filteredBookmark, setFilteredBookmark] = useState(bookmark)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 18 // Items per page

  useEffect(() => {
    setFilteredBookmark(bookmark)
    setCurrentPage(1)
  }, [bookmark])

  const handleSearch = () => {
    const filtered = bookmark.filter(
      (item) =>
        item.details.productName?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.details.name?.toLowerCase().includes(searchText.toLowerCase())
    )
    setFilteredBookmark(filtered)
    setCurrentPage(1) // Reset to first page
  }

  const handleReset = () => {
    setSearchText('')
    setFilteredBookmark(bookmark)
    setCurrentPage(1)
  }

  // Paginate the data
  const paginatedData = filteredBookmark.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <Modal visible={visible} title="Bookmark" footer={null} onCancel={onClose} width={'65%'}>
      <Card style={{ border: 'none' }}>
        <Input
          placeholder="Search Product Name"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            maxWidth: '500px',
            padding: '10px',
            borderRadius: 10,
            marginRight: '10px',
            marginLeft: '-14px'
          }}
        />
        <Button
          type="primary"
          onClick={handleSearch}
          style={{
            background: '#106C6B',
            padding: '20px 32px',
            borderRadius: 10,
            marginRight: '10px'
          }}
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

      <Grid
        style={{
          width: '5%',
          textAlign: 'center',
          padding: '10px',
          marginBottom: '10px',
          marginLeft: '10px',
          border: '1px solid #EBF2F0',
          borderRadius: '8px',
          cursor: 'pointer',
          background: '#106C6B',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={onClose}
      >
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>←</span>
      </Grid>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '10px',
          width: '95%',
          padding: '10px'
        }}
      >
        {paginatedData.map((item, index) => {
          const productImages = JSON.parse(item.details.productImage || '[]')
          const productImage =
            productImages.length > 0 &&
            productImages[0] !== 'no_image.png' &&
            productImages[0] != null &&
            productImages[0] !== '["no_image.png"]' &&
            productImages[0] !== '"no_image.png"'
              ? `${IMAGEURL}/${productImages[0]}`
              : defaultImageK3Mart

          return (
            <Grid
              key={item.id}
              style={{
                width: '100%',
                textAlign: 'center',
                padding: '10px',
                border: '1px solid #EBF2F0',
                borderRadius: '8px',
                cursor: 'pointer',
                background: '#FFF'
              }}
              onClick={() => onRowClick(item as unknown as Products, index)}
            >
              <img
                src={productImage}
                alt={'productImage'}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'contain',
                  marginBottom: '10px'
                }}
              />
              <div
                style={{
                  fontSize: '16px',
                  color: '#000',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {item.details.shortName || item.details.productName || item.details.name}
              </div>
            </Grid>
          )
        })}
      </div>

      <Pagination
        current={currentPage}
        total={filteredBookmark.length}
        pageSize={pageSize}
        onChange={(page) => setCurrentPage(page)}
        style={{
          textAlign: 'center',
          marginTop: '40px',
          justifyContent: 'end'
        }}
        showSizeChanger={false}
      />
    </Modal>
  )
}

export default BookmarkDetail

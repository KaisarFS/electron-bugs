import React from 'react'
import formatRupiah from '../../helper/string'

interface ProductItemProps {
  product: {
    id: number
    productListCode: string
    productListName: string
    qty: string
    totalPrice: string
  }
  index: number
}

const ProductItem: React.FC<ProductItemProps> = ({ product, index }) => {
  return (
    <div
      key={product.id}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: index % 2 === 0 ? '#1D8B890D' : '#14858326',
        padding: '16px 10px'
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '10px',
          flex: 8,
          alignItems: 'center'
        }}
      >
        <div>
          <span className="circle">{product.qty}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <b>{product.productListCode}</b>
          <p style={styles.pStyle}>{product.productListName}</p>
        </div>
      </div>
      <div
        // style={{
        //   display: 'flex',
        //   flexDirection: 'column',
        //   alignItems: 'flex-end',
        //   flex: 4,
        //   textAlign: 'right',
        //   whiteSpace: 'nowrap'
        // }}

        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          whiteSpace: 'nowrap'
        }}
      >
        <span style={{ opacity: 0.5 }}>&#8203;</span>
        <b>Rp{formatRupiah(parseInt(product.totalPrice))}</b>
      </div>
    </div>
  )
}

const styles = {
  pStyle: {
    margin: 0,
    padding: 0
  }
}

export default ProductItem

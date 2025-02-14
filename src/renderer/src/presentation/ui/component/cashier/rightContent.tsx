import React, { useState } from 'react'
import { Button } from 'antd'
import { TblStockBookmarkGroup } from '@renderer/domain/stock/entity/stock-bookmark-group.entity'
import { TblBundling } from '@renderer/domain/bundling/entity/bundling.entity'
import Numpad from '../../../../../../../resources/numpad-solid.svg'
import Keyboard from '../../../../../../../resources/keyboard-outline.svg'
import VirtualKeyboard from '../shortcut/keyboard'
import VirtualNumpad from '../shortcut/numpad'

interface PaymentPageProps {
  // visible: boolean
  handleCheckout: (openOptions: string, index: null | number) => void
  bookmarkGroup: TblStockBookmarkGroup[]
  bundling: TblBundling[]
  clickBookmark: (record: TblStockBookmarkGroup, index: number) => void
  clickBundling: (record: TblBundling, index: number) => void
}

const RightContent: React.FC<PaymentPageProps> = ({
  bookmarkGroup,
  bundling,
  handleCheckout,
  clickBookmark,
  clickBundling
}) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false)
  const [isNumpadVisible, setIsNumpadVisible] = useState<boolean>(false)
  const activeInput = ''

  // const [inputValue, setInputValue] = useState<string>('');

  const handleOpenKeyboard = () => {
    setIsKeyboardVisible(true)
  }

  const handleOpenNumpad = () => {
    setIsNumpadVisible(true)
  }

  const handleKeyboardInput = () => {
    // setInputValue(inputValue + value);
  }

  return (
    <>
      {/* <div style={{ display: 'flex', marginBottom: 12 }}>
        <Button
          type="primary"
          htmlType="submit"
          icon={<UserOutlined style={{ fontSize: '18px', color: '#0C5352', marginRight: 12 }} />}
          block
          style={{
            background: '#fff',
            fontSize: 12,
            color: 'black',
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 10,
            borderColor: '#C4CDD6',
            padding: '26px 0px',
            marginRight: 10,
            display: 'column'
          }}
        >
          Employee
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          icon={<UserOutlined style={{ fontSize: '18px', color: '#0C5352', marginRight: 12 }} />}
          block
          style={{
            background: '#fff',
            fontSize: 12,
            color: 'black',
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 10,
            borderColor: '#C4CDD6',
            padding: '26px 0px',
            display: 'column'
          }}
        >
          Lock Screen
        </Button>
      </div> */}

      <div
        style={{
          padding: '0px 14px',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 10,
          borderColor: '#C4CDD6'
          // height: '40vh'
        }}
      >
        <p style={{ color: 'black', fontSize: 16, fontWeight: '500' }}>Tebus Murah</p>
        <div style={{ color: 'black', fontSize: 14, fontWeight: '400' }}>
          {bundling.slice(0, 5).map((item: TblBundling, index: number) => (
            <div
              key={index}
              style={{
                marginBottom: '10px',
                borderBottom: index === 4 ? 'none' : '1px solid #C4CDD6',
                paddingBottom: '5px'
              }}
              onClick={() => {
                clickBundling(item, index)
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <h3 style={{ marginBottom: '20px', fontWeight: '400' }}>Menu Cepat</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            width: '100%'
          }}
        >
          {bookmarkGroup.slice(0, 9).map((row, rowIndex) => (
            <button
              key={`${rowIndex}-${rowIndex}`}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '4px solid #B3C6D4',
                height: '100px',
                fontSize: '14px',
                background: '#FFF',
                marginBottom: '10px',
                marginRight: '10px',
                borderRadius: '30px',
                cursor: 'pointer',
                color: '#0C5352'
              }}
              onClick={() => {
                clickBookmark(row, rowIndex)
              }}
            >
              {row.name}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 'auto'
        }}
      >
        <div style={{ display: 'flex', flex: 1, marginBottom: 12 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              background: '#fff',
              fontSize: 12,
              color: 'black',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 10,
              borderColor: '#C4CDD6',
              padding: '26px 0px',
              marginRight: 10
            }}
            onClick={handleOpenKeyboard}
          >
            <img src={Keyboard} alt="Menu" style={{ width: '26px', height: '26px' }} />
            V. Keyboard
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              background: '#fff',
              fontSize: 12,
              color: 'black',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 10,
              borderColor: '#C4CDD6',
              padding: '26px 0px'
            }}
            onClick={handleOpenNumpad}
          >
            {/* <ScanOutlined style={{ fontSize: '12px', color: '#0C5352', marginRight: 12 }} /> */}
            <img src={Numpad} alt="Menu" style={{ width: '24px', height: '24px' }} />
            Numpad
          </Button>
        </div>
        <Button
          type="primary"
          onClick={() => {
            handleCheckout('payment', null)
          }}
          // disabled={products.length === 0}
          htmlType="submit"
          block
          style={{
            background: '#DC3A87',
            // background: products.length === 0 ? '' : '#DC3A87',
            fontSize: 18,
            fontWeight: '700',
            padding: '28px 0px'
          }}
        >
          PAYMENT
        </Button>
        {isKeyboardVisible && (
          <VirtualKeyboard
            onChange={handleKeyboardInput}
            onClose={() => setIsKeyboardVisible(false)} // Close keyboard when done
            targetInput="inputValue"
          />
        )}

        {isNumpadVisible && (
          <VirtualNumpad
            onChange={() => {
              // form.setFieldsValue({ [activeInput]: value })
            }}
            onClose={() => setIsNumpadVisible(false)}
            targetInput={activeInput}
          />
        )}
      </div>
    </>
  )
}

export default RightContent

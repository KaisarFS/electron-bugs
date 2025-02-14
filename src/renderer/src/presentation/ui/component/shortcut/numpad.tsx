import React, { useState, useEffect } from 'react'
import { Button } from 'antd'

interface VirtualNumpadProps {
  onChange: (value: string) => void
  onClose: () => void
  targetInput: string
}

const keypadNumbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '00']

const VirtualNumpad: React.FC<VirtualNumpadProps> = ({ onChange, onClose, targetInput }) => {
  const [, setInputValue] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    setInputValue((prev) => ({ ...prev, [targetInput]: prev[targetInput] || '' }))
  }, [targetInput])

  const handleKeypadClick = (value: string | number) => {
    setInputValue((prev) => {
      const newValue = (prev[targetInput] || '') + value.toString()
      onChange(newValue)
      return { ...prev, [targetInput]: newValue }
    })
  }

  const removeLastChar = () => {
    setInputValue((prev) => {
      const newValue = (prev[targetInput] || '').slice(0, -1)
      onChange(newValue)
      return { ...prev, [targetInput]: newValue }
    })
  }

  const clearInput = () => {
    setInputValue((prev) => {
      onChange('')
      return { ...prev, [targetInput]: '' }
    })
  }

  return (
    <div style={styles.modalWrapper}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeButton}>
          &times;
        </button>
        <div style={{ padding: '40px', width: '80%' }}>
          <div style={{ display: 'flex', width: '100%' }}>
            {/* Numpad */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', width: '70%' }}>
              {keypadNumbers.map((num) => (
                <Button key={num} onClick={() => handleKeypadClick(num)} style={styles.keyButton}>
                  {num}
                </Button>
              ))}
            </div>
            <div style={styles.controlColumn}>
              <Button onClick={removeLastChar} style={styles.controlButton}>
                ⌫
              </Button>
              <Button onClick={clearInput} style={styles.controlButton}>
                Clear
              </Button>
              <Button onClick={onClose} style={styles.confirmButton}>
                ↵
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Styles
const styles: Record<string, React.CSSProperties> = {
  modalWrapper: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    width: '30%',
    height: '40%'
  },
  modal: {
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.2)'
  },
  keyButton: {
    flex: '1 0 calc(33.33% - 8px)',
    height: '70px',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  controlColumn: {
    display: 'grid',
    width: '30px',
    height: '100%',
    gap: 5,
    marginLeft: '4px'
  },
  controlButton: {
    flex: '1 0 calc(33.33% - 8px)',
    height: '70px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#24908E',
    color: '#fff'
  },
  confirmButton: {
    flex: '1 0 calc(33.33% - 8px)',
    height: '150px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#24908E',
    color: '#fff',
    width: '100%'
  },
  closeButton: {
    position: 'absolute',
    top: '0px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    fontSize: '50px',
    cursor: 'pointer',
    color: '#FFF'
  }
}

export default VirtualNumpad

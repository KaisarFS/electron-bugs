import React, { useEffect, useState } from 'react'

interface VirtualKeyboardProps {
  onChange: (value: string) => void
  onClose: () => void
  targetInput: string
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onChange, onClose, targetInput }) => {
  const [, setInputValue] = useState<Record<string, string>>({})
  const [isShift, setIsShift] = useState<boolean>(false)
  const [isSymbols, setIsSymbols] = useState<boolean>(false)

  useEffect(() => {
    setInputValue((prev) => ({ ...prev, [targetInput]: prev[targetInput] || '' }))
  }, [targetInput])

  const handleKeyPress = (key: string) => {
    const newKey = isShift ? key.toUpperCase() : key
    setInputValue((prev) => {
      const newValue = (prev[targetInput] || '') + newKey
      onChange(newValue)
      return { ...prev, [targetInput]: newValue }
    })
    setIsShift(false)
  }

  const handleBackspace = () => {
    setInputValue((prev) => {
      const newValue = (prev[targetInput] || '').slice(0, -1)
      onChange(newValue)
      return { ...prev, [targetInput]: newValue }
    })
  }

  const handleShift = () => {
    setIsShift(!isShift)
  }

  const handleSymbols = () => {
    setIsSymbols(!isSymbols)
  }

  return (
    <div style={styles.modalWrapper}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeButton}>
          &times;
        </button>

        {isSymbols ? (
          <div>
            <div style={styles.rowSymbol}>
              {'!@#$%^&*()_+-={}[]:;"\'<>?,./|\\'.split('').map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  style={styles.keyButtonSymbol}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div style={styles.row}>
              {'1234567890'.split('').map((key) => (
                <button key={key} onClick={() => handleKeyPress(key)} style={styles.keyButton}>
                  {key}
                </button>
              ))}
            </div>
            <div style={styles.row}>
              {'qwertyuiop'.split('').map((key) => (
                <button key={key} onClick={() => handleKeyPress(key)} style={styles.keyButton}>
                  {isShift ? key.toUpperCase() : key}
                </button>
              ))}
            </div>
            <div style={styles.row}>
              {'asdfghjkl'.split('').map((key) => (
                <button key={key} onClick={() => handleKeyPress(key)} style={styles.keyButton}>
                  {isShift ? key.toUpperCase() : key}
                </button>
              ))}
            </div>
            <div style={styles.row}>
              <button onClick={handleShift} style={styles.shiftButton}>
                ⇧
              </button>
              {'zxcvbnm'.split('').map((key) => (
                <button key={key} onClick={() => handleKeyPress(key)} style={styles.keyButton}>
                  {isShift ? key.toUpperCase() : key}
                </button>
              ))}
              <button onClick={handleBackspace} style={styles.backspaceButton}>
                ⌫
              </button>
            </div>
          </div>
        )}
        <div style={styles.row}>
          <button onClick={handleSymbols} style={styles.symbolsButton}>
            {isSymbols ? 'ABC' : '#+='}
          </button>
          <button onClick={() => handleKeyPress(' ')} style={styles.spaceButton}>
            Space
          </button>
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
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    display: 'flex',
    justifyContent: 'center'
  },
  modal: {
    backgroundColor: '#fff',
    width: '100%',
    padding: '10px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    paddingTop: '60px'
  },
  closeButton: {
    position: 'absolute',
    top: '0px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    fontSize: '50px',
    cursor: 'pointer'
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '5px'
  },
  rowSymbol: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    padding: '20px',
    width: '100%',
    maxWidth: '890px',
    margin: '0 auto'
  },
  keyButton: {
    width: '80px',
    height: '50px',
    margin: '2px',
    backgroundColor: '#eee',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  spaceButton: {
    width: '300px',
    height: '50px',
    margin: '2px',
    backgroundColor: '#ddd',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  backspaceButton: {
    width: '80px',
    height: '50px',
    margin: '2px',
    backgroundColor: '#ff7f7f',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  shiftButton: {
    width: '80px',
    height: '50px',
    margin: '2px',
    backgroundColor: '#87CEEB',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  symbolsButton: {
    width: '50px',
    height: '50px',
    margin: '2px',
    backgroundColor: '#D3D3D3',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  keyButtonSymbol: {
    width: '70px',
    height: '50px',
    fontSize: '18px',
    textAlign: 'center',
    border: '1px solid #ccc',
    borderRadius: '5px',
    background: '#f5f5f5',
    cursor: 'pointer'
  }
}

export default VirtualKeyboard

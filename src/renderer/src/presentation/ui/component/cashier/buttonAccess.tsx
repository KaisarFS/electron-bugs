import React, { useEffect } from 'react'

type ButtonAccessProps = {
  dataKeyboard: {
    label: string
    color: string
    textColor: string
    onAction: () => void
  }[]
}

const ButtonAccess: React.FC<ButtonAccessProps> = ({ dataKeyboard }) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key.startsWith('F')) {
      const matchedButton = dataKeyboard.find((button) => button.label.startsWith(event.key))

      if (matchedButton) {
        matchedButton.onAction()
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [dataKeyboard])

  return (
    <>
      <div
        style={{
          alignSelf: 'flex-end',
          marginTop: '2vh',
          display: 'grid',
          gridTemplateColumns: 'repeat(9, 1fr)',
          gap: 10
        }}
      >
        {dataKeyboard.map((button, index) => (
          <button
            key={index}
            onClick={button.onAction}
            style={{
              color: button.textColor,
              width: '100%',
              flex: 1,
              maxWidth: '100%',
              height: 61,
              fontSize: 12,
              fontWeight: '400',
              background: button.color,
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: '#B3C6D4',
              whiteSpace: 'pre-wrap' // Allow multiline text
            }}
          >
            {button.label}
          </button>
        ))}
      </div>
    </>
  )
}

export default ButtonAccess

import { ConfigProvider } from 'antd'
import React from 'react'

interface Props {
  children: React.ReactNode
}

const Theme: React.FC<Props> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1da57a'
        }
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default Theme

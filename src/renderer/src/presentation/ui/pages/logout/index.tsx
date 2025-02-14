import { Button, Modal } from 'antd'
import { useEffect } from 'react'

function LogoutPage() {
  const [modal, contextHolder] = Modal.useModal()

  useEffect(() => {
    // Membuka modal saat pertama kali render
    modal.confirm({
      title: 'Apakah kamu yakin ingin keluar?',
      cancelText: 'Tidak',
      okText: 'Keluar'
    })
  }, [modal])

  return (
    <div>
      <Button
        onClick={() => {
          modal.confirm({
            title: 'Apakah kamu yakin ingin keluar?',
            cancelText: 'Tidak',
            okText: 'Keluar'
          })
        }}
      >
        Confirm
      </Button>
      {contextHolder}
    </div>
  )
}

export default LogoutPage

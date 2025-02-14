import React from 'react'
import { Modal, Button, Typography } from 'antd'
import WarningIcon from '../../../../../../../resources/warning-circle-outline.svg'
import '@renderer/index.css'
const { Title } = Typography

interface NewMemberProps {
  isModalOpen: boolean
  closeModal: () => void
  isSuccess: boolean
  registerNewMember: (values: { phone: string; gender: string }) => void
  phone: string
  gender: string
  loading: boolean
}

const NewMember: React.FC<NewMemberProps> = ({
  isModalOpen,
  closeModal,
  isSuccess,
  registerNewMember,
  phone,
  gender,
  loading
}) => {
  return (
    <Modal
      open={isModalOpen}
      footer={null}
      onCancel={closeModal}
      centered
      width={400}
      closeIcon={false}
    >
      <Title style={{ marginTop: 0 }} level={4}>
        {isSuccess ? 'Peringatan!' : 'Member'}
      </Title>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <img src={WarningIcon} alt="" style={{ height: '24px' }} />
          <p style={{ margin: 0, marginLeft: '8px' }}>
            Nomor yang anda masukan belum terdaftar sebagai member!
          </p>
        </div>
      </div>

      {/* previously for conditional rendering */}
      {/* <div>
          <div style={{ display: 'flex', justifyContent: 'start' }}>
            <img src={ChecklistIcon} alt="" style={{ height: '24px' }} />
            <p style={{ margin: 0, marginLeft: '8px' }}>Nomor sudah terdaftar sebagai member!</p>
          </div>
        </div> */}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        {isSuccess && (
          <Button
            style={{
              height: 40,
              flex: 1,
              backgroundColor: '#D7EFEF',
              borderColor: '#106C6B',
              color: '#fff',
              borderRadius: '8px'
            }}
          >
            Tutup
          </Button>
        )}
        <Button
          style={{
            marginLeft: 10,
            height: 40,
            flex: 1,
            backgroundColor: '#D7EFEF',
            borderColor: 'transparent',
            color: '#106C6B',
            borderRadius: '8px'
          }}
          onClick={() => {
            registerNewMember({ phone, gender })
          }}
          loading={loading}
        >
          Daftarkan
        </Button>
      </div>
    </Modal>
  )
}

export default NewMember

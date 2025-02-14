import React, { useState } from 'react'
import { Modal, Button, Row, Col, Typography, Divider } from 'antd'
import { TblPaymentShortcut } from '@renderer/domain/payment-shortcut/entity/payment-shortcut.entity'

interface EDCProps {
  isVisible: boolean
  onCancel: () => void
  payShortcut: TblPaymentShortcut[]
  selectedPaymentShortcut: (paymentType: number) => void
  payShortcutSelected: TblPaymentShortcut
}

const EDC: React.FC<EDCProps> = ({
  isVisible,
  onCancel,
  payShortcut,
  selectedPaymentShortcut,
  payShortcutSelected
}) => {
  // Filter hanya untuk Mandiri dan BNI dari payShortcut
  const edcOptions = payShortcut
    .filter((option) => option.groupName === 'EDC')
    .sort((a, b) => a.sort - b.sort)
    .map((option) => ({
      id: option.id,
      shortcutName: option.shortcutName,
      groupName: option.groupName,
      sort: option.sort,
      dineInTax: option.dineInTax,
      memberId: option.memberId,
      sellPrice: option.sellPrice,
      typeCode: option.typeCode,
      paymentOptionId: option.paymentOptionId,
      machine: option.machine,
      bank: option.bank,
      cardNameRequired: option.cardNameRequired,
      cardNoRequired: option.cardNoRequired,
      consignmentPaymentType: option.consignmentPaymentType,
      logo: option.typeCode === 'MND' ? '/path-to-mandiri-logo.png' : '/path-to-bni-logo.png'
    }))

  return (
    <Modal open={isVisible} title="Pilih EDC" footer={null} onCancel={onCancel} centered>
      <Divider />
      <Row gutter={[16, 16]} justify="center" style={{ display: 'flex', flexWrap: 'wrap' }}>
        {edcOptions.map((edc, index) => (
          <Col
            key={edc.id}
            // span={4}
            // xs={12}
            // sm={8}
            // md={6}
            lg={6}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              onClick={() => {
                selectedPaymentShortcut(edc.id)
                onCancel()
              }}
              style={{
                width: 160,
                height: 75,
                // padding: '30px 60px',
                borderRadius: 12,
                border:
                  payShortcutSelected.shortcutName === edc.shortcutName
                    ? '1px solid #106C6B'
                    : '1px solid #E0E0E0',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow:
                  payShortcutSelected.shortcutName === edc.shortcutName
                    ? '0px 4px 10px rgba(0, 0, 0, 0.1)'
                    : 'none'
              }}
            >
              <span>{edc.shortcutName}</span>
            </Button>
          </Col>
        ))}
      </Row>
    </Modal>
  )
}

export default EDC

import React, { useState } from 'react'
import { Modal, Button, Input, Row, Col, Table, Typography, Divider, Form } from 'antd'
import { VoucherInterface } from '../../../entity/voucher.entity'
import { getMember } from '../../helper/userHelper'
import { useDispatch } from 'react-redux'
import { TblPaymentShortcut } from '@renderer/domain/payment-shortcut/entity/payment-shortcut.entity'

const { Text, Title } = Typography

interface TableData {
  type: string
  amount: string
}

const keypadNumbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '00']

interface PaymentPageProps {
  visible: boolean
  onClose: () => void
  totalPrice: string
  payShortcutSelected: TblPaymentShortcut
  vouchers: VoucherInterface[]
  onRowClick: (values: { approvalCode: string; cardNo: string }) => void
}

const PaymentPage: React.FC<PaymentPageProps> = ({
  visible,
  onClose,
  totalPrice,
  payShortcutSelected,
  vouchers,
  onRowClick
}) => {
  const [form] = Form.useForm()

  const [cashInput, setCashInput] = useState<string>('')
  const dispatch = useDispatch()

  const tableData: TableData[] = []
  if (vouchers && Array.isArray(vouchers)) {
    vouchers?.forEach((voucher: VoucherInterface) => {
      return tableData.push({
        type: 'V',
        amount: voucher.voucherAmount.toString()
      })
    })
  }

  tableData.push({
    type: payShortcutSelected.typeCode,
    amount: totalPrice.toString()
  })
  // Kolom untuk tabel
  const tableColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{type ?? 'N/A'}</div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>
          {parseFloat(amount).toLocaleString('id-ID') ?? 'N/A'}
        </div>
      )
    }
  ]

  const components = {
    header: {
      cell: ({ children, className, ...restProps }) => (
        <th
          {...restProps}
          className={className}
          style={{
            backgroundColor: '#106C6B',
            color: '#FFFFFF',
            textAlign: 'center',
            fontWeight: '400',
            padding: '10px'
          }}
        >
          {children}
        </th>
      )
    }
  }

  const handleFinish = (values: { approvalCode: string; cardNo: string }) => {
    console.log('finish payment: ', values)
    getMember(dispatch, 'UMUM')
    onRowClick(values)
    form.resetFields()
  }

  const handleKeypadClick = (value: string | number) => {
    setCashInput(cashInput + value.toString())
  }

  const clearInput = () => {
    setCashInput('')
  }

  const removeLastChar = () => {
    setCashInput(cashInput.slice(0, -1))
  }

  // console.log('cek paymentCosts', JSON.stringify(paymentCosts))
  // console.log('cek paymentCosts', JSON.stringify(paymentEdc))
  // console.log('cek paymentCosts', JSON.stringify(payShortcutSelected))
  return (
    <Modal visible={visible} title="Payment" footer={null} onCancel={onClose} width={'60%'}>
      <Divider />
      <Row gutter={16}>
        {/* Bagian Kiri */}
        <Col span={14}>
          <div
            style={{
              backgroundColor: '#f5f5f5',
              padding: '10px 16px',
              borderRadius: '8px'
            }}
          >
            <Text
              type="secondary"
              style={{
                color: '#028158',
                background: '#C2EDD3',
                borderRadius: 12,
                padding: '2px 12px'
              }}
            >
              Netto
            </Text>
            <Title
              level={3}
              style={{ color: '#000000', marginTop: 8, marginBottom: 0, marginLeft: '5px' }}
            >
              Rp. {parseFloat(totalPrice).toLocaleString('id-ID')}
            </Title>
          </div>

          <Table
            style={{
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 10,
              borderColor: '#C4CDD6',
              overflow: 'scroll',
              height: '50vh',
              maxHeight: '50vh',
              marginTop: 53
            }}
            rowClassName={(_, index) => (index % 2 !== 0 ? 'even-row' : '')}
            dataSource={tableData}
            columns={tableColumns}
            components={components}
            pagination={false}
            rowKey="key"
            scroll={{ x: 'max-content', y: 'max-content' }}
            sticky={true}
            bordered={true}
          />
          <div
            style={{
              marginTop: 20,
              padding: '4px 12px',
              background: '#106C6B',
              textAlign: 'center',
              fontSize: 15,
              color: '#FFF',
              fontWeight: '400',
              borderRadius: 10
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p>Kembali</p>
              <p
                style={{
                  fontWeight: '700'
                }}
              >
                Rp 10000
              </p>
            </div>
          </div>
        </Col>

        <Col span={10} style={{ paddingLeft: 41 }}>
          <Form
            layout="horizontal"
            labelAlign={'left'}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            form={form}
            onFinish={handleFinish}
          >
            <Form.Item
              label="Aproval Code"
              name="approvalCode"
              rules={[{ required: true, message: 'Must be Fill!' }]}
            >
              <Input
                placeholder="-"
                style={{
                  borderRadius: 10,
                  height: 40
                }}
              />
            </Form.Item>

            <Form.Item
              label="Card No"
              name="cardNo"
              rules={[{ required: !!payShortcutSelected.cardNoRequired, message: 'Must be Fill' }]}
            >
              <Input
                placeholder="-"
                style={{
                  borderRadius: 10,
                  height: 40
                }}
              />
            </Form.Item>
          </Form>

          <div
            style={{
              // height: 'full',
              height: '50vh',
              maxHeight: '50vh',
              marginTop: 33
            }}
          >
            <div
              style={{
                borderRadius: '8px',
                marginBottom: '16px',
                flex: 1
              }}
            >
              <div
                style={{
                  backgroundColor: '#DCEDED',
                  padding: '16px',
                  borderRadius: 14,
                  marginBottom: 11
                  // width: '74%'
                }}
              >
                <Text strong style={{ marginLeft: 10 }}>
                  Uang Tunai
                </Text>
                <Input
                  placeholder="Masukan Nominal"
                  value={cashInput}
                  style={{
                    marginTop: '18px',
                    fontSize: '16px',
                    height: '58px',
                    borderRadius: 10
                  }}
                  readOnly
                />
              </div>
              <div style={{ display: 'flex', width: '33vh' }}>
                {/* Numpad */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {keypadNumbers.map((num) => (
                    <Button
                      key={num}
                      onClick={() => handleKeypadClick(num)}
                      style={{
                        flex: '1 0 calc(33.33% - 8px)',
                        height: '66px',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
                <div
                  style={{
                    display: 'grid',
                    width: '30px',
                    height: '100%',
                    gap: '4px',
                    marginLeft: '4px'
                  }}
                >
                  <Button
                    onClick={removeLastChar}
                    style={{
                      flex: '1 0 calc(33.33% - 8px)',
                      height: '68px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      backgroundColor: '#24908E',
                      color: '#fff'
                    }}
                  >
                    ⌫
                  </Button>
                  <Button
                    onClick={clearInput}
                    style={{
                      flex: '1 0 calc(33.33% - 8px)',
                      height: '68px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      backgroundColor: '#24908E',
                      color: '#fff'
                    }}
                  >
                    Clear
                  </Button>
                  <div>
                    <Button
                      onClick={() => console.log('Confirm pressed')}
                      style={{
                        flex: '1 0 calc(33.33% - 8px)',
                        height: '68px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        backgroundColor: '#24908E',
                        color: '#fff',
                        paddingBottom: '65px',
                        justifyItems: 'center',
                        paddingTop: '65px',
                        width: '100%'
                      }}
                    >
                      ↵
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="primary"
            block
            onClick={() => form.submit()}
            style={{
              marginTop: 20,
              padding: '30px',
              background: '#DC3A87',
              fontWeight: 700,
              fontSize: '20px',
              borderRadius: 10
            }}
          >
            Process
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default PaymentPage

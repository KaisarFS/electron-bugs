import React, { useEffect, useState } from 'react'
import { Modal, Table, Card } from 'antd'
import { TransactionHistory } from '@renderer/redux/store/slices/cashierSlice'

interface TransactionHistoryPageProps {
  visible: boolean
  onClose: () => void
  transactionHistory: TransactionHistory[]
}

const TransactionsHistory: React.FC<TransactionHistoryPageProps> = ({
  visible,
  onClose,
  transactionHistory
}) => {
  const [transactionsHistory, setTransactionsHistory] = useState(transactionHistory)

  useEffect(() => {
    setTransactionsHistory(transactionHistory)
  }, [transactionHistory])

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      className: 'green-text',
      width: '25%',
      render: (invoiceNumber: number) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{invoiceNumber ?? 'N/A'}</div>
      )
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      className: 'green-text',
      width: '25%',
      render: (reference: string) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{reference ?? 'N/A'}</div>
      )
    },
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate',
      className: 'green-text',
      width: '25%',
      render: (transDate: string) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{transDate ?? 'N/A'}</div>
      )
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      className: 'green-text',
      width: '25%',
      render: (totalAmount: number) => (
        <div style={{ textAlign: 'center', color: '#000000' }}>{totalAmount ?? 'N/A'}</div>
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
            fontWeight: 'bold',
            padding: '10px'
          }}
        >
          {children}
        </th>
      )
    }
  }

  return (
    <Modal
      visible={visible}
      title="Latest Transaction"
      footer={null}
      onCancel={onClose}
      width={'95%'}
    >
      <Card style={{ border: 'none' }}>
        <Table
          style={{
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 10,
            borderColor: '#C4CDD6'
          }}
          bordered={true}
          rowClassName={(_, index) => (index % 2 !== 0 ? 'even-row' : '')}
          dataSource={transactionsHistory}
          columns={columns}
          components={components}
          rowKey={(record) => record.invoiceNumber}
          // scroll={{ x: 1290, y: 500 }}
          pagination={{
            pageSize: 10,
            total: transactionsHistory.length,
            position: ['bottomCenter'],
            showSizeChanger: false,
            showQuickJumper: true
          }}
          onRow={() => ({
            onClick: () => {
              setTransactionsHistory([])
            }
          })}
        />
      </Card>
    </Modal>
  )
}

export default TransactionsHistory

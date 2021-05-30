import { Button, Descriptions, List, Modal, Table } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

import { Logger } from '../../shared/logger'
import { useApiClient } from '../api/api-client'
import { OrderListItem } from '../api/graphql-queries'

const columns = [
  {
    title: 'Číslo',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: 'Vytvořeno',
    dataIndex: 'dateCreated',
    key: 'dateCreated',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
]

export const Orders = () => {
  const [rows, setRows] = useState<OrderListItem[]>([])
  const [modalOpened, setModalOpened] = useState(false)
  const [modalContext, setModalContext] = useState<OrderListItem | null>(null)

  const apiClient = useApiClient()

  const handleOk = () => {
    setModalOpened(false)
  }

  const handleCancel = () => {
    setModalOpened(false)
  }

  useEffect(() => {
    apiClient.getOrders().then((result) => {
      Logger.debug(result.data.orders)
      setRows(result.data.orders)
    })
  }, [apiClient])

  return (
    <div
      style={{
        padding: 25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        overflow: 'auto',
        height: '100%',
      }}
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={rows}
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
        pagination={false}
        sticky={true}
        onRow={(record: OrderListItem) => {
          return {
            onClick: () => {
              setModalOpened(true)
              setModalContext(record)
            },
          }
        }}
      />
      <Modal
        title={`Order ${modalContext?.number}`}
        visible={modalOpened}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        width={700}
        bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
        footer={
          <>
            <Button key="back" type="primary" onClick={handleCancel}>
              Ok
            </Button>
          </>
        }
      >
        <Descriptions bordered size="small" column={1}>
          <Descriptions.Item label="Číslo">
            {modalContext?.number}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {modalContext?.status}
          </Descriptions.Item>
          <Descriptions.Item label="Vytvořeno">
            {moment(modalContext?.dateCreated).format('LLL')}
          </Descriptions.Item>
        </Descriptions>
        <List
          itemLayout="horizontal"
          dataSource={modalContext?.lineItems}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<a>{item.name}</a>}
                description={`Množství ${
                  item.quantity
                }x, Kategorie ${item.product.categories
                  .map((cat) => cat.name)
                  .join(', ')}`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  )
}

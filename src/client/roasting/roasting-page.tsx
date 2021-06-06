import { Button, Descriptions, List, Modal, Table } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'

import { RoastingListItem, OrderListItem } from '../api/graphql-queries'

const orderColumns = [
  {
    title: 'Číslo',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: 'Vytvořeno',
    dataIndex: 'dateCreated',
    key: 'dateCreated',
    render: (dateCreated: string) => (
      <span>{moment(dateCreated).format('LLL')}</span>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },

  {
    title: 'Zařazen do pražení',
    dataIndex: 'roastingId',
    key: 'roastingId',
    render: (roastingId: string) => <span>{roastingId ? `Ano` : ``}</span>,
  },
]

const OrdersList = (props: { orders: OrderListItem[] }) => {
  const { orders } = props

  const [opened, setOpened] = useState(false)
  const [order, setOrder] = useState<OrderListItem | null>(null)

  const onOk = () => {
    setOpened(false)
  }

  const onCancel = () => {
    setOpened(false)
  }

  return (
    <>
      <Table
        rowKey="id"
        columns={orderColumns}
        dataSource={orders || []}
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
        pagination={false}
        sticky={true}
        onRow={(record: OrderListItem) => {
          return {
            onClick: () => {
              setOpened(true)
              setOrder(record)
            },
          }
        }}
      />
      {order && (
        <Modal
          title={`Order ${order?.number}`}
          visible={opened}
          onOk={onOk}
          onCancel={onCancel}
          centered
          width={700}
          bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
          footer={
            <>
              <Button key="back" type="primary" onClick={onCancel}>
                Ok
              </Button>
            </>
          }
        >
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Číslo">{order.number}</Descriptions.Item>
            <Descriptions.Item label="Status">{order.status}</Descriptions.Item>
            <Descriptions.Item label="Vytvořeno">
              {moment(order.dateCreated).format('LLL')}
            </Descriptions.Item>
          </Descriptions>
          <List
            itemLayout="horizontal"
            dataSource={order.lineItems}
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
      )}
    </>
  )
}

export const ActiveRoasting = (props: {
  roasting: RoastingListItem | null
  onClosePlanning: () => void
  onFinishRoasting: () => void
}) => {
  const { roasting, onClosePlanning, onFinishRoasting } = props

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      {!roasting && (
        <Button
          type="primary"
          style={{
            marginBottom: 16,
            alignSelf: 'flex-end',
            position: 'absolute',
            top: -50,
          }}
          onClick={onClosePlanning}
        >
          Close Planning
        </Button>
      )}
      {roasting && (
        <>
          <Button
            type="primary"
            danger
            style={{
              marginBottom: 16,
              alignSelf: 'flex-end',
              position: 'absolute',
              top: -50,
            }}
            onClick={onFinishRoasting}
          >
            Finish Roasting
          </Button>
          <Descriptions
            bordered
            size="small"
            column={1}
            style={{ background: 'white', marginBottom: 25 }}
          >
            {roasting?.roastedCoffee.map((item) => {
              return (
                <Descriptions.Item label={item.name} key={item.id}>
                  {`${Math.ceil(item.numberOfBatches)}`}
                </Descriptions.Item>
              )
            })}
          </Descriptions>
          <OrdersList orders={roasting.orders} />
        </>
      )}
    </div>
  )
}

export const PlannedRoasting = (props: { roasting: RoastingListItem }) => {
  const { roasting } = props

  return (
    <div style={{}}>
      <Descriptions
        bordered
        size="small"
        column={1}
        style={{ background: 'white', marginBottom: 25 }}
      >
        {roasting?.roastedCoffee.map((item) => {
          return (
            <Descriptions.Item label={item.name} key={item.id}>
              {`${Math.ceil(item.numberOfBatches)}`}
            </Descriptions.Item>
          )
        })}
      </Descriptions>

      <OrdersList orders={roasting.orders} />
    </div>
  )
}

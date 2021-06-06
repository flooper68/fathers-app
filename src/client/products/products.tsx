import { Button, Card, Descriptions, Modal, Table } from 'antd'
import Meta from 'antd/lib/card/Meta'
import React, { useEffect, useState } from 'react'

import { useApiClient } from '../api/api-client'
import { ProductListItem } from '../api/graphql-queries'

const columns = [
  {
    title: 'Produkt Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Název',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Pražení',
    dataIndex: 'roastedCoffee',
    key: 'roastedCoffee',
    render: (item: { name?: string }) => <span>{item?.name}</span>,
  },
  {
    title: 'Variace',
    dataIndex: 'variations',
    key: 'variations',
    render: (variations: { weight: string }[]) => (
      <span>
        {variations
          .filter((item) => !!item.weight)
          .map((item) => `${item.weight} kg`)
          .join(', ')}
      </span>
    ),
  },
]

export const Products = (props: { syncInProgress: boolean }) => {
  const { syncInProgress } = props

  const [rows, setRows] = useState<ProductListItem[]>([])
  const [modalOpened, setModalOpened] = useState(false)
  const [modalContext, setModalContext] = useState<ProductListItem | null>(null)

  const apiClient = useApiClient()

  const handleOk = () => {
    setModalOpened(false)
  }

  const handleCancel = () => {
    setModalOpened(false)
  }

  useEffect(() => {
    apiClient.getProducts().then((result) => {
      setRows(result.data.products)
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: `100%`,
        }}
      >
        <span>{syncInProgress && `Syncing...`}</span>
        <Button
          type="primary"
          danger
          onClick={apiClient.syncProducts}
          style={{ marginBottom: 16, alignSelf: 'flex-end' }}
        >
          Synchronizovat
        </Button>
      </div>

      <Table
        onRow={(record: ProductListItem) => {
          return {
            onClick: () => {
              setModalOpened(true)
              setModalContext(record)
            },
          }
        }}
        rowKey="id"
        columns={columns}
        dataSource={rows}
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
        pagination={false}
        sticky={true}
      />

      <Modal
        title={`Detail ${modalContext?.name}`}
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
          <Descriptions.Item label="Id">{modalContext?.id}</Descriptions.Item>
          <Descriptions.Item label="Název">
            {modalContext?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Popis">
            <div
              dangerouslySetInnerHTML={{
                __html: modalContext?.shortDescription || '',
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Změněno">
            {modalContext?.dateModified}
          </Descriptions.Item>
          <Descriptions.Item label="Kategorie">
            {modalContext?.categories.map((item) => item.name).join(', ')}
          </Descriptions.Item>
        </Descriptions>
        {modalContext?.images.map((item, index) => {
          return (
            <Card
              key={item.id + index}
              hoverable
              style={{ margin: '25px 0' }}
              cover={<img alt="example" src={item.src} />}
            >
              <Meta title={item.name} />
            </Card>
          )
        })}
      </Modal>
    </div>
  )
}

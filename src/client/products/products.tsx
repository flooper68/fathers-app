import { Button, Card, Descriptions, Modal, Table } from 'antd'
import Meta from 'antd/lib/card/Meta'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

import { Logger } from '../../shared/logger'
import { Product } from '../../shared/types/product'
import { useApiClient } from '../api/api-client'

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
    title: 'Cena',
    dataIndex: 'price',
    key: 'price',
    render: (price: string) => <span>{`${price} Kč`}</span>,
  },
  {
    title: 'Kategorie',
    dataIndex: 'categories',
    key: 'categories',
    render: (categories: { name: string }[]) => (
      <span>{categories.map((item) => item.name).join(', ')}</span>
    ),
  },
  {
    title: 'Změněno',
    dataIndex: 'dateModified',
    key: 'dateModified',
    render: (text: string) => <span>{moment(text).format('LLLL')}</span>,
  },
]

export const Products = () => {
  const [rows, setRows] = useState<any>([])
  const [modalOpened, setModalOpened] = useState(false)
  const [modalContext, setModalContext] = useState<Product | null>(null)

  const apiClient = useApiClient()

  useEffect(() => {
    apiClient.getProducts().then((result) => {
      Logger.debug(result.data.products)
      setRows(result.data.products)
    })
  }, [apiClient])

  const handleOk = () => {
    setModalOpened(false)
  }

  const handleCancel = () => {
    setModalOpened(false)
  }

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
        onRow={(record: Product) => {
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
          <Descriptions.Item label="Cena">
            {modalContext?.price}
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

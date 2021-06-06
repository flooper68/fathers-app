import { Button, Descriptions, List, Modal, Table } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'

import { RoastingStatus } from '../../shared/types/roasting'
import { RoastingListItem } from '../api/graphql-queries'

const RoastingStatusCopywritingMap = {
  [RoastingStatus.FINISHED]: 'Dokončeno',
  [RoastingStatus.IN_PLANNING]: 'Plánováno',
  [RoastingStatus.IN_PROGRESS]: 'Probíhá',
}

const columns = [
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: RoastingStatus) => (
      <span>{RoastingStatusCopywritingMap[status]}</span>
    ),
  },
  {
    title: 'Váha',
    dataIndex: 'totalWeight',
    key: 'totalWeight',
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
    title: 'Ukončeno plánování',
    dataIndex: 'datePlanningClosed',
    key: 'datePlanningClosed',
    render: (datePlanningClosed?: string) => (
      <span>
        {datePlanningClosed && moment(datePlanningClosed).format('LLL')}
      </span>
    ),
  },
  {
    title: 'Dokončeno',
    dataIndex: 'dateFinished',
    key: 'dateFinished',
    render: (dateFinished?: string) => (
      <span>{dateFinished && moment(dateFinished).format('LLL')}</span>
    ),
  },
]

export const RoastingsList = (props: { roastings: RoastingListItem[] }) => {
  const { roastings } = props

  const [modalOpened, setModalOpened] = useState(false)
  const [modalContext, setModalContext] = useState<RoastingListItem | null>(
    null
  )

  const handleOk = () => {
    setModalOpened(false)
  }

  const handleCancel = () => {
    setModalOpened(false)
  }

  return (
    <div>
      <Table
        onRow={(record: RoastingListItem) => {
          return {
            onClick: () => {
              setModalOpened(true)
              setModalContext(record)
            },
          }
        }}
        rowKey="id"
        columns={columns}
        dataSource={roastings}
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
        pagination={false}
        sticky={true}
      />

      <Modal
        title={`Pražení ${modalContext?.id}`}
        visible={modalOpened}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        width={`80vw`}
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
          <Descriptions.Item label="Status">
            {modalContext?.status}
          </Descriptions.Item>
        </Descriptions>
        <h2>Green coffee</h2>
        <List
          itemLayout="horizontal"
          dataSource={modalContext?.greenCoffee}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<a>{item.name}</a>}
                description={`Množství ${item.weight.toFixed(2)} kg`}
              />
            </List.Item>
          )}
        />
        <h2>Roasted coffee</h2>
        <List
          itemLayout="horizontal"
          dataSource={modalContext?.roastedCoffee}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<a>{item.name}</a>}
                description={`Množství ${item.weight.toFixed(
                  2
                )} kg, #batche ${Math.ceil(item.numberOfBatches)}`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  )
}

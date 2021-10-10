import { Table, Modal, Button, Descriptions, List } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

import { OrderListItem } from '../../api/queries/get-orders-query';

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
];

export const RoastingOrdersList = (props: { orders: OrderListItem[] }) => {
  const { orders } = props;

  const [opened, setOpened] = useState(false);
  const [order, setOrder] = useState<OrderListItem | null>(null);

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
              setOpened(true);
              setOrder(record);
            },
          };
        }}
      />
      {order && (
        <Modal
          title={`Objednávka číslo ${order?.number}`}
          visible={opened}
          onOk={() => setOpened(false)}
          onCancel={() => setOpened(false)}
          centered
          width={700}
          bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
          footer={
            <>
              <Button
                key="back"
                type="primary"
                onClick={() => setOpened(false)}
              >
                Ok
              </Button>
            </>
          }
        >
          <Descriptions
            bordered
            size="small"
            column={1}
            style={{ marginBottom: 25 }}
          >
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
                  description={`Množství ${item.quantity}x`}
                />
              </List.Item>
            )}
          />
        </Modal>
      )}
    </>
  );
};

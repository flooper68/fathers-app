import { Button, Descriptions, List, Modal, Table, DatePicker } from 'antd';
import moment from 'moment';
import React, { useCallback, useState } from 'react';

import { RoastingStatus } from '../../../shared/types/roasting';
import { RoastingListItem } from '../../api/queries/get-roastings-query';

const RoastingStatusCopywritingMap = {
  [RoastingStatus.FINISHED]: 'Dokončeno',
  [RoastingStatus.IN_PLANNING]: 'Plánováno',
  [RoastingStatus.IN_PROGRESS]: 'Probíhá',
};

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
    title: 'Datum',
    dataIndex: 'roastingDate',
    key: 'roastingDate',
    render: (roastingDate: string) => (
      <span>{moment(roastingDate).format('LLL')}</span>
    ),
  },
];

export const RoastingsList = (props: {
  roastings: RoastingListItem[];
  onCreateRoasting: (date: string) => void;
}) => {
  const { roastings, onCreateRoasting } = props;

  const [createDate, setCreateDate] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [modalContext, setModalContext] = useState<RoastingListItem | null>(
    null
  );

  const createRoasting = useCallback(() => {
    if (!createDate) {
      throw new Error(`Missing roasting date for new roasting`);
    }
    onCreateRoasting(createDate);
    setCreateModalOpened(false);
  }, [onCreateRoasting, createDate]);

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setCreateModalOpened(true)}
      >
        Nové pražení
      </Button>

      <Table
        onRow={(record: RoastingListItem) => {
          return {
            onClick: () => {
              setModalOpened(true);
              setModalContext(record);
            },
          };
        }}
        rowKey="id"
        columns={columns}
        dataSource={roastings}
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
        pagination={false}
        sticky={true}
      />

      <Modal
        title={`Vytvořit nové pražení`}
        visible={createModalOpened}
        onOk={() => setCreateModalOpened(false)}
        onCancel={() => setCreateModalOpened(false)}
        centered
        footer={
          <>
            <Button
              key="back"
              type="primary"
              disabled={!createDate}
              onClick={createRoasting}
            >
              Ok
            </Button>
          </>
        }
      >
        <DatePicker
          placeholder="Vybrat datum"
          style={{ width: 300 }}
          onChange={(value) => setCreateDate(value?.toISOString() || null)}
        />
      </Modal>

      <Modal
        title={`Pražení ${moment(modalContext?.roastingDate).format('LL')}`}
        visible={modalOpened}
        onOk={() => setModalOpened(false)}
        onCancel={() => setModalOpened(false)}
        centered
        width={`80vw`}
        bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
        footer={
          <>
            <Button
              key="back"
              type="primary"
              onClick={() => setModalOpened(false)}
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
          <Descriptions.Item label="Status">
            {modalContext?.status &&
              RoastingStatusCopywritingMap[modalContext?.status]}
          </Descriptions.Item>
        </Descriptions>
        <h3>Pražená káva</h3>
        <List
          itemLayout="horizontal"
          dataSource={modalContext?.roastedCoffee.filter(
            (item) => !!item.numberOfBatches
          )}
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
  );
};

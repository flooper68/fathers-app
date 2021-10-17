import { Table } from 'antd';
import React, { useEffect, useState } from 'react';

import { useApiClient } from '../../api/api-client';
import { GreenCoffeeListItem } from '../../api/queries/get-green-coffee-query';
import { useAppDispatch } from '../../store';
import { GreenCoffeeFormModal } from './green-coffee-modal';

const columns = [
  {
    title: 'Název',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Hmotnost Batche (kg)',
    dataIndex: 'batchWeight',
    key: 'batchWeight',
  },
  {
    title: 'Výtěžnost pražení',
    dataIndex: 'roastingLossFactor',
    key: 'roastingLossFactor',
  },
];

export const GreenCoffee = (props: {
  modalOpened: boolean;
  onModalClose: () => void;
  onOpenModal: () => void;
}) => {
  const [loadingKey, setLoadingKey] = useState(0);
  const [rows, setRows] = useState<GreenCoffeeListItem[]>([]);
  const [modalContext, setModalContext] = useState<GreenCoffeeListItem | null>(
    null
  );

  const { getGreenCoffees } = useApiClient();
  const dispatch = useAppDispatch();

  const onModalOpen = (record: GreenCoffeeListItem) => {
    props.onOpenModal();
    setModalContext(record);
  };

  const onModalClose = () => {
    props.onModalClose();
    setModalContext(null);
    setLoadingKey((state) => ++state);
  };

  useEffect(() => {
    getGreenCoffees().then((result) => {
      setRows(result.data.greenCoffees);
    });
  }, [getGreenCoffees, dispatch, loadingKey]);

  return (
    <>
      <div
        style={{
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
        ></div>

        <Table
          onRow={(record) => {
            return {
              onClick: () => {
                onModalOpen(record);
              },
            };
          }}
          rowKey="id"
          columns={columns}
          dataSource={rows}
          style={{ width: '100%', height: '100%', overflow: 'auto' }}
          pagination={false}
          sticky={true}
        />
      </div>
      {props.modalOpened && (
        <GreenCoffeeFormModal
          id={modalContext?.id}
          onClose={onModalClose}
          initialValues={modalContext || undefined}
          isEditing={!!modalContext}
        />
      )}
    </>
  );
};

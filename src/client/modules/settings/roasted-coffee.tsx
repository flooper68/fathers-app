import { Table } from 'antd';
import React, { useEffect, useState } from 'react';

import { useApiClient } from '../../api/api-client';
import { GreenCoffeeListItem } from '../../api/queries/get-green-coffee-query';
import { ProductListItem } from '../../api/queries/get-products-query';
import { RoastedCoffeeListItem } from '../../api/queries/get-roasted-coffee-query';
import { useAppDispatch } from '../../store';
import { GreenCoffeeFormModal } from './green-coffee-modal';
import { RoastedCoffeeFormModal } from './roasted-coffee-modal';

const columns = [
  {
    title: 'Název',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Zelená káva',
    dataIndex: 'greenCoffeeName',
    key: 'greenCoffeeName',
  },
];

export const RoastedCoffee = (props: {
  modalOpened: boolean;
  onModalClose: () => void;
  onOpenModal: () => void;
}) => {
  const [loadingKey, setLoadingKey] = useState(0);
  const [rows, setRows] = useState<RoastedCoffeeListItem[]>([]);
  const [
    modalContext,
    setModalContext,
  ] = useState<RoastedCoffeeListItem | null>(null);

  const { getRoastedCoffees } = useApiClient();
  const dispatch = useAppDispatch();

  const onModalOpen = (record: RoastedCoffeeListItem) => {
    props.onOpenModal();
    setModalContext(record);
  };

  const onModalClose = () => {
    props.onModalClose();
    setModalContext(null);
    setLoadingKey((state) => ++state);
  };

  useEffect(() => {
    getRoastedCoffees().then((result) => {
      setRows(result.data.roastedCoffees);
    });
  }, [getRoastedCoffees, dispatch, loadingKey]);

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
        <RoastedCoffeeFormModal
          id={modalContext?.id}
          onClose={onModalClose}
          initialValues={modalContext || undefined}
          isEditing={!!modalContext}
        />
      )}
    </>
  );
};

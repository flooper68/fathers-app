import { Button, notification, Space, Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';

import { useApiClient } from '../../api/api-client';
import { WarehouseRoastedCoffeeListItem } from '../../api/queries/get-warehouse-roasted-coffee';
import { ClientLogger } from '../../client-logger';
import { useAppModal } from '../common/use-app-modal';
import { AddWarehouseRoastedCoffeeModal } from './add-roasted-coffee-modal';
import { AdjustWarehouseRoastedCoffeeModal } from './adjust-warehouse-roasted-coffee-modal';
import { TranslateReasonMap } from './type-translation';
import { UseWarehouseRoastedCoffeeModal } from './use-warehouse-roasted-coffee-modal';
import { WarehouseRoastedCoffeeModal } from './warehouse-roasted-coffee-detail';

export const Warehouse = () => {
  const [rows, setRows] = useState<WarehouseRoastedCoffeeListItem[]>([]);

  const { getWarehouseRoastedCoffee } = useApiClient();
  const [open, close, opened, context, loadingKey] =
    useAppModal<WarehouseRoastedCoffeeListItem>();
  const [
    openUseModal,
    closeUseModal,
    openedUseModal,
    contextUseModal,
    loadingKeyUseModal,
  ] = useAppModal<WarehouseRoastedCoffeeListItem>();
  const [
    openDetailModal,
    closeDetailModal,
    openedDetailModal,
    contextDetailModal,
  ] = useAppModal<WarehouseRoastedCoffeeListItem>();
  const [
    openAddModal,
    closeAddModal,
    openedAddModal,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _,
    loadingAddKey,
  ] = useAppModal();

  const columns = useMemo(
    () => [
      {
        title: 'Název',
        dataIndex: 'roastedCoffeeName',
        key: 'roastedCoffeeName',
      },
      {
        title: 'Množství (kg)',
        dataIndex: 'quantityOnHand',
        key: 'quantityOnHand',
        render: (quantityOnHand: number) => (
          <span>{quantityOnHand?.toFixed(2)}</span>
        ),
      },
      {
        title: 'Naposledy aktualizováno',
        dataIndex: 'lastUpdated',
        key: 'lastUpdated',
        render: (lastUpdated: string) => (
          <span>{lastUpdated ? moment(lastUpdated).format('LLL') : ''}</span>
        ),
      },
      {
        title: 'Důvod',
        dataIndex: 'lastUpdateReason',
        key: 'lastUpdateReason',
        render: (lastUpdateReason: string) =>
          TranslateReasonMap[lastUpdateReason],
      },
      {
        title: '',
        render: (coffee: WarehouseRoastedCoffeeListItem) => (
          <span>
            <Space size="middle">
              <a
                type="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  open(coffee);
                }}
              >
                Upravit
              </a>
              <a
                type="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  openUseModal(coffee);
                }}
              >
                Použít
              </a>
            </Space>
          </span>
        ),
      },
    ],
    [open, openUseModal]
  );

  useEffect(() => {
    (async () => {
      try {
        const result = await getWarehouseRoastedCoffee();
        setRows(result.data.warehouseRoastedCoffees);
      } catch (e) {
        notification.error({
          message: 'Chyba při načítání dat',
        });
        ClientLogger.error(`Error loading warehouse roasted coffee list`, e);
      }
    })();
  }, [
    getWarehouseRoastedCoffee,
    loadingKey,
    loadingKeyUseModal,
    loadingAddKey,
  ]);

  return (
    <div style={{ padding: '16px 25px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: `100%`,
        }}
      >
        <span />
        <Button
          onClick={openAddModal}
          style={{ marginBottom: 16, alignSelf: 'flex-end' }}
        >
          Přidat
        </Button>
      </div>
      <Table
        rowKey="roastedCoffeeId"
        columns={columns}
        dataSource={rows}
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
        pagination={false}
        sticky={true}
        onRow={(record: WarehouseRoastedCoffeeListItem) => {
          return {
            onClick: () => {
              openDetailModal(record);
            },
          };
        }}
      />
      {opened && (
        <AdjustWarehouseRoastedCoffeeModal
          onClose={close}
          roastedCoffeeId={context?.roastedCoffeeId}
        />
      )}
      {openedUseModal && (
        <UseWarehouseRoastedCoffeeModal
          onClose={closeUseModal}
          roastedCoffeeId={contextUseModal?.roastedCoffeeId}
        />
      )}
      {openedDetailModal && contextDetailModal && (
        <WarehouseRoastedCoffeeModal
          onClose={closeDetailModal}
          context={contextDetailModal}
        />
      )}
      {openedAddModal && (
        <AddWarehouseRoastedCoffeeModal
          onClose={closeAddModal}
          context={rows}
        />
      )}
    </div>
  );
};

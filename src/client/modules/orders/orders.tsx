import {
  Button,
  Descriptions,
  List,
  Modal,
  Table,
  Select,
  notification,
} from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';

import { RoastingStatus } from '../../../shared/types/roasting';
import { useApiClient } from '../../api/api-client';
import { OrderListItem } from '../../api/queries/get-orders-query';
import { RoastingListItem } from '../../api/queries/get-roastings-query';
import { ClientLogger } from '../../client-logger';

const PAGE_SIZE = 20;

export const Orders = () => {
  const [rows, setRows] = useState<OrderListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [plannnedRoastings, setPlannedRoastings] = useState<RoastingListItem[]>(
    []
  );
  const [modalOpened, setModalOpened] = useState(false);
  const [chooseRoastingModalOpened, setChooseRoastingModalOpened] =
    useState(false);
  const [modalContext, setModalContext] = useState<OrderListItem | null>(null);
  const [selectedRoasting, setSelectedRoasting] = useState<string | null>(null);

  const apiClient = useApiClient();

  const handleOk = useCallback(() => {
    setModalOpened(false);
  }, []);

  const handleCancel = useCallback(() => {
    setModalOpened(false);
  }, []);

  const loadFirstPage = useCallback(() => {
    try {
      apiClient.getOrders(1).then((result) => {
        setRows(result.data.orders.rows);
        setPageCount(result.data.orders.pageCount);
        setCurrentPage(1);
      });
    } catch (e) {
      notification.error({
        message: 'Chyba při načítání dat',
      });
      ClientLogger.error(`Error loading list`, e);
    }
  }, [apiClient]);

  const fetchMore = useCallback(async () => {
    try {
      if (currentPage + 1 > pageCount) {
        return;
      }
      ClientLogger.debug(`Fetching more rows, page ${currentPage + 1}`);
      const result = await apiClient.getOrders(currentPage + 1);
      setRows((state) => [...state, ...result.data.orders.rows]);
      setPageCount(result.data.orders.pageCount);
      setCurrentPage((state) => state + 1);
    } catch (e) {
      notification.error({
        message: 'Chyba při načítání dat',
      });
      ClientLogger.error(`Error loading list`, e);
    }
  }, [apiClient, currentPage, pageCount]);

  const selectRoasting = useCallback(async () => {
    const orderId = modalContext?.id;
    if (!selectedRoasting || !orderId) {
      throw new Error(`Invalid state`);
    }
    try {
      await apiClient.selectOrdersRoasting(selectedRoasting, orderId);
    } catch (e) {
      notification.error({
        message: 'Chyba při ukládání dat',
      });
      ClientLogger.error(`Error adding order to roasting`, e);
    }
    setChooseRoastingModalOpened(false);
    setModalContext(null);
    setSelectedRoasting(null);
    loadFirstPage();
  }, [selectedRoasting, modalContext, apiClient, loadFirstPage]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  useEffect(() => {
    (async () => {
      try {
        const result = await apiClient.getRoastings();
        const planned = result.data.roastings.filter(
          (item) => item.status === RoastingStatus.IN_PLANNING
        );
        setPlannedRoastings(planned);
      } catch (e) {
        notification.error({
          message: 'Chyba při načítání dat',
        });
        ClientLogger.error(`Error fetching roastings.`);
      }
    })();
  }, [apiClient]);

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
      title: 'Datum pražení',
      dataIndex: 'roastingDate',
      key: 'roastingDate',
      render: (roastingDate: string) => (
        <span>{roastingDate ? moment(roastingDate).format('LLL') : ''}</span>
      ),
    },

    {
      title: '',
      render: (roasting: OrderListItem) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            setModalContext(roasting);
            setChooseRoastingModalOpened(true);
          }}
        >
          <Button type="primary">Zvolit pražení</Button>
        </span>
      ),
    },
  ];

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
        sticky={true}
        pagination={{
          position: ['topLeft'],
          showSizeChanger: false,
          pageSize: PAGE_SIZE,
          onChange: (page) => {
            if (page + 3 > rows.length / PAGE_SIZE) {
              fetchMore();
            }
          },
        }}
        onRow={(record: OrderListItem) => {
          return {
            onClick: () => {
              setModalOpened(true);
              setModalContext(record);
            },
          };
        }}
      />
      <Modal
        title={`Zařadit objednváku ${modalContext?.number}`}
        visible={chooseRoastingModalOpened}
        onOk={() => setChooseRoastingModalOpened(false)}
        onCancel={() => setChooseRoastingModalOpened(false)}
        centered
        footer={
          <>
            <Button
              key="back"
              type="primary"
              disabled={!selectedRoasting}
              onClick={selectRoasting}
            >
              Ok
            </Button>
          </>
        }
      >
        <Select
          onChange={(value) => setSelectedRoasting(`${value}`)}
          style={{ width: 300 }}
          key={modalContext?.id}
          placeholder="Zvolte datum pražení"
          // defaultValue={modalContext?.roastingId}
        >
          {plannnedRoastings.map((item) => {
            return (
              <Select.Option value={item.id} key={item.id}>
                {moment(item.roastingDate).format(`LLL`)}
              </Select.Option>
            );
          })}
        </Select>
      </Modal>
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
                description={`Množství ${item.quantity}x`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

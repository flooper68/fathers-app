import { Descriptions, Divider, List, Modal } from 'antd';
import moment from 'moment';
import React from 'react';

import { WarehouseRoastedCoffeeListItem } from '../../api/queries/get-warehouse-roasted-coffee';
import { TranslateReasonMap } from './type-translation';

export const WarehouseRoastedCoffeeModal = (props: {
  context: WarehouseRoastedCoffeeListItem;
  onClose: () => void;
}) => {
  return (
    <Modal
      title={`Zbytek ${props.context.roastedCoffeeName}`}
      visible={true}
      onCancel={props.onClose}
      onOk={props.onClose}
      centered
      width={700}
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
      footer={undefined}
    >
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Množství">
          {props.context.quantityOnHand.toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label="Naposledy změněno">
          {moment(props.context.lastUpdated).format('LLL')}
        </Descriptions.Item>
      </Descriptions>
      {/* Add history of events here */}
      <Divider />
      <List
        itemLayout="horizontal"
        dataSource={props.context.history}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<a>{TranslateReasonMap[item.type]}</a>}
              description={`${moment(item.timestamp).format(
                'LLL'
              )}, množství - ${item.amount.toFixed(2)}`}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

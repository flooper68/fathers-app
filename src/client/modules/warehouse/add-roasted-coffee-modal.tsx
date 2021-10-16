import { Modal, Button, Form, InputNumber, Select } from 'antd';
import React, { useEffect, useState } from 'react';

import { Logger } from '../../../shared/logger';
import { useApiClient } from '../../api/api-client';
import { RoastedCoffeeListItem } from '../../api/queries/get-roasted-coffee-query';
import { WarehouseRoastedCoffeeListItem } from '../../api/queries/get-warehouse-roasted-coffee';

interface FormData {
  newAmount: number;
  roastedCoffeeId: string;
}

export const AddWarehouseRoastedCoffeeModal = (props: {
  onClose: () => void;
  context: WarehouseRoastedCoffeeListItem[];
}) => {
  const [form] = Form.useForm<FormData>();
  const [roastedCoffees, setRoastedCoffees] = useState<RoastedCoffeeListItem[]>(
    []
  );

  const { adjustRoastedCoffeeLeftovers, getRoastedCoffees } = useApiClient();

  const onClose = () => {
    props.onClose();
    form.resetFields();
  };

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      await adjustRoastedCoffeeLeftovers({
        ...values,
      });
      props.onClose();
    } catch (e) {
      Logger.error(e);
    }
  };

  useEffect(() => {
    (async () => {
      const result = await getRoastedCoffees();
      setRoastedCoffees(
        result.data.roastedCoffees.filter(
          (item) =>
            !props.context
              .map((coffee) => coffee.roastedCoffeeId)
              .includes(item.id)
        )
      );
    })();
  }, [getRoastedCoffees, props.context]);

  return (
    <Modal
      title={`Upravit množství`}
      visible={true}
      onCancel={onClose}
      centered
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
      footer={
        <>
          <Button type="primary" onClick={onSave}>
            Upravit
          </Button>
          <Button type="ghost" onClick={onClose}>
            Zrušit
          </Button>
        </>
      }
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
      >
        <Form.Item
          label="Množství"
          name="newAmount"
          rules={[{ required: true, message: 'Povinná hodnota' }]}
        >
          <InputNumber placeholder="Množství" min="0" step="0.01" />
        </Form.Item>
        <Form.Item
          label="Pražená káva"
          name="roastedCoffeeId"
          rules={[{ required: true, message: 'Povinná hodnota' }]}
        >
          <Select placeholder="Pražená káva">
            {roastedCoffees.map((item) => {
              return (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

import { Modal, Button, Input, Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';

import { Logger } from '../../../shared/logger';
import { useApiClient } from '../../api/api-client';
import { RoastedCoffeeListItem } from '../../api/queries/get-roasted-coffee-query';

interface FormData {
  roastedCoffeeId: string;
}

export const AssignRoastedCoffeeModal = (props: {
  id?: number;
  initialValues?: FormData;
  onClose: () => void;
}) => {
  const [roastedCoffees, setRoastedCoffees] = useState<RoastedCoffeeListItem[]>(
    []
  );

  const [form] = Form.useForm<FormData>();

  const { assignRoastedCoffee, getRoastedCoffees } = useApiClient();

  const onClose = () => {
    props.onClose();
    form.resetFields();
  };

  const onSave = async () => {
    if (!props.id) {
      throw new Error(`Missing product ID`);
    }
    try {
      const values = await form.validateFields();
      await assignRoastedCoffee({ id: props.id, ...values });
      props.onClose();
    } catch (e) {
      Logger.error(e);
    }
  };

  useEffect(() => {
    (async () => {
      const result = await getRoastedCoffees();
      setRoastedCoffees(result.data.roastedCoffees);
    })();
  }, [getRoastedCoffees]);

  return (
    <Modal
      title={`Přiřadit praženou kávu`}
      visible={true}
      onCancel={onClose}
      centered
      width={700}
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
      footer={
        <>
          <Button type="primary" onClick={onSave}>
            Přidat
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
        initialValues={props.initialValues}
        autoComplete="off"
      >
        <Form.Item label="Pražená káva" name="roastedCoffeeId">
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

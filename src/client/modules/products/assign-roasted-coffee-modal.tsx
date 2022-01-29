import { Modal, Button, Form, Select, notification } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { useApiClient } from '../../api/api-client';
import { RoastedCoffeeListItem } from '../../api/queries/get-roasted-coffee-query';
import { ClientLogger } from '../../client-logger';

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

  const onClose = useCallback(() => {
    props.onClose();
    form.resetFields();
  }, [props, form]);

  const onSave = useCallback(async () => {
    if (!props.id) {
      throw new Error(`Missing product ID`);
    }
    try {
      const values = await form.validateFields();
      await assignRoastedCoffee({ id: props.id, ...values });
      props.onClose();
    } catch (e) {
      ClientLogger.error(e);
    }
  }, [props, form, assignRoastedCoffee]);

  useEffect(() => {
    try {
      (async () => {
        const result = await getRoastedCoffees();
        setRoastedCoffees(result.data.roastedCoffees);
      })();
    } catch (e) {
      notification.error({
        message: 'Chyba při načítání dat',
      });
      ClientLogger.error(`Error loading list`, e);
    }
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

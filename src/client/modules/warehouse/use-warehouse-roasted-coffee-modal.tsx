import { Modal, Button, Form, InputNumber, notification } from 'antd';
import React, { useCallback } from 'react';

import { Logger } from '../../../shared/logger';
import { useApiClient } from '../../api/api-client';

interface FormData {
  amount: number;
}

export const UseWarehouseRoastedCoffeeModal = (props: {
  roastedCoffeeId?: string;
  onClose: () => void;
}) => {
  const [form] = Form.useForm<FormData>();

  const { useRoastedCoffeeLeftovers } = useApiClient();

  const onClose = useCallback(() => {
    props.onClose();
    form.resetFields();
  }, [props, form]);

  const onSave = useCallback(async () => {
    if (!props.roastedCoffeeId) {
      throw new Error(`Missing product ID`);
    }
    try {
      const values = await form.validateFields();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      await useRoastedCoffeeLeftovers({
        roastedCoffeeId: props.roastedCoffeeId,
        ...values,
      });
      props.onClose();
    } catch (e) {
      notification.error({
        message: 'Chyba při ukládání dat',
      });
      Logger.error(e);
    }
  }, [form, props, useRoastedCoffeeLeftovers]);

  return (
    <Modal
      title={`Použít zbytky`}
      visible={true}
      onCancel={onClose}
      centered
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
      footer={
        <>
          <Button type="primary" onClick={onSave}>
            Použít
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
        <Form.Item label="Množství" name="amount">
          <InputNumber placeholder="Množství" min="0" step="0.01" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

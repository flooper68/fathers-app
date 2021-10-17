import { Modal, Button, Input, InputNumber, Form } from 'antd';
import React, { useCallback } from 'react';

import { Logger } from '../../../shared/logger';
import { useApiClient } from '../../api/api-client';

interface FormData {
  name: string;
  batchWeight: number;
  roastingLossFactor: number;
}

export const GreenCoffeeFormModal = (props: {
  id?: string;
  isEditing: boolean;
  initialValues?: FormData;
  onClose: () => void;
}) => {
  const [form] = Form.useForm<FormData>();
  const { createGreenCoffee, updateGreenCoffee } = useApiClient();

  const onClose = useCallback(() => {
    props.onClose();
    form.resetFields();
  }, [props, form]);

  const onSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      if (!props.isEditing) {
        await createGreenCoffee(values);
        onClose();
      } else {
        const id = props.id;
        if (!id) {
          throw new Error(`Missing green coffee id`);
        }
        await updateGreenCoffee({ id, ...values });
        onClose();
      }
    } catch (e) {
      Logger.error(e);
    }
  }, [form, createGreenCoffee, onClose, updateGreenCoffee, props]);

  return (
    <Modal
      title={`${!props.isEditing ? 'Přidat' : 'Upravit'} Zelenou Kávu`}
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
        <Form.Item
          label="Název"
          name="name"
          rules={[{ required: true, message: 'Název je povinný' }]}
        >
          <Input placeholder="Název" />
        </Form.Item>

        <Form.Item label="Hmotnost Batche (kg)" name="batchWeight">
          <InputNumber placeholder="Hmotnost Batche (kg)" min="0" step="0.1" />
        </Form.Item>

        <Form.Item label="Výtěžnost pražení" name="roastingLossFactor">
          <InputNumber
            placeholder="Výtěžnost pražení"
            min="0"
            max="1"
            step="0.1"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

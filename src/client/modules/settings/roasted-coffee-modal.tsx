import { Modal, Button, Input, Form, Select } from 'antd';
import React, { useCallback } from 'react';

import { useApiClient } from '../../api/api-client';
import { ClientLogger } from '../../client-logger';
import { useWholeList } from '../common/use-whole-list';

interface FormData {
  name: string;
  greenCoffeeId: string;
}

export const RoastedCoffeeFormModal = (props: {
  id?: string;
  isEditing: boolean;
  initialValues?: FormData;
  onClose: () => void;
}) => {
  const [form] = Form.useForm<FormData>();
  const { createRoastedCoffee, getGreenCoffees, updateRoastedCoffee } =
    useApiClient();

  const fetchRoastedCoffeeList = useCallback(async () => {
    const result = await getGreenCoffees();
    return result.data.greenCoffees;
  }, [getGreenCoffees]);

  const roastedCoffees = useWholeList(fetchRoastedCoffeeList);

  const onClose = useCallback(() => {
    props.onClose();
    form.resetFields();
  }, [props, form]);

  const onSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      if (!props.isEditing) {
        await createRoastedCoffee(values);
        onClose();
      } else {
        const id = props.id;
        if (!id) {
          throw new Error(`Missing green coffee id`);
        }
        await updateRoastedCoffee({ id, ...values });
        onClose();
      }
    } catch (e) {
      ClientLogger.error(e);
    }
  }, [updateRoastedCoffee, onClose, createRoastedCoffee, props, form]);

  return (
    <Modal
      title={`${!props.isEditing ? 'Přidat' : 'Upravit'} Praženou Kávu`}
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

        <Form.Item
          label="Zelená káva"
          name="greenCoffeeId"
          rules={[{ required: true, message: 'Chybí zelená káva' }]}
        >
          <Select placeholder="Zelená káva">
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

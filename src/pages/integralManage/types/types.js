/**
 * 积分管理 - 积分类型
 */
import { Table, Button, Space, Modal, Form, Input, InputNumber, message, Popconfirm } from 'antd';
import React, { useState, useEffect } from 'react';
import './types.scss';

import {
  integrationTypeList,
  integrationTypeAdd,
  integrationTypeUpdate,
  integrationTypeDelete
} from '@api/integration';

function IntegralTypes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const columns = [
    {
      title: 'id',
      key: 'id',
      dataIndex: 'id'
    },
    {
      title: '分类名称',
      key: 'label',
      dataIndex: 'label'
    },
    {
      title: 'Key',
      key: 'type',
      dataIndex: 'type'
    },
    {
      title: '初始积分',
      key: 'score',
      dataIndex: 'score'
    },
    {
      title: '倍率',
      key: 'rate',
      dataIndex: 'rate'
    },
    {
      title: '操作',
      key: 'operation',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openModal('edit', record)}>
            编辑
          </Button>
          <Popconfirm
            description="确认删除此分类？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link">删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const [ediType, setEdiType] = useState('add');
  const [editData, setEditData] = useState({});
  const openModal = (type, record) => {
    setEdiType(type);
    if (type === 'edit' && record) {
      setEditData(record);
      form.setFieldsValue(record);
    }
    setIsModalOpen(true);
  };

  const [data, setData] = useState([]);

  const getData = async () => {
    const res = await integrationTypeList();
    setData(res);
  };
  useEffect(() => {
    getData();
  }, []);

  const modalTitle = () => {
    if (ediType === 'add') {
      return '新增分类';
    } else {
      return '编辑分类';
    }
  };

  const [form] = Form.useForm();
  const handleModalCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  const handleModalOk = async () => {
    try {
      // 校验数据
      await form.validateFields();
      const formData = form.getFieldsValue();
      if (ediType === 'add') {
        addCategory(formData);
      }
      if (ediType === 'edit') {
        updateCategory(formData);
      }
      setEditData({});
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: '请输入完整'
      });
    }
  };

  const addCategory = (formData) => {
    integrationTypeAdd(formData).then(() => {
      setIsModalOpen(false);
      getData();
      messageApi.open({
        type: 'success',
        content: '新增成功'
      });
      form.resetFields();
    });
  };
  const updateCategory = (formData) => {
    const updateData = {
      ...editData,
      ...formData
    };
    integrationTypeUpdate(updateData).then(() => {
      setIsModalOpen(false);
      getData();
      messageApi.open({
        type: 'success',
        content: '更新成功'
      });
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    integrationTypeDelete({ id }).then(() => {
      getData();
      messageApi.open({
        type: 'success',
        content: '删除成功'
      });
    });
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={() => openModal('add')}>
        新增分类
      </Button>
      <Table columns={columns} dataSource={data} rowKey={(i) => i.id} />
      <Modal
        title={modalTitle()}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{
            score: 1,
            rate: 1
          }}
        >
          <Form.Item
            label="分类名称"
            name="label"
            rules={[
              {
                required: true,
                message: '请输入分类名称'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Key"
            name="type"
            rules={[
              {
                required: true,
                message: '请输入Key 唯一标识'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="初始奖励积分"
            name="score"
            rules={[
              {
                required: true,
                message: '请输入积分'
              }
            ]}
          >
            <InputNumber min={1} max={100} />
          </Form.Item>
          <Form.Item
            label="初始奖励倍率"
            name="rate"
            rules={[
              {
                required: true,
                message: '请输入倍率'
              }
            ]}
          >
            <InputNumber min={1} max={10} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default IntegralTypes;

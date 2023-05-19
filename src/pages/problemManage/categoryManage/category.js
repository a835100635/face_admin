import { Space, Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { useState, useEffect } from 'react';
import './category.scss';
import {
  getCategoryList,
  addCategoryData,
  updateCategoryData,
  deleteCategoryAction
} from '@api/category';
import { CATEGORY_TYPE } from '@constants';

function getCategoryLabel(value) {
  const category = Object.values(CATEGORY_TYPE).find(
    (item) => item.value === value && !item.special
  );
  return category ? category.label : '-';
}

function Category() {
  const [messageApi, contextHolder] = message.useMessage();

  const columns = [
    {
      title: '分类名称',
      key: 'categoryName',
      dataIndex: 'categoryName'
    },
    {
      title: '所属分类',
      key: 'typeId',
      render: (text, record) => {
        return <span>{getCategoryLabel(record.typeId)}</span>;
      }
    },
    {
      title: '关联题目数量',
      key: 'topicCount',
      dataIndex: 'topicCount'
    },
    {
      title: '分类描述',
      key: 'desc',
      dataIndex: 'desc',
      render: (text, record) => {
        return <span>{record.desc || '-'}</span>;
      }
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
          <Button type="link" onClick={() => deleteCategory(record)}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  const [data, setData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // 编辑类型
  const [ediType, setEdiType] = useState('add');

  const handleModalCancel = () => {
    form.resetFields();
    setOldCategoryData({});
    setIsModalOpen(false);
  };

  // 旧数据
  const [oldCategoryData, setOldCategoryData] = useState({});
  const categoryData = {};
  const [form] = Form.useForm();
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
      setOldCategoryData({});
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: '请输入完整'
      });
    }
  };
  const addCategory = (data) => {
    addCategoryData(data)
      .then(() => {
        setIsModalOpen(false);
        fetchData();
        messageApi.open({
          type: 'success',
          content: '新增成功'
        });
        form.resetFields();
      })
      .catch((error) => {
        messageApi.open({
          type: 'error',
          content: error.message
        });
      });
  };

  const updateCategory = (data) => {
    const updateData = {
      ...oldCategoryData,
      ...data
    };
    updateCategoryData(updateData)
      .then(() => {
        setIsModalOpen(false);
        fetchData();
        messageApi.open({
          type: 'success',
          content: '更新成功'
        });
        form.resetFields();
      })
      .catch((error) => {
        messageApi.open({
          type: 'error',
          content: error.message
        });
      });
  };

  const openModal = (type, record) => {
    // 设置编辑类型
    setEdiType(type);
    if (type === 'edit' && record) {
      setOldCategoryData(record);
      form.setFieldsValue(record);
    }
    // 打开弹窗
    setIsModalOpen(true);
  };
  const deleteCategory = (record) => {
    deleteCategoryAction(record.id)
      .then(() => {
        fetchData();
        messageApi.open({
          type: 'success',
          content: '删除成功'
        });
      })
      .catch((error) => {
        messageApi.open({
          type: 'error',
          content: error.message
        });
      });
  };

  const modalTitle = () => {
    if (ediType === 'add') {
      return '新增分类';
    } else {
      return '编辑分类';
    }
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const fetchData = async () => {
    const { RESOURCE, INFORMATION } = CATEGORY_TYPE;
    const result = await getCategoryList({
      // 排除id
      exclude: JSON.stringify([RESOURCE.value, INFORMATION.value])
    });
    const list = [];
    Object.keys(result).forEach((key) => {
      list.push(...result[key]);
    });
    setData(list);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="category-wrap">
      {contextHolder}
      <header className="filter-wrap">
        {/* <Input placeholder="" />; */}
        <Button type="primary" onClick={() => openModal('add')}>
          新增分类
        </Button>
      </header>
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
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={categoryData}
        >
          <Form.Item
            label="分类名称"
            name="categoryName"
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
            label="所属分类"
            name="typeId"
            rules={[
              {
                required: true,
                message: '请选择所属分类'
              }
            ]}
          >
            <Select options={Object.values(CATEGORY_TYPE).filter((item) => !item.special)} />
          </Form.Item>

          <Form.Item
            label="描述"
            name="desc"
            rules={[
              {
                required: false,
                message: '描述信息'
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}

export default Category;

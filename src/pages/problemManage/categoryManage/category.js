
import { Space, Table, Button, Modal, Form, Input, Select } from 'antd';
import { useState, useEffect } from 'react';
import './category.scss'
import { getCategoryList } from '../../../api/category';

function Category() {

  const columns = [
    {
      title: '分类名称',
      key: 'categoryName',
      dataIndex: 'categoryName',
    },
    {
      title: '所属分类',
      key: 'type',
      render: (text, record) => {
        return (
          <span>{record.type === 0 ? '一级分类' : '二级分类'}</span>
        )
      }
    },
    {
      title: '关联题目数量',
      key: 'topicCount',
      dataIndex: 'topicCount',
    },
    {
      title: '分类描述',
      key: 'desc',
      dataIndex: 'desc',
      render: (text, record) => {
        return (
          <span>{record.desc || '-'}</span>
        )
      }
    },
    {
      title: '操作',
      key: 'operation',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openModal('edit')}>编辑</Button>
          <Button type="link" onClick={() => deleteCategory(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  const [data, setData] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false);
  // 编辑类型
  const [ediType, setEdiType] = useState('add');

  const handleModalCancel = () => {
    setIsModalOpen(false);
  }
  const handleModalOk = () => {
    setIsModalOpen(false);
  }
  const openModal = (type) => {
    // 设置编辑类型
    setEdiType(type);
    // 打开弹窗
    setIsModalOpen(true);
  }
  const deleteCategory = (record) => {
    console.log(record);
  }

  const modalTitle = () => {
    if (ediType === 'add') {
      return '新增分类';
    } else {
      return '编辑分类';
    }
  }

  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleTypeChange = (value) => {
    console.log(value);
  }

  const fetchData = async () => {
    const result = await getCategoryList();
    const list = [];
    Object.keys(result.data).forEach((key) => {
      list.push(...result.data[key])
    })
    setData(list);
  }

  useEffect(() => {
    fetchData();
  }, [])

  const [categoryData, setCategoryData] = useState({})

  return (
    <main className="category-wrap">
      <header className="filter-wrap">
        {/* <Input placeholder="" />; */}
        <Button type="primary" onClick={() => openModal('add')}>新增分类</Button>
      </header>
      <Table columns={columns} dataSource={data} rowKey={i => i.id}/>
      <Modal title={modalTitle()} open={isModalOpen} onOk={handleModalOk} onCancel={handleModalCancel}>
        <Form
          name="basic"
          labelCol={{ span: 4 }} 
          wrapperCol={{span: 20}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={ categoryData }
        >
          <Form.Item
            label="分类名称"
            name="categoryName"
            rules={[
              {
                required: true,
                message: '请输入分类名称',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="所属分类"
            name="type"
            rules={[
              {
                required: true,
                message: '请选择所属分类',
              },
            ]}
          >
            <Select
              onChange={handleTypeChange}
              options={[
                { value: 0, label: '前端' },
                { value: 1, label: '后端' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="描述"
            name="desc"
            rules={[
              {
                required: false,
                message: '描述信息',
              },
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

/**
 * 文件资源管理列表
 */

import { useEffect, useState } from 'react';
import './resourceTable.scss';
import { Table, Button, Popconfirm, Tooltip } from 'antd';
import { getResourceList, getResourceDetail } from '@api/resource';
import { useSelector } from 'react-redux';
import StatusTag from '@components/statusTag/statusTag';
import moment from 'moment';

function ResourceTable({ onOpenModel, onDelete }) {
  const { resourceCategory } = useSelector((state) => {
    const { resourceCategory } = state;
    return {
      resourceCategory
    };
  });

  const [data, setData] = useState([]);

  const columns = [
    {
      title: '资源名称',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '资源类型',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (text, record) => (
        <span>
          {resourceCategory.find((item) => item.id === record.categoryId)?.categoryName || '-'}
        </span>
      )
    },
    {
      title: '兑换类型',
      dataIndex: 'saleType',
      key: 'saleType',
      render: (text, record) => <span>{record.saleType === 1 ? '积分' : '金额'}</span>
    },
    {
      title: '兑换类型',
      dataIndex: 'saleType',
      key: 'saleType',
      render: (text, record) => <StatusTag status={record.status} />
    },
    {
      title: '兑换积分',
      dataIndex: 'score',
      key: 'score',
      render: (text, record) => <span>{record.score}</span>
    },
    {
      title: '兑换金额',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => <span>{record.price}</span>
    },
    {
      title: '分享地址',
      dataIndex: 'resourceUrl',
      key: 'resourceUrl',
      width: 150,
      ellipsis: true,
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.resourceUrl}>
          <span>{record.resourceUrl}</span>
        </Tooltip>
      )
    },
    {
      title: '获取密码',
      dataIndex: 'resourcePwd',
      key: 'resourcePwd',
      render: (text, record) => <span>{record.resourcePwd}</span>
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 200,
      render: (text, record) => (
        <span>{moment(record.createdTime).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span className="btns">
          <Button type="link">预览</Button>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            description="确认删除此资源？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link">删除</Button>
          </Popconfirm>
        </span>
      )
    }
  ];

  useEffect(() => {
    fetchResourceList();
  }, []);

  const fetchResourceList = async () => {
    const res = await getResourceList();
    if (res) {
      setData(res.data);
    }
  };

  const handleEdit = async (data) => {
    const { id } = data;
    const result = await getResourceDetail(id);
    if (result) {
      onOpenModel(result);
    }
  };

  const handleDelete = (id) => {
    onDelete(id);
  };

  return (
    <Table className="resource-table" columns={columns} dataSource={data} rowKey={(i) => i.id} />
  );
}

export default ResourceTable;

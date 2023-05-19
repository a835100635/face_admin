/**
 * 文件资源管理列表
 */

import { useEffect, useState } from 'react';
import './resourceTable.scss';
import { Table } from 'antd';
import { getResourceList } from '../../../../api/resource';

const columns = [
  {
    title: '资源名称',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '资源类型',
    dataIndex: 'categoryId',
    key: 'categoryId'
  }
];

function ResourceTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchResourceList();
  }, []);

  const fetchResourceList = async () => {
    const res = await getResourceList();
    if (res) {
      console.log(res);
      setData(res.data);
    }
  };

  return (
    <Table className="resource-table" columns={columns} dataSource={data} rowKey={(i) => i.id} />
  );
}

export default ResourceTable;

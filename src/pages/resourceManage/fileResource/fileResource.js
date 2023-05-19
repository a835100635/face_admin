/**
 * 文件资源
 * @returns
 */
import './fileResource.scss';
import Category from '@components/category/category';
import ResourceTable from './components/resourceTable';
import FilterSearch from './components/filterSearch';
import { CATEGORY_TYPE } from '@constants';
import EditResource from './components/editResource';
import { useState } from 'react';
import { addResource, editResource } from '@api/resource';
import { message } from 'antd';

function FileResource() {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editType, setEditType] = useState('add');
  const [editData, setEditData] = useState({});
  const onOpenModel = (type) => {
    setIsModalVisible(true);
    setEditType(type ? type : 'add');
  };

  const handleOk = async (data) => {
    console.log('handleOk', data);
    const body = {
      ...data,
      tag: JSON.stringify(data.tag),
      previewImage: JSON.stringify(
        data.previewImage.map((item) => {
          if ('url' in item) {
            return item.url;
          }
          return item.response.data.url;
        })
      )
    };
    if (editType === 'edit') {
      await editResource(body);
      messageApi.success('编辑成功');
      setIsModalVisible(false);
      setEditData({});
    } else {
      const result = await addResource(body);
      if (result) {
        messageApi.success('新增成功');
        setIsModalVisible(false);
      }
    }
  };

  const update = (data) => {
    setEditData(data);
    console.log('update', data);
    onOpenModel('edit');
  };

  const handleDelete = (id) => {
    console.log(id);
  };

  return (
    <>
      {contextHolder}
      <div className="file-resource-wrap">
        <Category showRightBorder typeId={CATEGORY_TYPE.RESOURCE.value} />
        <div className="main">
          <FilterSearch onOpenModel={onOpenModel} />
          <ResourceTable onOpenModel={update} onDelete={handleDelete} />
        </div>
      </div>
      <EditResource
        isModalVisible={isModalVisible}
        editType={editType}
        editData={editData}
        onClose={() => setIsModalVisible(false)}
        onOk={handleOk}
      />
    </>
  );
}
export default FileResource;

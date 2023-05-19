/**
 * 文件资源
 * @returns
 */
import './fileResource.scss';
import Category from '../../../components/category/category';
import ResourceTable from './components/resourceTable';
import FilterSearch from './components/filterSearch';
import { CATEGORY_TYPE } from '../../../constants';
import EditResource from './components/editResource';
import { useState } from 'react';
import { uploadResource } from '../../../api/resource';
import { message } from 'antd';

function FileResource() {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editType, setEditType] = useState('add');
  const onOpenModel = (type) => {
    setIsModalVisible(true);
    setEditType(type ? type : 'add');
  };

  const handleOk = (data) => {
    const body = {
      ...data,
      tag: JSON.stringify(data.tag),
      previewImage: JSON.stringify(
        data.previewImage.map((item) => {
          return item.response.data.url;
        })
      )
    };
    uploadResource(body)
      .then((res) => {
        if (res) {
          messageApi.success('新增成功');
          setIsModalVisible(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {contextHolder}
      <div className="file-resource-wrap">
        <Category showRightBorder typeId={CATEGORY_TYPE.RESOURCE.value} />
        <div className="main">
          <FilterSearch onOpenModel={onOpenModel} />
          <ResourceTable />
        </div>
      </div>
      <EditResource
        isModalVisible={isModalVisible}
        editType={editType}
        onClose={() => setIsModalVisible(false)}
        onOk={handleOk}
      />
    </>
  );
}
export default FileResource;

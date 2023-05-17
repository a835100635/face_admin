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

function FileResource() {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [editType, setEditType] = useState('add');
  const onOpenModel = (type) => {
    setIsModalVisible(true);
    setEditType(type ? type : 'add');
  };

  const handleOk = (data) => {
    console.log(data);
  };

  return (
    <>
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

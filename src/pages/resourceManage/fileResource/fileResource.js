/**
 * 文件资源
 * @returns
 */
import './fileResource.scss';
import Category from '../../../components/category/category';
import ResourceTable from './components/resourceTable';
import { CATEGORY_TYPE } from '../../../constants';

function FileResource() {
  return (
    <div className="file-resource-wrap">
      <Category showRightBorder typeId={CATEGORY_TYPE.RESOURCE.value} />
      <ResourceTable />
    </div>
  );
}
export default FileResource;

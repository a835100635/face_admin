/**
 * @fileoverview filterSearch
 */

import './filterSearch.scss';
import { Input, Button } from 'antd';
import FDatePicker from '../../../../components/datePicker/datePicker.js';

function FilterSearch({ onOpenModel, onDateChange }) {
  const onChange = (dates, dateStrings) => {
    console.log(dates, dateStrings);
    onDateChange(dates, dateStrings);
  };
  const openModal = () => {
    onOpenModel();
  };

  return (
    <>
      <header className="filter-search-wrap">
        <div className="left">
          <Input placeholder="资源名称" style={{ width: 150 }} />
          <Input placeholder="用户id" style={{ width: 150 }} />
          <FDatePicker onChange={onChange} />
        </div>
        <div>
          <Button type="primary" onClick={openModal}>
            新增
          </Button>
        </div>
      </header>
    </>
  );
}

export default FilterSearch;

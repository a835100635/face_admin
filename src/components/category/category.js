/**
 * 分类管理
 * @returns
 */
import './category.scss';
import { Input, Modal, Popover, Button, message } from 'antd';
import { PlusCircleOutlined, EllipsisOutlined } from '@ant-design/icons';
const { Search } = Input;
import { useState, useEffect } from 'react';
import {
  getCategoryList,
  addCategoryData,
  updateCategoryData,
  deleteCategoryAction
} from '@api/category';
import Store from '@store';
import { change_resource_category } from '@store/actionCreatores';
import { useSelector } from 'react-redux';

function PopoverChildren({ onEvent }) {
  const emitEvent = (e, type) => {
    e.stopPropagation();
    onEvent(type);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Button type="link" onClick={(e) => emitEvent(e, 'edit')}>
        编辑
      </Button>
      <Button type="link" onClick={(e) => emitEvent(e, 'delete')}>
        删除
      </Button>
    </div>
  );
}

function Category({ showRightBorder, typeId }) {
  // 获取数据
  const { data } = useSelector((state) => {
    const { resourceCategory } = state;
    return {
      data: resourceCategory
    };
  });
  // 是否显示右边框
  const showRBorder = showRightBorder ? 'show-right-border' : '';
  // 展示分类
  const [list, setList] = useState([]);
  // 当前选中的分类
  const [currentIndex, setCurrentIndex] = useState('');
  // 当前操作的分类
  const [operationIndex, setOperationIndex] = useState('');
  // 是否显示弹窗
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 编辑的数据
  const [editData, setEditData] = useState({
    categoryName: ''
  });
  // 编辑类型
  const [editType, setEditType] = useState('');
  useEffect(() => {
    if (!isModalOpen) {
      setEditData({ categoryName: '' });
    }
  }, [isModalOpen]);
  useEffect(() => {
    setCurrentIndex('');
    setOperationIndex('');
  }, [list.length]);
  // 搜索
  const onSearchChange = (e) => {
    const results = data.filter((item) => {
      const regex = new RegExp(`${e.target.value}`, 'i');
      return item.categoryName.match(regex);
    });
    setList(results || []);
  };
  const changeCurrentIndex = (index) => {
    setCurrentIndex(index);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditData({
      categoryName: ''
    });
  };

  const handleOk = () => {
    if (!editData.categoryName.trim()) {
      message.error('请输入分类名称');
      return;
    }
    if (editType === 'edit') {
      updateCategoryData({
        id: editData.id,
        typeId,
        categoryName: editData.categoryName
      }).then(() => {
        message.success('更新成功');
        fetchCategory();
      });
    } else {
      addCategoryData({
        typeId,
        categoryName: editData.categoryName
      }).then(() => {
        message.success('新增成功');
        fetchCategory();
      });
    }
    setIsModalOpen(false);
  };

  const onOpenChange = (e, index) => {
    if (e) {
      setOperationIndex(index);
    } else {
      setOperationIndex('');
    }
  };

  const onChildEvent = (type, data) => {
    if (type === 'delete') {
      deleteCategoryAction(data.id).then(() => {
        message.success('删除成功');
        fetchCategory();
        setIsModalOpen(false);
      });
      return;
    }
    setIsModalOpen(true);
    setEditType(type);
    setEditData(data);
  };

  const onChange = (e) => {
    setEditData({
      ...editData,
      categoryName: e.target.value
    });
  };

  // 获取分类列表
  const fetchCategory = () => {
    getCategoryList({ typeId }).then((res) => {
      if (res) {
        Store.dispatch({
          type: change_resource_category().type,
          value: res[typeId] || []
        });
        setList(res[typeId]);
      }
    });
  };
  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className={`category-wrap ${showRBorder}`}>
      <Search
        style={{
          marginBottom: 8
        }}
        placeholder="搜索分类"
        onChange={onSearchChange}
      />
      <div className="category-list">
        <div
          className={`category-item ${currentIndex === -1 ? 'is-active' : ''}`}
          onClick={() => changeCurrentIndex(-1)}
        >
          <span>全部</span>
          <PlusCircleOutlined onClick={() => openModal()} />
        </div>
        {list.map((item, index) => {
          return (
            <div
              key={item.id}
              className={`category-item ${currentIndex === index && 'is-active'} ${
                operationIndex === index && 'is-operation'
              }`}
              onClick={() => changeCurrentIndex(index)}
            >
              <span>{item.categoryName}</span>
              <Popover
                overlayClassName="category-popover"
                placement="rightTop"
                onClick={(e) => e.stopPropagation()}
                content={<PopoverChildren onEvent={(e) => onChildEvent(e, item)} />}
                onOpenChange={(e) => onOpenChange(e, index)}
              >
                <EllipsisOutlined />
              </Popover>
            </div>
          );
        })}
        {/* 没有分类时 */}
        {!list.length && (
          <div className="empty">
            <span>暂无分类</span>
          </div>
        )}
      </div>
      <Modal
        title={editData.id ? '编辑' : '新增'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="输入分类名称"
          showCount
          maxLength={10}
          value={editData.categoryName}
          onChange={(e) => onChange(e)}
        />
      </Modal>
    </div>
  );
}

export default Category;

import { Modal, Input, Select, InputNumber, message } from 'antd';
import { useState, useEffect } from 'react';
import './editResource.scss';
import FUploadImage from '@components/uploadImage/uploadImage';
import { useSelector } from 'react-redux';
const { TextArea } = Input;
const rules = {
  title: { required: true, message: '请输入标题' },
  categoryId: { required: true, message: '请选择分类' },
  score: {
    required: true,
    message: '请输入售价积分',
    validator: (rule, value, data, callback) => {
      if (typeof value === 'number') {
        return true;
      }
      callback('请输入数字');
      return false;
    }
  },
  price: {
    required: true,
    message: '请输入售价金额',
    validator: (rule, value, data, callback) => {
      if (typeof value === 'number') {
        return true;
      }
      callback('请输入数字');
      return false;
    }
  },
  desc: { required: true, message: '请输入描述' },
  resourceUrl: {
    required: true,
    message: '请输入资源地址',
    validator: (rule, value, data, callback) => {
      // 校验是否是网址
      const reg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
      if (reg.test(value)) {
        return true;
      }
      callback('请输入正确的网址');
      return false;
    }
  },
  resourcePwd: { required: true, message: '请输入资源密码' },
  tag: { required: false, message: '请输入标签' },
  previewImage: { required: false, message: '请上传预览图' },
  saleType: { required: true, message: '请选择兑换类型' }
};
const defaultData = {
  title: '',
  categoryId: '',
  desc: '',
  resourceUrl: '',
  resourcePwd: '',
  tag: [],
  previewImage: [],
  score: 0,
  price: 0,
  // 1:积分 2:金额
  saleType: 1
};

function EditResource({ isModalVisible, editType, onClose, onOk }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState(defaultData);

  // 获取数据
  const { categoryOptions } = useSelector((state) => {
    const { resourceCategory } = state;
    return {
      categoryOptions: resourceCategory
    };
  });

  useEffect(() => {
    if (!isModalVisible) {
      setData(defaultData);
    }
  }, [isModalVisible]);

  const onFileChange = (fileList) => {
    setData({
      ...data,
      previewImage: fileList
    });
  };
  // 编辑内容改变
  const onEditChange = (value, key) => {
    setData({
      ...data,
      [key]: value
    });
  };
  const getRequireClass = (key) => {
    return rules[key].required ? 'label require' : 'label';
  };

  const handleCancel = () => {
    onClose();
  };
  // 校验数据
  const validateData = () => {
    for (const key in rules) {
      const rule = rules[key];
      const { required, validator } = rule;
      // 校验必填
      if (required && !validator && !data[key]) {
        messageApi.error(rule.message);
        return false;
      }
      // 校验自定义
      if (validator) {
        const result = rule.validator(rule, data[key], data, (message) => {
          messageApi.error(message);
        });
        if (!result) {
          return false;
        }
      }
    }
    return true;
  };

  const handleOk = () => {
    // 校验数据
    if (!validateData()) return;
    onOk(data);
  };
  return (
    <>
      {contextHolder}
      <Modal
        width={900}
        className="edit-topic-modal"
        title={editType === 'add' ? '新增' : '编辑'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="edit-block">
          <span className="label-warp">
            <span className={getRequireClass('title')}>资源名称</span>
          </span>
          <Input
            className="input"
            placeholder="请输入资源名称"
            value={data.title}
            showCount
            maxLength={50}
            onChange={(e) => onEditChange(e.target.value, 'title')}
          />
        </div>
        <div className="edit-wrap">
          <div className="edit-block">
            <span className="label-warp">
              <span className={getRequireClass('categoryId')}>题目分类</span>
            </span>
            <Select
              placeholder="分类"
              value={data.categoryId}
              style={{ minWidth: '150px' }}
              options={categoryOptions.map((item) => {
                return { value: item.id, label: item.categoryName };
              })}
              onChange={(value) => onEditChange(value, 'categoryId')}
            />
          </div>
          <div className="edit-block">
            <span className="label-warp">
              <span className={getRequireClass('saleType')}>兑换类型</span>
            </span>
            <Select
              placeholder="兑换类型"
              defaultValue={data.saleType}
              value={data.saleType}
              style={{ minWidth: '150px' }}
              options={[
                { value: 1, label: '积分' },
                { value: 2, label: '金额' }
              ]}
              onChange={(value) => onEditChange(value, 'saleType')}
            />
          </div>
          <div className="edit-block">
            <span className="label-warp">
              <span className={getRequireClass('score')}>兑换积分</span>
            </span>
            <InputNumber
              className="input"
              placeholder="请输入兑换积分"
              value={data.score}
              min={0}
              max={1000}
              defaultValue={0}
              style={{ minWidth: '150px' }}
              onChange={(e) => onEditChange(e, 'score')}
            />
          </div>
          <div className="edit-block margin-t">
            <span className="label-warp">
              <span className={getRequireClass('price')}>兑换金额</span>
            </span>
            <InputNumber
              className="input"
              placeholder="请输入兑换金额"
              value={data.price}
              min={0}
              max={1000}
              defaultValue={0}
              style={{ minWidth: '150px' }}
              onChange={(e) => onEditChange(e, 'price')}
            />
          </div>
          <div className="edit-block margin-t">
            <span className="label-warp">
              <span className={getRequireClass('tag')}>标签</span>
            </span>
            <Select
              mode="tags"
              style={{ minWidth: '150px' }}
              placeholder="请输入标签"
              maxTagCount={3}
              value={data.tag}
              options={[
                { value: 'HTML', label: 'HTML' },
                { value: 'CSS', label: 'CSS' },
                { value: 'javaScript', label: 'javaScript' },
                { value: 'Vue', label: 'Vue' },
                { value: 'React', label: 'React' },
                { value: 'Java', label: 'Java' },
                { value: 'SpringBoot', label: 'SpringBoot' },
                { value: 'Nginx', label: 'Nginx' },
                { value: 'MySql', label: 'MySql' }
              ]}
              onChange={(e) => onEditChange(e, 'tag')}
            />
          </div>
        </div>
        <div className="edit-block margin-t">
          <span className="label-warp">
            <span className={getRequireClass('desc')}>资源描述</span>
          </span>
          <TextArea
            rows={4}
            className="input"
            placeholder="请输入资源描述"
            value={data.desc}
            onChange={(e) => onEditChange(e.target.value, 'desc')}
          />
        </div>
        <div className="edit-block margin-t">
          <span className="label-warp">
            <span className={getRequireClass('resourceUrl')}>资源链接</span>
          </span>
          <Input
            className="input"
            placeholder="请输入资源链接"
            value={data.resourceUrl}
            showCount
            maxLength={100}
            onChange={(e) => onEditChange(e.target.value, 'resourceUrl')}
          />
        </div>
        <div className="edit-block margin-t">
          <span className="label-warp">
            <span className={getRequireClass('resourcePwd')}>资源密码</span>
          </span>
          <Input
            className="input"
            placeholder="请输入资源密码"
            value={data.resourcePwd}
            showCount
            maxLength={50}
            onChange={(e) => onEditChange(e.target.value, 'resourcePwd')}
          />
        </div>
        <div className="edit-block margin-t">
          <span className="label-warp">
            <span className={getRequireClass('previewImage')}>预览图片</span>
          </span>
          <div>
            <FUploadImage images={data.previewImage} onFileChange={onFileChange} />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default EditResource;

import { Modal, Input, Button, Select, Checkbox, message } from 'antd';
import { CloseOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import {
  TOPIC_TYPE_OPTIONS,
  LEVEL_OPTIONS,
  CONTENT_TYPE,
  EDITOR_TYPE,
  OPEN_TYPE,
  BLANKS_TYPE,
  CHOICE_TYPE,
  JUDGE_TYPE,
  ANALYSIS_TYPE
} from '@constants';
import { useState, useEffect } from 'react';
import './editTopic.scss';
import EditorModal from '@components/editorModal/editorModal';
import hljs from 'highlight.js';

const defaultData = {
  topic: '',
  topicDesc: '',
  categoryId: null,
  answer: '',
  type: null,
  level: null,
  online: 0,
  status: 0,
  options: [],
  correct: '',
  desc: ''
};
// 检验数据规则
const rules = {
  topic: { required: true, message: '请输入题目名称' },
  topicDesc: { required: false, message: '请输入题目描述' },
  categoryId: { required: true, message: '请选择题目分类' },
  type: { required: true, message: '请选择题目类型' },
  level: { required: true, message: '请选择题目难度' },
  // TODO：临时 解析
  answer: { required: false, message: '请输入题目解析' },
  options: {
    required: true,
    message: '请添加选项',
    validator: (rule, value, data, callback) => {
      // 非选择题不校验选项
      if (![OPEN_TYPE, BLANKS_TYPE, ANALYSIS_TYPE].includes(data.type) && value.length < 2) {
        callback('选项不能少于2个');
        return false;
      }
      return true;
    }
  },
  correct: {
    required: false,
    message: '请选择正确答案',
    validator: (rule, value, data, callback) => {
      // 非选择题不校验选项
      if ([CHOICE_TYPE, JUDGE_TYPE].includes(data.type) && value.length < 1) {
        callback('至少需要一个选项');
        return false;
      }
      // TODO：临时 填空题、判断不校验答案
      // if([OPEN_TYPE, BLANKS_TYPE].includes(data.type) && `${value}`.trim() === '') {
      //     callback('请输入正确答案');
      //     return false;
      // }
      return true;
    }
  },
  desc: { required: false, message: '请输入题目描述' }
};

function EditTopic(props) {
  const [messageApi, contextHolder] = message.useMessage();
  const { editType, currentData, isModalOpen, onOk, onCancel, categoryOptions } = props;
  // 编辑内容
  const [data, setData] = useState(defaultData);
  // 编辑器弹窗
  const [visible, setVisible] = useState(false);
  // 编辑内容
  const [editContent, setEditContent] = useState('');
  // 编辑内容类型
  const [editContentType, setEditContentType] = useState({ type: '', index: '' });
  // 是否显示选项
  const [isShowOptions, setIsShowOptions] = useState(true);

  // modal确认
  const onOkAction = () => {
    // 校验数据
    if (!validateData()) return;
    onOk(data);
  };
  // 校验数据 根据rules校验
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
  // modal取消
  const onCancelAction = () => {
    onCancel();
  };
  // 打开编辑器弹窗
  const openEditorModal = (type, data, index) => {
    setEditContent(data);
    setEditContentType({ type, index });
    setVisible(true);
  };
  // 选项上移动
  const moveUpOption = (index) => {
    if (index === 0) return;
    const options = data.options;
    const currentOption = options[index];
    const prevOption = options[index - 1];
    options[index] = prevOption;
    options[index - 1] = currentOption;
    setData({
      ...data,
      options: updateOptionsKey(options)
    });
  };
  // 选项下移动
  const moveDownOption = (index) => {
    const options = data.options;
    if (index === options.length - 1) return;
    const currentOption = options[index];
    const nextOption = options[index + 1];
    options[index] = nextOption;
    options[index + 1] = currentOption;
    setData({
      ...data,
      options: updateOptionsKey(options)
    });
  };
  // 删除选项
  const deleteOption = (index, key) => {
    const options = data.options.filter((item, i) => i !== index);
    setData({
      ...data,
      options: updateOptionsKey(options),
      correct: data.correct.filter((item) => item !== key)
    });
  };
  const addOptions = () => {
    if (data.options.length >= 4) {
      messageApi.warning('最多只能添加4个选项');
      return;
    }
    // ASCII 65 -> A
    const optionsLength = Object.keys(data.options).length;
    const currentIndex = optionsLength + 65;
    const key = String.fromCharCode(currentIndex).toLocaleUpperCase();
    setData({
      ...data,
      options: [
        ...data.options,
        {
          key,
          type: CONTENT_TYPE.TEXT,
          value: null
        }
      ]
    });
  };
  // 更新选项key
  const updateOptionsKey = (options) => {
    options.forEach((item, index) => {
      item.key = String.fromCharCode(index + 65).toLocaleUpperCase();
    });
    return options;
  };
  // 选项内容类型改变
  const changeOptionType = (type, index) => {
    const options = data.options;
    options[index].type = type;
    setData({
      ...data,
      options
    });
  };
  // 编辑器弹窗确定
  const onHandleOk = (value) => {
    const { content, editType } = value;
    const { type, index } = editType;
    // 题目解析
    if (type === EDITOR_TYPE.ANSWER) {
      setData({
        ...data,
        answer: content
      });
    } else if (type === EDITOR_TYPE.TOPIC_DESC) {
      setData({
        ...data,
        topicDesc: content
      });
    } else {
      const options = data.options;
      options[index].value = content;
      setData({
        ...data,
        options
      });
    }
    onHandleCancel();
  };
  // 编辑器弹窗取消
  const onHandleCancel = () => {
    setVisible(false);
    setEditContent('');
    setEditContentType({ type: '', index: '' });
  };
  // 代码高亮
  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      try {
        hljs.highlightBlock(block);
      } catch (e) {
        console.log(e);
      }
    });
  });
  // 监听类型改变 correct值类型/显示选项
  useEffect(() => {
    const isShow = [CHOICE_TYPE, JUDGE_TYPE].includes(data.type);
    setIsShowOptions(isShow);
    onTypeChange();
  }, [data.type]);
  // 弹框关闭重置data
  useEffect(() => {
    setData(defaultData);
    // 编辑时初始化数据
    if (isModalOpen && editType === 'edit') {
      const editData = JSON.parse(JSON.stringify(currentData));
      if ([CHOICE_TYPE, JUDGE_TYPE].includes(editData.type)) {
        // editData.correct = JSON.parse(editData.correct);
        // editData.options = JSON.parse(editData.options);
      }
      setData({
        ...data,
        ...editData
      });
    }
  }, [isModalOpen]);

  // 编辑内容改变
  const onEditChange = (value, key) => {
    setData({
      ...data,
      [key]: value
    });
  };
  // 类型改变
  const onTypeChange = (value) => {
    const isShow = [CHOICE_TYPE, JUDGE_TYPE].includes(value);
    // 选择题和判断题 [] || ''
    if (isShow) {
      setData({
        ...data,
        correct: []
      });
    } else {
      setData({
        ...data,
        correct: ''
      });
    }
  };
  // 选项内容改变
  const onOptionInputChange = (value, index) => {
    const options = data.options;
    options[index].value = value;
    setData({
      ...data,
      options
    });
  };
  // 选择题正确答案改变
  const onCorrectChange = (e, key) => {
    const checked = e.target.checked;
    if (checked) {
      setData({
        ...data,
        correct: [...data.correct, key]
      });
    } else {
      const correct = data.correct.filter((item) => item !== key);
      setData({
        ...data,
        correct
      });
    }
  };
  const getCorrectCheckbox = (key) => {
    const { correct } = data;
    console.log('==getCorrectCheckbox', correct, '-', key);
    return correct.includes(key);
  };
  const getRequireClass = (key) => {
    return rules[key].required ? 'label require' : 'label';
  };
  return (
    <>
      {contextHolder}
      <Modal
        width={900}
        maskClosable={false}
        className="edit-topic-modal"
        title={editType === 'add' ? '新增题目' : `编辑题目 - “${currentData.topic}”`}
        open={isModalOpen}
        onOk={onOkAction}
        onCancel={onCancelAction}
      >
        <div className="edit-block">
          <span className="label-warp">
            <span className={getRequireClass('topic')}>题目名称</span>
          </span>
          <Input
            className="input"
            placeholder="请输入题目名称"
            value={data.topic}
            showCount
            maxLength={50}
            onChange={(e) => onEditChange(e.target.value, 'topic')}
          />
        </div>
        <div className="edit-block" style={{ marginTop: '20px' }}>
          <span className="label-warp">
            <span className={getRequireClass('topicDesc')}>题目描述</span>
          </span>
          <div className="answer-content">
            <div
              className="content-wrap"
              onClick={() => openEditorModal(EDITOR_TYPE.TOPIC_DESC, data.topicDesc)}
            >
              <p className="content" dangerouslySetInnerHTML={{ __html: data.topicDesc }}></p>
            </div>
          </div>
        </div>
        <div className="edit-wrap">
          <div className="edit-block">
            <span className="label-warp">
              <span className={getRequireClass('categoryId')}>题目分类</span>
            </span>
            <Select
              placeholder="选择题目分类"
              defaultValue={data.categoryId}
              value={data.categoryId}
              style={{ width: 150 }}
              options={categoryOptions}
              onChange={(value) => onEditChange(value, 'categoryId')}
            />
          </div>
          <div className="edit-block">
            <span className="label-warp">
              <span className={getRequireClass('type')}>题目类型</span>
            </span>
            <Select
              placeholder="选择题目类型"
              defaultValue={data.type}
              value={data.type}
              style={{ width: 150 }}
              options={TOPIC_TYPE_OPTIONS}
              onChange={(value) => onEditChange(value, 'type')}
            />
          </div>
          <div className="edit-block">
            <span className="label-warp">
              <span className={getRequireClass('topic')}>题目难度</span>
            </span>
            <Select
              placeholder="请选择难易程度"
              defaultValue={data.level}
              value={data.level}
              style={{ width: 150 }}
              options={LEVEL_OPTIONS}
              onChange={(value) => onEditChange(value, 'level')}
            />
          </div>
        </div>
        <div className="edit-block">
          <span className="label-warp">
            <span className={getRequireClass('answer')}>题目解析</span>
          </span>
          <div className="answer-content">
            <div
              className="content-wrap"
              onClick={() => openEditorModal(EDITOR_TYPE.ANSWER, data.answer)}
            >
              <p className="content" dangerouslySetInnerHTML={{ __html: data.answer }}></p>
            </div>
          </div>
        </div>

        {isShowOptions ? (
          <div className="edit-block edit-wrap">
            <span className="label-warp">
              <span className={getRequireClass('options')}>题目选项</span>
            </span>
            <div className="options">
              {data.options.map(({ key, value, type }, index) => {
                return (
                  <div className="options-style" key={index}>
                    <Checkbox
                      onChange={(e) => onCorrectChange(e, key)}
                      checked={getCorrectCheckbox(key)}
                    >
                      {key}
                    </Checkbox>
                    <Select
                      className="text-select"
                      defaultValue={type}
                      value={type}
                      style={{ width: 100 }}
                      options={[
                        { label: '文本', value: CONTENT_TYPE.TEXT },
                        { label: '富文本', value: CONTENT_TYPE.RICH_TEXT }
                      ]}
                      onChange={(value) => changeOptionType(value, index)}
                    />
                    {(() => {
                      if (type === CONTENT_TYPE.TEXT) {
                        return (
                          <Input
                            className="input"
                            value={value}
                            placeholder="请输入选项内容"
                            onChange={(e) => onOptionInputChange(e.target.value, index)}
                          />
                        );
                      } else {
                        return (
                          <>
                            <div
                              className="content-wrap"
                              onClick={() => openEditorModal(EDITOR_TYPE.OPTION, value, index)}
                            >
                              {/* <p className='content' dangerouslySetInnerHTML={{ __html: value }}></p> */}
                              <p className="content">{value}</p>
                            </div>
                          </>
                        );
                      }
                    })()}
                    {/* <EditOutlined  className='icon-btn' onClick={() => openEditorModal('options', value, key)}/> */}
                    <ArrowUpOutlined
                      className={['icon-btn', index === 0 && 'disable']}
                      onClick={() => moveUpOption(index)}
                    />
                    <ArrowDownOutlined
                      className={['icon-btn', index === data.options.length - 1 && 'disable']}
                      onClick={() => moveDownOption(index)}
                    />
                    <CloseOutlined className="icon-btn" onClick={() => deleteOption(index, key)} />
                  </div>
                );
              })}
              <Button type="link" onClick={() => addOptions()}>
                添加选项
              </Button>
            </div>
          </div>
        ) : (
          <div className="edit-block answer">
            <span className="label-warp">
              <span className={getRequireClass('correct')}>题目答案</span>
            </span>
            <Input
              className="input"
              placeholder="请输入题目答案"
              value={data.correct}
              showCount
              maxLength={100}
              onChange={(e) => onEditChange(e.target.value, 'correct')}
            />
          </div>
        )}

        <div className="edit-block desc">
          <span className="label-warp">
            <span className="label">题目描述</span>
          </span>
          <Input
            className="input"
            placeholder="请输入题目描述"
            value={data.desc}
            showCount
            maxLength={50}
            onChange={(e) => onEditChange(e.target.value, 'desc')}
          />
        </div>
      </Modal>
      <EditorModal
        visible={visible}
        title="编辑详情"
        editType={editContentType}
        content={editContent}
        onHandleOk={(e) => onHandleOk(e)}
        onHandleCancel={() => onHandleCancel()}
      />
    </>
  );
}

export default EditTopic;

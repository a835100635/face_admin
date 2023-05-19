import React, { Component } from 'react';
import './topic.scss';
import { Input, Select, Table, Button, Tag, Tooltip, message, Popconfirm } from 'antd';
import { getCategoryList } from '@api/category';
import { getTopics, addTopic, updateTopic, deleteTopic } from '@api/topic';
import moment from 'moment';
import EditTopic from './editTopic';
import StatusTag from '@components/statusTag/statusTag';
import { TOPIC_TYPE_OPTIONS, ONLINE_OPTIONS, STATUS_OPTIONS, LEVEL_OPTIONS } from '@constants';

import FDatePicker from '@components/datePicker/datePicker.js';
class Topic extends Component {
  constructor() {
    super();
    this.levelOptions = LEVEL_OPTIONS;
    this.typeOptions = TOPIC_TYPE_OPTIONS;
    this.onlineOptions = ONLINE_OPTIONS;
    this.statusOptions = STATUS_OPTIONS;
    this.columns = [
      {
        title: '题目名称',
        key: 'topic',
        dataIndex: 'topic',
        width: 280,
        render: (text, record) => (
          <Tooltip title="prompt text">
            <span className="label">{record.topic}</span>
          </Tooltip>
        )
      },
      {
        title: '题目分类',
        key: 'categoryId',
        dataIndex: 'categoryId',
        render: (text, record) => <span>{this.state.categoryMap.get(record.categoryId).label}</span>
      },
      {
        title: '题目类型',
        key: 'type',
        dataIndex: 'type',
        render: (text, record) => (
          <span>{this.typeOptions.find((item) => item.value === record.type).label}</span>
        )
      },
      {
        title: '题目难度',
        key: 'level',
        dataIndex: 'level',
        render: (text, record) => (
          <span className="level">
            {this.levelOptions.find((item) => item.value === record.level).label}
          </span>
        )
      },
      {
        title: '上线状态',
        key: 'online',
        dataIndex: 'online',
        render: (text, record) => (
          <Tag color={record.online ? '#87d068' : ''}>
            {this.onlineOptions.find((item) => item.value === record.online).label}
          </Tag>
        )
      },
      {
        title: '审核状态',
        key: 'status',
        dataIndex: 'status',
        render: (text, record) => <StatusTag status={record.status} />
      },
      {
        title: '创建时间',
        key: 'createdTime',
        dataIndex: 'createdTime',
        render: (text, record) => (
          <span>{moment(record.createdTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        )
      },
      {
        title: '更新时间',
        key: 'updatedTime',
        dataIndex: 'updatedTime',
        render: (text, record) => (
          <span>{moment(record.updatedTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        )
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        render: (text, record) => (
          <span className="btns">
            <Button type="link">预览</Button>
            <Button type="link" onClick={() => this.handleEdit(record)}>
              编辑
            </Button>
            <Popconfirm
              description="确认删除此题目？"
              onConfirm={() => this.deleteTopic(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          </span>
        )
      }
    ];

    this.state = {
      categoryMap: new Map(),
      categoryOptions: [],
      total: 0,
      topicList: [],
      isModalOpen: false,
      editType: 'add',
      // 当前编辑的题目
      currentData: null,
      query: {
        topic: '',
        categoryId: '',
        type: '',
        level: '',
        online: '',
        status: '',
        startTime: '',
        endTime: '',
        detail: 1
      }
    };
  }

  componentDidMount() {
    this.getCategoryList();
    this.getTopicList();
  }
  // 获取分类列表
  getCategoryList() {
    getCategoryList().then((res) => {
      const list = [];
      Object.keys(res).forEach((key) => {
        list.push(...res[key]);
      });
      const categoryOptions = list.map((item) => ({
        label: item.categoryName,
        value: item.id
      }));
      categoryOptions.forEach((item) => {
        this.setState({
          categoryMap: this.state.categoryMap.set(item.value, item)
        });
      });
      this.setState({ categoryOptions });
    });
  }
  // 获取题目列表
  getTopicList() {
    getTopics(this.state.query).then((res) => {
      const { data, total } = res;
      this.setState({ topicList: data, total });
    });
  }

  changeInput(e) {
    this.setState(
      {
        query: {
          ...this.state.query,
          topic: e.target.value
        }
      },
      () => {
        this.getTopicList();
      }
    );
  }
  selectChange(value, key) {
    this.setState(
      {
        query: {
          ...this.state.query,
          [key]: !['', undefined].includes(value) ? value : ''
        }
      },
      () => {
        this.getTopicList();
      }
    );
  }

  handleEdit(record) {
    console.log(record);
    const data = record;
    const { options, correct } = data;
    data.options = JSON.parse(options);
    data.correct = correct.includes('[') ? JSON.parse(correct) : correct;
    this.setState(
      {
        currentData: record,
        editType: 'edit'
      },
      () => {
        this.openAddModal();
      }
    );
  }

  /*
   * modal
   */
  openAddModal() {
    this.setState({
      isModalOpen: true
    });
  }
  async handleModalOk(data) {
    const { options, correct, answer } = data;
    const params = {
      ...data,
      options: JSON.stringify(options),
      correct: typeof correct === 'string' ? correct : JSON.stringify(correct),
      // 过滤富文本 TODO: 后期过滤空格
      detail: answer === '<p><br></p>' ? '' : answer
    };
    try {
      if (this.state.editType === 'add') {
        await addTopic(params);
      } else {
        await updateTopic(params);
      }
      message.success('操作成功');
      this.setState({
        isModalOpen: false
      });
      this.getTopicList();
    } catch (error) {
      console.log(error);
    }
  }
  async deleteTopic(topicId) {
    try {
      await deleteTopic(topicId);
      message.success('删除成功');
      this.getTopicList();
    } catch (error) {
      console.log(error);
    }
  }
  handleModalCancel() {
    this.setState({
      isModalOpen: false
    });
  }
  onDateChange(dates, dateStrings) {
    this.setState(
      {
        query: {
          ...this.state.query,
          startTime: dateStrings[0],
          endTime: dateStrings[1]
        }
      },
      () => {
        this.getTopicList();
      }
    );
  }
  render() {
    return (
      <>
        <header className="filter-wrap">
          <div className="left">
            <Input
              className="filter-input"
              placeholder="输入题目名称"
              onPressEnter={(e) => this.changeInput(e)}
            />
            <Select
              allowClear
              placeholder="选择题目分类"
              style={{ width: 150 }}
              onChange={(categoryId) => this.selectChange(categoryId, 'categoryId')}
              options={this.state.categoryOptions}
            />
            <Select
              allowClear
              placeholder="选择题目类型"
              style={{ width: 150 }}
              onChange={(categoryId) => this.selectChange(categoryId, 'type')}
              options={this.typeOptions}
            />
            <Select
              allowClear
              placeholder="选择题目难度"
              style={{ width: 150 }}
              onChange={(categoryId) => this.selectChange(categoryId, 'level')}
              options={this.levelOptions}
            />
            <Select
              allowClear
              placeholder="上线状态"
              style={{ width: 150 }}
              onChange={(categoryId) => this.selectChange(categoryId, 'online')}
              options={this.onlineOptions}
            />
            <Select
              allowClear
              placeholder="审核状态"
              style={{ width: 150 }}
              onChange={(categoryId) => this.selectChange(categoryId, 'status')}
              options={this.statusOptions}
            />
            <FDatePicker onChange={(dates, dateStrings) => this.onDateChange(dates, dateStrings)} />
          </div>
          <div className="right">
            <Button type="primary" onClick={() => this.openAddModal()}>
              新增题目
            </Button>
          </div>
        </header>
        <Table
          className="topic-table"
          columns={this.columns}
          dataSource={this.state.topicList}
          rowKey={(i) => i.id}
        />

        <EditTopic
          currentData={this.state.currentData}
          editType={this.state.editType}
          isModalOpen={this.state.isModalOpen}
          categoryOptions={this.state.categoryOptions}
          onOk={(e) => this.handleModalOk(e)}
          onCancel={() => this.handleModalCancel()}
        />
      </>
    );
  }
}

export default Topic;

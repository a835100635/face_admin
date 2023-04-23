import React, {Component} from 'react';
import './topic.scss'
import { Input, Select, DatePicker, ConfigProvider, Table, Button, Tag, Tooltip } from 'antd';
import locale from 'antd/locale/zh_CN';
import { getCategoryList } from '../../../api/category';
import { getTopics, addTopic } from '../../../api/topic';
import moment from 'moment';
import EditTopic from './editTopic';
import { TOPIC_TYPE_OPTIONS, ONLINE_OPTIONS, STATUS_OPTIONS, LEVEL_OPTIONS, CHOICE_TYPE, JUDGE_TYPE } from '../../../constants';


const { RangePicker } = DatePicker;

class Topic extends Component {
    constructor() {
      super();
      this.levelOptions = LEVEL_OPTIONS;
      this.typeOptions = TOPIC_TYPE_OPTIONS;
      this.onlineOptions = ONLINE_OPTIONS
      this.statusOptions = STATUS_OPTIONS
      this.columns = [
        {
          title: '题目名称',
          key: 'topic',
          dataIndex: 'topic',
          width: 280,
          render: (text, record) => (
            <Tooltip title="prompt text">
              <span className='label'>{record.topic}</span>
            </Tooltip>
          )
        },
        {
          title: '题目分类',
          key: 'categoryId',
          dataIndex: 'categoryId',
          render: (text, record) => (
            <span>{this.state.categoryMap.get(record.categoryId).label}</span>
          )
        },
        {
          title: '题目类型',
          key: 'type',
          dataIndex: 'type',
          render: (text, record) => (
            <span>{this.typeOptions.find(item => item.value === record.type).label}</span>
          )
        },
        {
          title: '题目难度',
          key: 'level',
          dataIndex: 'level',
          render: (text, record) => (
            <span className='level'>{this.levelOptions.find(item => item.value === record.level).label}</span>
          )
        },
        {
          title: '上线状态',
          key: 'online',
          dataIndex: 'online',
          render: (text, record) => (
            <Tag color={record.online ? '#87d068' : ''}>
              {this.onlineOptions.find(item => item.value === record.online).label}
            </Tag>
          )
        },
        {
          title: '审核状态',
          key: 'status',
          dataIndex: 'status',
          render: (text, record) => (
            <Tag color={(() => {
              switch (record.status) {
                case 0:
                  return '#2db7f5';
                case 1:
                  return '#87d068';
                case 2:
                  return '#f50';
                default:
                  return '';
              }
            })()}>
              {this.statusOptions.find(item => item.value === record.status).label}
            </Tag>
          )
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
          title: '操作',
          key: 'action',
          width: 120,
          render: (text, record) => (
            <span className='btns'>
              <Button type="link">预览</Button>
              <Button type="link" onClick={() => this.handleEdit(record)}>编辑</Button>
              <Button type="link" onClick={() => this.handleDelete(record)}>删除</Button>
            </span>
          ),
        }
      ]

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
      getCategoryList().then(res => {
        const list = [];
        Object.keys(res).forEach((key) => {
          list.push(...res[key])
        })
        const categoryOptions = list.map(item => ({
          label: item.categoryName,
          value: item.id
        }));
        categoryOptions.forEach(item => {
          this.setState({
            categoryMap: this.state.categoryMap.set(item.value, item)
          });
        });
        this.setState({ categoryOptions });
      })
    }
    // 获取题目列表
    getTopicList() {
      getTopics(this.state.query).then(res => {
        this.setState({ topicList: res.data, total: res.total });
      })
    }
    handleDelete(record) {
      console.log(record);

    }

    changeInput(e) {
      this.setState({
        query: {
          ...this.state.query,
          topic: e.target.value
        }
      },() => {
        this.getTopicList();
      });
    }
    selectChange(value, key) {
      this.setState({
        query: {
          ...this.state.query,
          [key]: !['', undefined].includes(value) ? value : ''
        }
      }, () => {
        this.getTopicList();
      })
    }

    handleEdit(record) {
      console.log(record);
      this.setState({
        currentData: record,
        editType: 'edit'
      }, () => {
        this.openAddModal();
      })
    }

    /*
    * modal
    */
    openAddModal() {
      console.log('openAddModal')
      this.setState({
        isModalOpen: true
      })
    }
    handleModalOk(data) {
      console.log('handleModalOk', data);
      const { type, options, correct } = data;
      const params = {
        ...data,
        options: JSON.stringify(options),
        correct: [CHOICE_TYPE, JUDGE_TYPE].includes(type) ? JSON.stringify(correct) : correct
      };
      addTopic(params).then(res => {
        console.log('addTopic--', res);
      });
      // this.setState({
      //   isModalOpen: false
      // })
    }
    handleModalCancel() {
      console.log('handleModalCancel')
      this.setState({
        isModalOpen: false
      })
    }

    render() {
      return (
          <>
            <header className='filter-wrap'>
              <div className='left'>
                <Input className='filter-input' placeholder="输入题目名称" onPressEnter={(e) => this.changeInput(e)}/>
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
                <ConfigProvider locale={locale}>
                  <RangePicker />
                </ConfigProvider>
              </div>
              <div className='right'>
                <Button type="primary" onClick={() => this.openAddModal()}>新增题目</Button>
              </div>
            </header>
            <Table className='topic-table' columns={this.columns} dataSource={this.state.topicList} rowKey={i => i.id}/>

            <EditTopic
              currentData={this.state.currentData}
              editType={this.state.editType}
              isModalOpen={this.state.isModalOpen} 
              categoryOptions={this.state.categoryOptions}
              onOk={(e) => this.handleModalOk(e)} 
              onCancel={() => this.handleModalCancel()}/>
          </>
      );
    }
}

export default Topic;
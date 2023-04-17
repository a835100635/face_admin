import React, {Component} from 'react';
import './topic.scss'
import { Input, Select, DatePicker, ConfigProvider, Table, Button, Tag, Tooltip } from 'antd';
import locale from 'antd/locale/zh_CN';
import { getCategoryList } from '../../../api/category';
import { getTopics } from '../../../api/topic';
import moment from 'moment';

const { RangePicker } = DatePicker;

class Topic extends Component {
    constructor() {
      super();
      this.state = {
        categoryMap: new Map(),
        categoryOptions: [],
        total: 0,
        topicList: [],
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
      }).catch(err => {
        console.log(err);
      })
    }

    render() {
      const levelOptions = Array.from({ length: 5 }, (v, k) => ({
          label: k + 1,
          value: k + 1
      }));
      const typeOptions = [
          { label: '选择题', value: 1 },
          { label: '填空', value: 2 },
          { label: '判断题', value: 3 },
          { label: '开放题', value: 4 },
      ];
      const onlineOptions = [
        { label: '下线', value: 0 },
        { label: '上线', value: 1 }
      ]
      const statusOptions = [
        { label: '待审核', value: 0 },
        { label: '审核通过', value: 1 },
        { label: '审核不通过', value: 2 },
      ]
      const columns = [
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
            <span>{typeOptions.find(item => item.value === record.type).label}</span>
          )
        },
        {
          title: '题目难度',
          key: 'level',
          dataIndex: 'level',
        },
        {
          title: '上线状态',
          key: 'online',
          dataIndex: 'online',
          render: (text, record) => (
            <Tag color={record.online ? '#87d068' : ''}>
              {onlineOptions.find(item => item.value === record.online).label}
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
              {statusOptions.find(item => item.value === record.status).label}
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
              <Button type="link">编辑</Button>
              <Button type="link">删除</Button>
            </span>
          ),
        }
      ]
      const handleChange = value => { console.log(value) }
      return (
          <>
            <header className='filter-wrap'>
              <Input className='filter-input' placeholder="输入题目名称" />
              <Select
                allowClear
                placeholder="选择题目分类"
                style={{ width: 150 }}
                onChange={handleChange}
                options={this.state.categoryOptions}
              />
              <Select
                allowClear
                placeholder="选择题目类型"
                style={{ width: 150 }}
                onChange={handleChange}
                options={typeOptions}
              />
              <Select
                allowClear
                placeholder="选择题目难度"
                style={{ width: 150 }}
                onChange={handleChange}
                options={levelOptions}
              />
              <Select
                allowClear
                placeholder="上线状态"
                style={{ width: 150 }}
                onChange={handleChange}
                options={onlineOptions}
              />
              <Select
                allowClear
                placeholder="审核状态"
                style={{ width: 150 }}
                onChange={handleChange}
                options={statusOptions}
              />
              <ConfigProvider locale={locale}>
                <RangePicker />
              </ConfigProvider>
            </header>
            <Table className='topic-table' columns={columns} dataSource={this.state.topicList} rowKey={i => i.id}/>
          </>
      );
    }
}

export default Topic;
import { Modal, Form, Input, Button, Select, Checkbox, message } from 'antd'; 
import { CloseOutlined, ArrowUpOutlined, ArrowDownOutlined, EditOutlined } from '@ant-design/icons';
import { TOPIC_TYPE_OPTIONS, LEVEL_OPTIONS, BLANKS_TYPE, OPEN_TYPE } from '../../../constants';
import { useState, useEffect } from 'react';
import './editTopic.scss'
import EditorModal from '../../../components/editorModal/editorModal'
import hljs from 'highlight.js';

function EditTopic(props) {
    const [messageApi, contextHolder] = message.useMessage();
    const { editType, currentData, isModalOpen, onOk, onCancel,
        categoryOptions } = props;
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const defaultData = {
        topic: '',
        categoryId: '',
        answer: "",
        type: '',
        level: '',
        online: 0,
        status: 0,
        options: {},
        correct: '',
        desc: ''
    }
    // 编辑内容
    const [data, setData] = useState(currentData || defaultData);
    // 编辑器弹窗
    const [visible, setVisible] = useState(false);
    // 编辑内容
    const [editContent, setEditContent] = useState('');
    // 编辑内容类型
    const [editContentType, setEditContentType] = useState({type: '', key: ''});
    // 增加选项
    const addOptions = () => {
        // ASCII 65 -> A
        const optionsLength = Object.keys(data.options).length;
        const currentIndex = optionsLength + 65;
        const optionLabel = String.fromCharCode(currentIndex).toLocaleUpperCase();
        setData({
            ...data,
            options: {
                ...data.options,
                [optionLabel]: ''
            }
        })
    }
    // 打开编辑器弹窗
    const openEditorModal = (type, data, key) => {
        setEditContent(data)
        setEditContentType({type, key})
        setVisible(true)
    }
    // 编辑器弹窗确定
    const onHandleOk = (value) => {
        const { editType, content } = value;
        const { type, key } = editType;
        console.log('===', type, content)
        setVisible(false)
        // 答案
        if (type === 'answer') {
            setData({
                ...data,
                answer: content
            })
        }
        // 选择题
        if (type === 'options') {
            setData({
                ...data,
                options: {
                    ...data.options,
                    [key]: content
                }
            })
        }
        setEditContentType({type: '', key: ''})
        setEditContent('')
    }
    // 编辑器弹窗取消
    const onHandleCancel = () => {
        setVisible(false)
    }
    // 代码高亮
    useEffect(()=>{
        document.querySelectorAll("pre code").forEach(block => {
            try{hljs.highlightBlock(block);}
            catch(e){console.log(e);}
        });
    });
    // 删除选项
    const deleteOption = (key) => {
        const options = data.options;
        delete options[key];
        const newOptions = updateOptionsKey(options)
        setData({
            ...data,
            options: newOptions
        });
    }
    // 上移选项
    const moveUpOption = (key) => {
        const options = data.options;
        const optionsValue = Object.entries(options);
        const index = optionsValue.findIndex(item => item[0] === key);
        if (index === 0) return;
        const temp = optionsValue[index];
        optionsValue[index] = optionsValue[index - 1];
        optionsValue[index - 1] = temp;
        const newOptions = updateOptionsKey(Object.fromEntries(optionsValue))
        setData({
            ...data,
            options: newOptions
        });
    }
    // 下移选项
    const moveDownOption = (key) => {
        const options = data.options;
        const optionsValue = Object.entries(options);
        const index = optionsValue.findIndex(item => item[0] === key);
        if (index === optionsValue.length - 1) return;
        const temp = optionsValue[index];
        optionsValue[index] = optionsValue[index + 1];
        optionsValue[index + 1] = temp;
        const newOptions = updateOptionsKey(Object.fromEntries(optionsValue))
        setData({
            ...data,
            options: newOptions
        });
    }
    // 更新选项key
    const updateOptionsKey = (options) => {
        const optionsValue = Object.entries(options);
        optionsValue.forEach((item, index) => {
            const key = String.fromCharCode(index + 65).toLocaleUpperCase()
            item[0] = key;
        });
        return Object.fromEntries(optionsValue);
    }
    // 是否显示选项
    const [isShowOptions, setIsShowOptions] = useState(true);
    // 题目类型改变
    const onTypeChange = (value) => {
        setIsShowOptions(![OPEN_TYPE, BLANKS_TYPE].includes(value))
    }
    // 确定提交
    const onOkAction = () => {
        form.validateFields().then(values => {
            const { topic, categoryId, type, level, online, status } = values;
            const { answer, options, correct, desc } = data;
            const params = {
                topic,
                categoryId,
                type,
                level,
                online,
                status,
                answer,
                options,
                correct,
                desc
            }
            console.log('values', values)
            // if (editType === 'add') {
            //     addTopic(params)
            // } else {
            //     editTopic(params)
            // }

            //
            // onOk()
        }).catch((error) => {
            console.log('error', error)
            messageApi.open({
                type: 'error',
                content: '请补充完整信息'
            })
        })
    }

    return (
        <>
            {contextHolder}
            <Modal  
                style={{ top: 20 }}
                className='edit-topic-modal'
                title={editType === 'add' ? '新增题目' :  `编辑题目-“${currentData.topic}”`} 
                open={isModalOpen} 
                onOk={onOkAction} 
                onCancel={onCancel}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="题目名称"
                        name="topic"
                        rules={[{ required: true, message: '请输入题目名称' }]}
                        >
                        <Input placeholder="请输入题目名称"/>
                    </Form.Item>

                    <Form.Item
                        label="题目分类"
                        name="categoryId"
                        rules={[{ required: true, message: '请选择题目分类' }]}
                        >
                        <Select 
                            placeholder="选择题目分类"
                            style={{ width: 120 }}
                            options={categoryOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        label="题目类型"
                        name="type"
                        rules={[{ required: true, message: '请选择题目类型' }]}
                        >
                        <Select
                            placeholder="选择题目类型"
                            style={{ width: 120 }}
                            options={TOPIC_TYPE_OPTIONS}
                            onChange={onTypeChange}
                        />
                    </Form.Item>

                    <Form.Item
                        label="难易程度"
                        name="level"
                        rules={[{ required: true, message: '请选择难易程度' }]}
                        >
                        <Select
                            placeholder="选择题目类型"
                            style={{ width: 120 }}
                            options={LEVEL_OPTIONS}
                        />
                    </Form.Item>

                    <Form.Item
                        label="解析"
                        name="answer"
                        rules={[{ required: true, message: '请输入题目解析' }]}
                        >
                        <div className="answer-content">
                            <div className='content-wrap'>
                                {/* <p className='content' dangerouslySetInnerHTML={{ __html: data.answer }}></p> */}
                                <Input placeholder="请输入题目名称" value={data.answer}/>
                            </div>
                            <EditOutlined className='btn' onClick={() => openEditorModal('answer', data.answer)}/>
                        </div>
                    </Form.Item>
                    {/* 填空题不展示选项 */}
                    { isShowOptions &&
                        <Form.Item
                            label="选项"
                            name="correct"
                            rules={[{ required: true, message: '请选择选项' }]}
                            >
                            <div className="options">
                                {
                                    Object.entries(data.options).map(([key, value], index) => {
                                        return (
                                            <div className='options-style' key={index}>
                                                <Checkbox>{key}</Checkbox>
                                                <div className='content-wrap' >
                                                    <p className='content' dangerouslySetInnerHTML={{ __html: value }}></p>
                                                </div>
                                                <EditOutlined className='icon-btn' onClick={() => openEditorModal('options', value, key)}/>
                                                <ArrowUpOutlined className='icon-btn' onClick={() => moveUpOption(key)}/>
                                                <ArrowDownOutlined className='icon-btn' onClick={() => moveDownOption(key)}/>
                                                <CloseOutlined className='icon-btn' onClick={() => deleteOption(key, index)}/>
                                            </div>
                                        )
                                    })
                                }
                                <Button type="link" onClick={() => addOptions()}>
                                    添加选项
                                </Button>
                            </div>
                        </Form.Item>
                    }
                    <Form.Item
                        label="描述"
                        name="desc"
                        rules={[{ required: false, message: '对此题的描述' }]}
                        >
                        <Input placeholder="对此题的描述"/>
                    </Form.Item>
                </Form>
            </Modal>
            <EditorModal 
                visible={visible} 
                title='编辑详情'
                editType={editContentType}
                content={editContent}
                onHandleOk={(e) => onHandleOk(e)} 
                onHandleCancel={() => onHandleCancel()} />
        </>
    )
}

export default EditTopic;
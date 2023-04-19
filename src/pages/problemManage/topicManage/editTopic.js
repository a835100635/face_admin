import { Modal, Form, Input, Button, Select, Checkbox } from 'antd'; 
import { CloseOutlined, ArrowUpOutlined, ArrowDownOutlined, EditOutlined } from '@ant-design/icons';
import { TOPIC_TYPE_OPTIONS, LEVEL_OPTIONS } from '../../../constants';
import { useState, useEffect } from 'react';
import './editTopic.scss'
import EditorModal from '../../../components/editorModal/editorModal'
import hljs from 'highlight.js';

function EditTopic(props) {
    const { editType, currentData, isModalOpen, onOk, onCancel,
        categoryOptions } = props;
    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const defaultData = {
        topic: '',
        categoryId: '',
        answer: "<pre><code >function(){ console.log('eee') }</code></pre><p><br></p>",
        type: '',
        level: '',
        online: 0,
        status: 0,
        options: {},
        correct: '',
        desc: ''
    }
    const [data, setData] = useState(currentData || defaultData);
    const [visible, setVisible] = useState(false);
    // 编辑内容
    const [editContent, setEditContent] = useState('');
    // 编辑内容类型
    const [editContentType, setEditContentType] = useState({type: '', key: ''});

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

    const openEditorModal = (type, data, key) => {
        setEditContent(data)
        setEditContentType({type, key})
        setVisible(true)
    }

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
    const onHandleCancel = () => {
        setVisible(false)
    }

    useEffect(()=>{
        document.querySelectorAll("pre code").forEach(block => {
            try{hljs.highlightBlock(block);}
            catch(e){console.log(e);}
        });
    });

    return (
        <>
            <Modal 
                className='edit-topic-modal'
                title={editType === 'add' ? '新增题目' :  `编辑题目-“${currentData.topic}”`} 
                open={isModalOpen} 
                onOk={onOk} 
                onCancel={onCancel}>
                <Form
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
                        />
                    </Form.Item>

                    <Form.Item
                        label="难易程度"
                        name="type"
                        rules={[{ required: true, message: '请选择难易程度' }]}
                        >
                        <Select
                            placeholder="选择题目类型"
                            style={{ width: 120 }}
                            options={LEVEL_OPTIONS}
                        />
                    </Form.Item>

                    <Form.Item
                        label="难易程度"
                        name="type"
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
                        rules={[{ required: false, message: '请输入题目解析' }]}
                        >
                        <div className="answer-content">
                            <div className='content-wrap'>
                                <p className='content' dangerouslySetInnerHTML={{ __html: data.answer }}></p>
                            </div>
                            <EditOutlined className='btn' onClick={() => openEditorModal('answer', data.answer)}/>
                        </div>
                    </Form.Item>

                    <Form.Item
                        label="选项"
                        name="options"
                        rules={[{ required: true, message: '请选择难易程度' }]}
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
                                            <ArrowUpOutlined className='icon-btn' />
                                            <ArrowDownOutlined className='icon-btn' />
                                            <CloseOutlined className='icon-btn' />
                                        </div>
                                    )
                                })
                            }
                            <Button type="link" onClick={() => addOptions()}>
                                添加选项
                            </Button>
                        </div>
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                            

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
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
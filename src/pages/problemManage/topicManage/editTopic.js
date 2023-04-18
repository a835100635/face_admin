import { Modal } from 'antd'; 

function EditTopic(props) {
    const { editType, currentData, isModalOpen, onOk, onCancel } = props;
    return (
        <Modal  
            title={editType === 'add' ? '新增题目' :  `编辑题目-${currentData.topic}`} 
            open={isModalOpen} 
            onOk={onOk} 
            onCancel={onCancel}>
            dddd
        </Modal>
    )
}

export default EditTopic;
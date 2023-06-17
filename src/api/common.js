import { $post } from './base';

// 删除文件接口
export const deleteFile = (data) => $post('/api/common/deleteFile', data);

// 上传文件接口
export const uploadFile = (data) => $post('/api/common/uploadFile', data);

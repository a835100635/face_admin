import { $post, $get } from './base';

// 上传资源
export const addResource = (data) => $post('/api/resource', data);
// 资源列表
export const getResourceList = (data) => $get('/api/resource', data);
// 详情
export const getResourceDetail = (id) => $get(`/api/resource/${id}`);
// 编辑
export const editResource = (data) => $post('/api/resource/update', data);

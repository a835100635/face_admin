import { $post, $get } from './base';

// 上传资源
export const uploadResource = (data) => $post('/api/resource', data);
// 资源列表
export const getResourceList = (data) => $get('/api/resource', data);

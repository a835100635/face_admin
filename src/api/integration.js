import { $get, $post } from './base';

// 分类列表
export const integrationTypeList = (data) => $get('/api/integrationType/list', data);
// 新增积分类型
export const integrationTypeAdd = (data) => $post('/api/integrationType/add', data);
// 更新积分类型
export const integrationTypeUpdate = (data) => $post('/api/integrationType/update', data);
// 删除积分类型
export const integrationTypeDelete = (data) => $post('/api/integrationType/delete', data);

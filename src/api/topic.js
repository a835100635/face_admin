import { $get, $post, $put, $delete } from './base';

// 获取题目列表
export const getTopics = (params) => $get('/api/topic', params);
// 新增题目
export const addTopic = (params) => $post('/api/topic', params);
// 更新题目
export const updateTopic = (params) => $put('/api/topic', params);
// 删除题目
export const deleteTopic = (topicId) => $delete(`/api/topic/${topicId}`);

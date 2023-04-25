import { $get, $post, $put, $delete } from './base';

// 分类列表
export const getCategoryList = () => $get('/api/category');
// 新建分类
export const addCategoryData = (data) => $post('/api/category', data);
// 编辑分类
export const updateCategoryData = (data) => $put('/api/category', data);
// 删除分类
export const deleteCategoryAction = (id) => $delete(`/api/category/${id}`);

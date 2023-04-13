import { $get, $post } from "./base";

// 分类列表
export const getCategoryList = () => $get("/api/category");
// 新建分类
export const addCatrgotyData = (data) => $post("/api/category", data);
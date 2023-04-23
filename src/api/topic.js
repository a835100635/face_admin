import { $get, $post } from "./base";

// 获取题目列表
export const getTopics = (params) => $get("/api/topic", params);
// 新增题目
export const addTopic = (params) => $post("/api/topic", params);

import { $get } from "./base";

// 获取话题列表
export const getTopics = (params) => $get("/api/topic", params);
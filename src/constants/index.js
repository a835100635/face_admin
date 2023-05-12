// 选择题
export const CHOICE_TYPE = 1;
// 填空
export const BLANKS_TYPE = 2;
// 判断题
export const JUDGE_TYPE = 3;
// 开放题
export const OPEN_TYPE = 4;

// 题目类型
export const TOPIC_TYPE_OPTIONS = [
  { label: '选择题', value: CHOICE_TYPE },
  { label: '填空', value: BLANKS_TYPE },
  { label: '判断题', value: JUDGE_TYPE },
  { label: '开放题', value: OPEN_TYPE }
];
// 上线状态
export const ONLINE_OPTIONS = [
  { label: '下线', value: 0 },
  { label: '上线', value: 1 }
];
// 审核状态
export const STATUS_OPTIONS = [
  { label: '待审核', value: 0 },
  { label: '审核通过', value: 1 },
  { label: '审核不通过', value: 2 }
];
// 难度等级
export const LEVEL_OPTIONS = [
  { label: '基础', value: 1 },
  { label: '简单', value: 2 },
  { label: '中等', value: 3 },
  { label: '困难', value: 4 },
  { label: '高级', value: 5 }
];
// 内容类型
export const CONTENT_TYPE = {
  // 文本
  TEXT: 1,
  // 富文本
  RICH_TEXT: 2
};
// 编辑类型
export const EDIT_TYPE = {
  // 新增
  ADD: 1,
  // 编辑
  EDIT: 2
};
// 富文本编辑类型
export const EDITOR_TYPE = {
  // 答案
  ANSWER: 1,
  // 选项
  OPTION: '2'
};
// 分类类型
export const CATEGORY_TYPE = {
  // 前端
  FRONT_END: {
    label: '前端',
    value: 1
  },
  // 后端
  BACK_END: {
    label: '后端',
    value: 2
  },
  // 测试
  TEST: {
    label: '测试',
    value: 3
  },
  // 数据库
  DATABASE: {
    label: '数据库',
    value: 4
  },
  // 云计算
  CLOUD_COMPUTING: {
    label: '云计算',
    value: 5
  },
  // 运维
  OPERATION_AND_MAINTENANCE: {
    label: '运维',
    value: 6
  },
  // 大数据
  BIG_DATA: {
    label: '大数据',
    value: 7
  },
  // 人工智能
  ARTIFICIAL_INTELLIGENCE: {
    label: '人工智能',
    value: 8
  },
  // 区块链
  BLOCK_CHAIN: {
    label: '区块链',
    value: 9
  },
  // 物联网
  INTERNET_OF_THINGS: {
    label: '物联网',
    value: 10
  },
  // 游戏开发
  GAME_DEVELOPMENT: {
    label: '游戏开发',
    value: 11
  },
  // 安全
  SECURITY: {
    label: '安全',
    value: 12
  },
  // 资源
  RESOURCE: {
    label: '资源',
    value: 13,
    special: true
  },
  // 资讯
  INFORMATION: {
    label: '资讯',
    value: 14,
    special: true
  },
  // 其他
  OTHER: {
    label: '其他',
    value: -1
  }
};

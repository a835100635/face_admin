import { change_resource_category } from './actionCreatores';

//默认数据
const defaultState = {
  // 资源分类
  resourceCategory: []
};

export default (state = defaultState, action) => {
  //就是一个方法函数
  console.log(state, action);
  switch (action.type) {
    case change_resource_category().type:
      return {
        ...state,
        resourceCategory: action.value
      };
    default:
      return state;
  }
};

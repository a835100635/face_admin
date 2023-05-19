import { createStore, applyMiddleware, compose } from 'redux'; // 引入createStore方法
import reducer from './reducer'; // 引入reducer
import thunk from 'redux-thunk'; // 引入redux-thunk

// 浏览器插件redux需要看数据必须添加这个
// createStore 第二个参数 window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));

// 创建数据存储仓库
const store = createStore(reducer, enhancer);

// 订阅变化
// 变化时,打印数据
store.subscribe(() => console.log('store====>', store.getState()));

//暴露出去
export default store;

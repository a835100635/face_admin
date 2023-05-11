import Axios from 'axios';
import { message as Message } from 'antd';

// 错误集合
const errorMap = new Map();

// 全局设置
const axiosInstance = Axios.create({
  baseURL: '',
  timeout: 5000,
  withCredentials: true
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 发送请求前做些什么
    config.headers['X-ProductName'] = process.env.REACT_APP_PRODUCT_NAME;
    config.headers['X-Face-Token'] = process.env.REACT_APP_FACE_TOKEN;

    return config;
  },
  (error) => {
    console.log(error);
    // 请求错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  async (response) => {
    // 对响应数据做点什么
    const { data, status, code, message } = response;
    if (status === 200) {
      const { code: dataCode, message: dataMessage } = data;
      if (dataCode === -1) {
        Message.error(dataMessage || '请求错误');
        return Promise.reject(dataMessage);
      }
      return Promise.resolve(data.data);
    } else {
      return Promise.reject(
        data || {
          code,
          data,
          message
        }
      );
    }
  },
  (error) => {
    // 请求错误处理
    const { response } = error;
    const { data, status } = response || {};
    if (response && data) {
      // 业务错误
      error.code = status;
      error.message = data.message;
    }
    // 避免重复提示
    if (!errorMap.has(error.code)) {
      errorMap.set(error.code, true);
      Message.error(error.message || '请求错误');
      setTimeout(() => {
        errorMap.delete(error.code);
      }, 3000);
    }
    return Promise.reject(error);
  }
);

export const $get = async (url, data = {}, configs = {}) => {
  return axiosInstance.get(url, {
    ...configs,
    params: data
  });
};
export const $delete = async (url, data = {}, configs = {}) => {
  return axiosInstance.delete(url, {
    ...configs,
    params: data
  });
};
export const $post = async (url, data = {}, configs = {}) => {
  return axiosInstance.post(url, data, configs);
};
export const $put = async (url, data = {}, configs = {}) => {
  return axiosInstance.put(url, data, configs);
};

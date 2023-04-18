import Axios from 'axios';
// import { message } from 'antd';

// 全局设置
const axiosInstance = Axios.create({
  baseURL: '',
  timeout: 5000,
  withCredentials: true
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  config => {
    // 发送请求前做些什么
    config.headers['X-ProductName'] = 'Face';
    config.headers['X-Face-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6Im94eFFwNC1iMjNHVmRDNTBZX2tYZktlUC1RTE0iLCJpYXQiOjE2ODE4MTI3MDAsImV4cCI6MTY4MjQxNzUwMH0.BeIWFLC5UdeVyleLZJhKPMo1n6tmZArXZb9F6Yer__A';

    return config;
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  response => {
    console.log('====', response)
    // 对响应数据做点什么
    const { data, status, code, message } = response;
    if (status === 200) {
      return Promise.resolve(data.data);
    } else {
      message.error('sdd')
      return Promise.reject(data || {
        code,
        data,
        message
      });
    }
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

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useUserStore } from '@/stores';
import { message } from 'antd';

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求队列（用于存储需要重新发送的请求）
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 添加请求到队列
const addSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// 通知队列中的请求重新发送
const notifySubscribers = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 store 中获取 token
    const token = useUserStore.getState().token;
    if (token && config.headers) {
      config.headers['token'] = token;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    // 如果响应代码不是 1，说明请求失败
    if (res.code !== 1 && res.code !== 200) {
      message.error(res.msg || '请求失败');

      // 401: Token 过期或无效
      if (res.code === 401) {
        useUserStore.getState().clearUserInfo();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      return Promise.reject(new Error(res.msg || '请求失败'));
    }

    return res;
  },
  (error: AxiosError) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          message.error('登录已过期，请重新登录');
          useUserStore.getState().clearUserInfo();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          break;
        case 403:
          message.error('没有权限访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error('网络错误');
      }
    } else {
      message.error('网络连接失败');
    }

    return Promise.reject(error);
  }
);

// 封装 GET 请求
export const get = <T = unknown>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig) => {
  return request.get<unknown, T>(url, { params, ...config });
};

// 封装 POST 请求
export const post = <T = unknown>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig) => {
  return request.post<unknown, T>(url, data, config);
};

// 封装 PUT 请求
export const put = <T = unknown>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig) => {
  return request.put<unknown, T>(url, data, config);
};

// 封装 DELETE 请求
export const del = <T = unknown>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig) => {
  return request.delete<unknown, T>(url, { params, ...config });
};

export default request;

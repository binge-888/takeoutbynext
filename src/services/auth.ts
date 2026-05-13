import { get, post, put } from '@/utils/request';
import type { ApiResponse, LoginResult, UserInfo } from '@/types';

// 登录
export const login = (data: { username: string; password: string }) => {
  return post<ApiResponse<LoginResult>>('/admin/employee/login', data);
};

// 退出登录
export const logout = () => {
  return post<ApiResponse<null>>('/admin/employee/logout');
};

// 获取登录用户信息
export const getUserInfo = () => {
  return get<ApiResponse<UserInfo>>('/admin/employee/info');
};

// 修改密码
export const updatePassword = (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  return put<ApiResponse<null>>('/admin/employee/password', data);
};

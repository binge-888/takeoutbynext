import { get, post, put, del } from '@/utils/request';
import type { ApiResponse, Dish, PageParams, PageResult } from '@/types';

// 获取菜品分页列表
export const getDishPage = (params: PageParams & { categoryId?: number; name?: string; status?: number }) => {
  return get<ApiResponse<PageResult<Dish>>>('/admin/dish/page', params);
};

// 根据id获取菜品
export const getDishById = (id: number) => {
  return get<ApiResponse<Dish>>(`/admin/dish/${id}`);
};

// 新增菜品
export const addDish = (data: Omit<Dish, 'id'>) => {
  return post<ApiResponse<null>>('/admin/dish', data);
};

// 修改菜品
export const updateDish = (data: Dish) => {
  return put<ApiResponse<null>>('/admin/dish', data);
};

// 删除菜品
export const deleteDish = (ids: number[]) => {
  return del<ApiResponse<null>>(`/admin/dish?ids=${ids.join(',')}`);
};

// 启用/禁用菜品
export const toggleDishStatus = (params: { id: number; status: number }) => {
  return post<ApiResponse<null>>('/admin/dish/status', params);
};

// 获取菜品列表（不分页，用于下拉选择）
export const getDishList = (params?: { categoryId?: number; name?: string }) => {
  return get<ApiResponse<Dish[]>>('/admin/dish/list', params);
};

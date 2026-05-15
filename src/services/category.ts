import { get, post, put, del } from '@/utils/request';
import type { ApiResponse, Category, PageParams, PageResult } from '@/types';

// 获取分类列表（分页）
export const getCategoryPage = (params: PageParams & { type?: number; name?: string }) => {
  return get<ApiResponse<PageResult<Category>>>('/admin/category/page', params);
};

// 获取分类列表（不分页）
export const getCategoryList = (params?: { type?: number }) => {
  return get<ApiResponse<Category[]>>('/admin/category/list', params);
};

// 新增分类
export const addCategory = (data: Omit<Category, 'id'>) => {
  return post<ApiResponse<null>>('/admin/category', data);
};

// 修改分类
export const updateCategory = (data: Category) => {
  return put<ApiResponse<null>>('/admin/category', data);
};

// 删除分类
export const deleteCategory = (id: number) => {
  return del<ApiResponse<null>>(`/admin/category/${id}`);
};

// 启用/禁用分类
export const toggleCategoryStatus = (params: { id: number; status: number }) => {
  return post<ApiResponse<null>>('/admin/category/status', params);
};

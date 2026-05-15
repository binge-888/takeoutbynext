import { get } from '@/utils/request';
import type {
  ApiResponse,
  TurnoverReport,
  UserReport,
  OrderReport,
  SalesTop10Report,
  WorkspaceData,
  OrderOverview,
  DishOverview,
  SetmealOverview,
} from '@/types';

// 营业额统计
export const getTurnoverStatistics = (params: { begin: string; end: string }) => {
  return get<ApiResponse<TurnoverReport>>('/admin/report/turnoverStatistics', params);
};

// 用户统计
export const getUserStatistics = (params: { begin: string; end: string }) => {
  return get<ApiResponse<UserReport>>('/admin/report/userStatistics', params);
};

// 订单统计
export const getOrdersStatistics = (params: { begin: string; end: string }) => {
  return get<ApiResponse<OrderReport>>('/admin/report/ordersStatistics', params);
};

// 销量排名Top10
export const getTop10 = (params: { begin: string; end: string }) => {
  return get<ApiResponse<SalesTop10Report>>('/admin/report/top10', params);
};

// 导出运营数据报表
export const exportBusinessData = (params: { begin: string; end: string }) => {
  return get<Blob>(`/admin/report/export?begin=${params.begin}&end=${params.end}`, undefined, {
    responseType: 'blob',
  });
};

// 工作台今日数据
export const getWorkspaceData = () => {
  return get<ApiResponse<WorkspaceData>>('/admin/workspace/businessData');
};

// 订单概览
export const getOrderOverview = () => {
  return get<ApiResponse<OrderOverview>>('/admin/workspace/overviewOrders');
};

// 菜品概览
export const getDishOverview = () => {
  return get<ApiResponse<DishOverview>>('/admin/workspace/overviewDishes');
};

// 套餐概览
export const getSetmealOverview = () => {
  return get<ApiResponse<SetmealOverview>>('/admin/workspace/overviewSetmeals');
};

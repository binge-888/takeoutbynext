// 全局类型定义

// API 响应通用结构
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// 分页请求参数
export interface PageQuery {
  page: number;
  pageSize: number;
}

// 分页响应数据
export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

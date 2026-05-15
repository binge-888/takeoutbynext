// 通用响应类型
export interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data: T;
}

// 分页请求参数
export interface PageParams {
  page?: number;
  pageSize?: number;
}

// 分页响应数据
export interface PageResult<T> {
  total: number;
  records: T[];
}

// 用户信息
export interface UserInfo {
  id: number;
  name: string;
  username: string;
  password?: string;
  phone?: string;
  sex?: string;
  idNumber?: string;
  avatar?: string;
  status: number;
  createTime?: string;
  updateTime?: string;
  createUser?: number;
  updateUser?: number;
}

// 登录响应
export interface LoginResult {
  id: number;
  userName: string;
  name: string;
  token: string;
}

// 分类
export interface Category {
  id?: number;
  type?: number;
  name: string;
  sort?: number;
  status?: number;
  createTime?: string;
  updateTime?: string;
  createUser?: number;
  updateUser?: number;
}

// 菜品
export interface Dish {
  id?: number;
  name: string;
  categoryId: number;
  price: number;
  image?: string;
  description?: string;
  status: number;
  createTime?: string;
  updateTime?: string;
  createUser?: number;
  updateUser?: number;
  flavors?: DishFlavor[];
}

// 菜品口味
export interface DishFlavor {
  id?: number;
  dishId?: number;
  name: string;
  value: string;
}

// 套餐
export interface Setmeal {
  id?: number;
  categoryId: number;
  name: string;
  price: number;
  status: number;
  description?: string;
  image?: string;
  createTime?: string;
  updateTime?: string;
  createUser?: number;
  updateUser?: number;
  setmealDishes?: SetmealDish[];
}

// 套餐菜品关系
export interface SetmealDish {
  id?: number;
  setmealId?: number;
  dishId: number;
  name: string;
  price: number;
  copies: number;
}

// 订单
export interface Order {
  id: number;
  number: string;
  status: number;
  userId: number;
  addressBookId: number;
  orderTime: string;
  checkoutTime?: string;
  payMethod: number;
  payStatus: number;
  amount: number;
  remark?: string;
  phone: string;
  address: string;
  userName?: string;
  consignee: string;
  cancelReason?: string;
  rejectionReason?: string;
  cancelTime?: string;
  estimatedDeliveryTime?: string;
  deliveryStatus?: number;
  deliveryTime?: string;
  packAmount?: number;
  tablewareNumber?: number;
  tablewareStatus?: number;
}

// 营业额统计
export interface TurnoverReport {
  dateList: string[];
  turnoverList: number[];
}

// 用户统计
export interface UserReport {
  dateList: string[];
  newUserList: number[];
  totalUserList: number[];
}

// 订单统计
export interface OrderReport {
  dateList: string[];
  orderCountList: number[];
  validOrderCountList: number[];
  orderCompletionRate: number;
  totalOrderCount: number;
  validOrderCount: number;
}

// 销量Top10
export interface SalesTop10Report {
  nameList: string[];
  numberList: number[];
}

// 工作台数据
export interface WorkspaceData {
  turnover: number;
  validOrderCount: number;
  orderCompletionRate: number;
  unitPrice: number;
  newUsers: number;
  newUserGrowthRate: number;
  orderGrowthRate: number;
  turnoverGrowthRate: number;
  unitPriceGrowthRate: number;
}

// 订单概览
export interface OrderOverview {
  waitingOrders: number;
  deliveredOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  allOrders: number;
}

// 菜品概览
export interface DishOverview {
  sold: number;
  discontinued: number;
}

// 套餐概览
export interface SetmealOverview {
  sold: number;
  discontinued: number;
}

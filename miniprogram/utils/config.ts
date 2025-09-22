// API 配置
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8080',
  TIMEOUT: 10000,
  RETRY_COUNT: 3
}

// API 端点
export const API_ENDPOINTS = {
  // 用户相关
  REGISTER: '/user/register',
  LOGIN: '/user/login',
  LOGOUT: '/user/logout',
  PROFILE: '/profile',
  PROTECTED: '/protected',
  // 订单相关
  ORDER_STATUS: '/order/status'
}

// 存储键名
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER_INFO: 'user_info',
  USER_ROLE: 'userRole'
}

// 用户角色
export const USER_ROLES = {
  PASSENGER: '1',
  DRIVER: '2'
}

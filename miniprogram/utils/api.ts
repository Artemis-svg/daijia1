import { request } from './request'
import { API_ENDPOINTS } from './config'

// 用户数据接口
export interface User {
  id: number
  username: string
  phone?: string
  type: string
  createdAt: string
  status?: string
}

// 注册数据接口
export interface RegisterData {
  username: string
  password: string
  phone?: string
  type: string
}

// 登录数据接口
export interface LoginData {
  username: string
  password: string
}

// 登录响应接口
export interface LoginResponse {
  data: User
}

// API 服务类
export class ApiService {
  // 用户注册
  static async register(data: RegisterData): Promise<User> {
    return request<User>({
      url: API_ENDPOINTS.REGISTER,
      method: 'POST',
      data
    })
  }

  // 用户登录
  static async login(data: LoginData): Promise<LoginResponse> {
    return request<LoginResponse>({
      url: API_ENDPOINTS.LOGIN,
      method: 'POST',
      data
    })
  }

  // 获取用户信息
  static async getProfile(): Promise<User> {
    return request<User>({
      url: API_ENDPOINTS.PROFILE,
      method: 'GET',
      needAuth: true
    })
  }

  // 用户退出登录
  static async logout(): Promise<{ message: string; user: string }> {
    return request<{ message: string; user: string }>({
      url: API_ENDPOINTS.LOGOUT,
      method: 'POST',
      needAuth: true
    })
  }

  // 测试受保护的接口
  static async testProtected(): Promise<{ message: string }> {
    return request<{ message: string }>({
      url: API_ENDPOINTS.PROTECTED,
      method: 'GET',
      needAuth: true
    })
  }

  // 更新司机状态
  static async updateDriverStatus(userId: string, status: string): Promise<{ message: string }> {
    return request<{ message: string }>({
      url: API_ENDPOINTS.ORDER_STATUS,
      method: 'GET',
      data: { userId, status },
      needAuth: true
    })
  }
}

// 用户服务类
export class UserService {
  // 保存用户信息到本地存储
  static saveUserInfo(user: User): void {
    try {
      wx.setStorageSync('user_info', user)
      wx.setStorageSync('userRole', user.role)
    } catch (error) {
      console.error('保存用户信息失败:', error)
    }
  }

  // 获取本地用户信息
  static getUserInfo(): User | null {
    try {
      return wx.getStorageSync('user_info') || null
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }

  // 清除用户信息
  static clearUserInfo(): void {
    try {
      wx.removeStorageSync('user_info')
      wx.removeStorageSync('userRole')
      wx.removeStorageSync('access_token')
    } catch (error) {
      console.error('清除用户信息失败:', error)
    }
  }

  // 检查是否已登录
  static isLoggedIn(): boolean {
    try {
      const token = wx.getStorageSync('access_token')
      const userInfo = wx.getStorageSync('user_info')
      return !!(token && userInfo)
    } catch (error) {
      return false
    }
  }
}

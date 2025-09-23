import { API_CONFIG, STORAGE_KEYS } from './config'

// 响应接口
interface ApiResponse<T = any> {
  data?: T
  message?: string
  detail?: string
  access_token?: string
  token_type?: string
  user?: any
}

// 请求选项接口
interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  needAuth?: boolean
}

// 获取存储的token
function getToken(): string {
  try {
    return wx.getStorageSync(STORAGE_KEYS.ACCESS_TOKEN) || ''
  } catch (error) {
    console.error('获取token失败:', error)
    return ''
  }
}

// 设置token
function setToken(token: string): void {
  try {
    wx.setStorageSync(STORAGE_KEYS.ACCESS_TOKEN, token)
  } catch (error) {
    console.error('保存token失败:', error)
  }
}

// 清除token
function clearToken(): void {
  try {
    wx.removeStorageSync(STORAGE_KEYS.ACCESS_TOKEN)
    wx.removeStorageSync(STORAGE_KEYS.USER_INFO)
  } catch (error) {
    console.error('清除token失败:', error)
  }
}

// 网络请求函数
export function request<T = any>(options: RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'GET',
      data,
      header = {},
      needAuth = false
    } = options

    // 构建完整URL
    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`

    // 设置请求头
    const requestHeader: Record<string, string> = {
      'Content-Type': 'application/json',
      ...header
    }

    // 如果需要认证，添加Authorization头
    if (needAuth) {
      const token = getToken()
      if (token) {
        requestHeader['Authorization'] = `Bearer ${token}`
      }
    }

    wx.request({
      url: fullUrl,
      method,
      data,
      header: requestHeader,
      timeout: API_CONFIG.TIMEOUT,
      success: (res) => {
        console.log('API请求成功:', { url: fullUrl, res })
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T)
        } else if (res.statusCode === 401) {
          // token过期或无效
          clearToken()
          wx.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
          })
          // 跳转到登录页
          wx.navigateTo({
            url: '/pages/login/login'
          })
          reject(new Error('登录已过期'))
        } else {
          const errorMsg = (res.data as ApiResponse)?.detail || 
                          (res.data as ApiResponse)?.message || 
                          '请求失败'
          wx.showToast({
            title: errorMsg,
            icon: 'none'
          })
          reject(new Error(errorMsg))
        }
      },
      fail: (err) => {
        console.error('API请求失败:', { url: fullUrl, err })
        let errorMsg = '网络错误，请检查网络连接'
        
        if (err.errMsg?.includes('timeout')) {
          errorMsg = '请求超时，请重试'
        } else if (err.errMsg?.includes('fail')) {
          errorMsg = '网络连接失败'
        }
        
        wx.showToast({
          title: errorMsg,
          icon: 'none'
        })
        reject(new Error(errorMsg))
      }
    })
  })
}

// Token刷新机制（简化版）
let isRefreshingToken = false

function handleTokenExpired() {
  if (isRefreshingToken) return
  
  isRefreshingToken = true
  
  wx.showModal({
    title: '登录已过期',
    content: '您的登录已过期，请重新登录',
    showCancel: false,
    success: () => {
      clearToken()
      // 重新初始化应用状态
      const app = getApp<IAppOption>()
      app.globalData.isLoggedIn = false
      app.globalData.userInfo = null
      app.globalData.userRole = ''
      
      wx.reLaunch({
        url: '/pages/login/login'
      })
      
      isRefreshingToken = false
    }
  })
}

// 检查token是否有效
export function checkTokenValidity(): boolean {
  const token = getToken()
  if (!token) return false
  
  try {
    // 简单的JWT解析（生产环境建议使用专门的JWT库）
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    
    if (payload.exp && payload.exp < currentTime) {
      // Token已过期
      handleTokenExpired()
      return false
    }
    
    return true
  } catch (error) {
    console.error('Token解析失败:', error)
    return false
  }
}

// 导出工具函数
export { getToken, setToken, clearToken, handleTokenExpired }

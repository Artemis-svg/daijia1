// pages/login/login.ts
import { ApiService, UserService, LoginData } from '../../utils/api'

Page({
  data: {
    username: '',
    password: '',
    isLoading: false
  },

  onLoad() {
    // 如果已经登录，跳转到主页
    if (UserService.isLoggedIn()) {
      const userInfo = UserService.getUserInfo()
      if (userInfo) {
        this.redirectToHome(userInfo.type)
      }
    }
  },

  // 用户名输入
  onUsernameInput(e: any) {
    this.setData({
      username: e.detail.value.trim()
    })
  },

  // 密码输入
  onPasswordInput(e: any) {
    this.setData({
      password: e.detail.value
    })
  },

  // 表单验证
  validateForm(): boolean {
    const { username, password } = this.data
    
    if (!username) {
      wx.showToast({
        title: '请输入用户名或邮箱',
        icon: 'none'
      })
      return false
    }
    
    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return false
    }
    
    if (password.length < 4) {
      wx.showToast({
        title: '密码至少4位',
        icon: 'none'
      })
      return false
    }
    
    return true
  },

  // 处理登录
  async handleLogin() {
    if (!this.validateForm()) {
      return
    }

    this.setData({ isLoading: true })

    try {
      const { username, password } = this.data
      const loginData: LoginData = { username, password }
      
      const response = await ApiService.login(loginData)
      
      UserService.saveUserInfo(response.data)
      
      // 更新全局数据
      const app = getApp<IAppOption>()
      app.globalData.userRole = response.data.type
      
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })
      
      // 延迟跳转
      setTimeout(() => {
        this.redirectToHome(response.data.type)
      }, 500)
      
    } catch (error) {
      console.error('登录失败:', error)
    } finally {
      this.setData({ isLoading: false })
    }
  },

  // 跳转到主页
  redirectToHome(role: string) {
    const roleText = role === '1' ? '乘客' : '司机'
    
    wx.showToast({
      title: `欢迎回来，${roleText}`,
      icon: 'success',
      duration: 200
    })
    
    setTimeout(() => {
      if (role === '1') {
        // 乘客跳转到tabBar页面
        wx.switchTab({
          url: '/pages/proxy/proxy'
        })
      } else if (role === '2') {
        // 司机跳转到普通页面
        wx.reLaunch({
          url: '/pages/orders/orders'
        })
      } else {
        // 如果角色不明确，重新登录
        wx.showToast({
          title: '角色信息异常，请重新登录',
          icon: 'none'
        })
      }
    }, 1500)
  },

  // 跳转到注册页面
  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  }
})

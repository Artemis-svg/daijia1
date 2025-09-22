// app.ts
import { UserService } from './utils/api'

App<IAppOption>({
  globalData: {
    userRole: '', // 'passenger' | 'driver'
    userInfo: null, // 用户信息
    isLoggedIn: false, // 是否已登录
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 检查用户登录状态
    this.checkAuthStatus?.();
  },

  // 检查认证状态
  checkAuthStatus() {
    try {
      const isLoggedIn = UserService.isLoggedIn()
      const userInfo = UserService.getUserInfo()
      
      if (isLoggedIn && userInfo) {
        // 用户已登录
        this.globalData.isLoggedIn = true
        this.globalData.userInfo = userInfo
        this.globalData.userRole = userInfo.role
        
        console.log('用户已登录:', userInfo)
        
        // 设置tabBar
        this.setupTabBar?.(userInfo.role)
        
        // 自动跳转到对应角色页面
        this.autoRedirectToRolePage?.(userInfo.role)
      } else {
        // 用户未登录，跳转到登录页
        this.globalData.isLoggedIn = false
        this.globalData.userInfo = null
        this.globalData.userRole = ''
        
        console.log('用户未登录，跳转到登录页')
        
        // 延迟跳转，避免页面还未初始化
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }, 1000)
      }
    } catch (error) {
      console.error('检查认证状态失败:', error)
    }
  },

  // 自动跳转到对应角色页面
  autoRedirectToRolePage(role: string) {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    
    // 如果当前在登录相关页面，跳转到对应首页
    if (currentPage && (
      currentPage.route === 'pages/login/login' ||
      currentPage.route === 'pages/register/register'
    )) {
      setTimeout(() => {
        if (role === 'passenger') {
          // 乘客跳转到tabBar页面
          wx.switchTab({
            url: '/pages/proxy/proxy'
          })
        } else if (role === 'driver') {
          // 司机跳转到普通页面
          wx.reLaunch({
            url: '/pages/orders/orders'
          })
        }
      }, 1000)
    }
  },

  // 用户登出
  logout(message?: string) {
    UserService.clearUserInfo()
    this.globalData.isLoggedIn = false
    this.globalData.userInfo = null
    this.globalData.userRole = ''
    
    wx.showToast({
      title: message || '已退出登录',
      icon: 'success'
    })
    
    // 跳转到登录页
    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/login/login'
      })
    }, 1500)
  },


  setupTabBar(role: string) {
    // 动态设置tabBar
    if (role === 'passenger') {
      // 乘客的tabBar配置
      this.setPassengerTabBar?.();
    } else if (role === 'driver') {
      // 司机的tabBar配置
      this.setDriverTabBar?.();
    }
  },

  setPassengerTabBar() {
    const tabBarList = [
      {
        pagePath: "pages/proxy/proxy",
        text: "🚗 代驾"
      },
      {
        pagePath: "pages/review/review",
        text: "⭐ 评价"
      },
      {
        pagePath: "pages/profile/profile",
        text: "👤 个人"
      }
    ];

    // 小程序不支持动态设置整个tabBar，这里只是示例
    // 实际应用中可能需要使用自定义tabBar组件
    console.log('设置乘客tabBar:', tabBarList);
  },

  setDriverTabBar() {
    const tabBarList = [
      {
        pagePath: "pages/orders/orders",
        text: "📋 接单"
      },
      {
        pagePath: "pages/review/review",
        text: "⭐ 评价"
      },
      {
        pagePath: "pages/profile/profile",
        text: "👤 个人"
      }
    ];

    console.log('设置司机tabBar:', tabBarList);
  }
})
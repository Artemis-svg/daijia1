// pages/register/register.ts
import { ApiService,  RegisterData } from '../../utils/api'

Page({
  data: {
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '1',
    isLoading: false
  },

  onLoad() {
  },

  // 用户名输入
  onUsernameInput(e: any) {
    this.setData({
      username: e.detail.value.trim()
    })
  },

  // 手机号输入
  onPhoneInput(e: any) {
    this.setData({
      phone: e.detail.value.trim()
    })
  },

  // 密码输入
  onPasswordInput(e: any) {
    this.setData({
      password: e.detail.value
    })
  },

  // 确认密码输入
  onConfirmPasswordInput(e: any) {
    this.setData({
      confirmPassword: e.detail.value
    })
  },

  // 选择角色
  selectRole(e: any) {
    const role = e.currentTarget.dataset.role
    this.setData({
      role
    })
  },

  // 邮箱格式验证
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // 手机号格式验证
  validatePhone(phone: string): boolean {
    if (!phone) return true // 手机号是可选的
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  },

  // 表单验证
  validateForm(): boolean {
    const { username, phone, password, confirmPassword } = this.data
    
    if (!username) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return false
    }
    
    if (username.length < 3) {
      wx.showToast({
        title: '用户名至少3位',
        icon: 'none'
      })
      return false
    }
    
    if (!this.validatePhone(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
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
    
    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      })
      return false
    }
    
    return true
  },

  // 处理注册
  async handleRegister() {
    if (!this.validateForm()) {
      return
    }

    this.setData({ isLoading: true })

    try {
      const { username,  phone, password, role } = this.data
      const registerData: RegisterData = {
        username,
        password,
        type: role,
        ...(phone && { phone })
      }
      
      await ApiService.register(registerData)
      
      wx.showToast({
        title: '注册成功',
        icon: 'success'
      })
      
      // 延迟跳转到登录页
      setTimeout(() => {
        wx.navigateBack()
      }, 500)
      
    } catch (error) {
      console.error('注册失败:', error)
    } finally {
      this.setData({ isLoading: false })
    }
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateBack()
  }
})

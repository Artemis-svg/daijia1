// profile.ts
import { UserService } from '../../utils/api'

const profileDefaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

Page({
  data: {
    userInfo: {
      id: 0,
      username: '',
      phone: '',
      type: '',
      role: '',
      createdAt: '',
      avatarUrl: profileDefaultAvatarUrl
    }
  },

  onLoad() {
    this.loadUserData();
  },

  onShow() {
    // 页面显示时刷新用户数据
    this.loadUserData();
  },

  loadUserData() {
    // 从本地存储加载用户数据
    try {
      const userInfo = UserService.getUserInfo();
      const app = getApp<IAppOption>();
      
      if (userInfo) {
        this.setData({
          userInfo: {
            id: userInfo.id || 0,
            username: userInfo.username || '',
            phone: userInfo.phone || '',
            type: userInfo.type || '',
            role: userInfo.type || '',
            createdAt: userInfo.createdAt || '',
            avatarUrl: profileDefaultAvatarUrl
          }
        });
      } else if (app.globalData.userInfo) {
        // 从全局数据获取
        const userInfo = app.globalData.userInfo;
        this.setData({
          userInfo: {
            id: (userInfo as any)?.id || 0,
            username: (userInfo as any)?.username || '',
            phone: (userInfo as any)?.phone || '',
            type: (userInfo as any)?.type || '',
            role: app.globalData.userRole || '',
            createdAt: (userInfo as any)?.createdAt || '',
            avatarUrl: profileDefaultAvatarUrl
          }
        });
      } else {
        // 如果没有用户信息，跳转到登录页
        wx.navigateTo({
          url: '/pages/login/login'
        });
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
  },

  // 选择头像
  onChooseAvatar(e: any) {
    const { avatarUrl } = e.detail;
    this.setData({
      'userInfo.avatarUrl': avatarUrl
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地缓存
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          
          // 清除全局数据
          const app = getApp<IAppOption>();
          app.globalData.userInfo = undefined;
          app.globalData.userRole = '';
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
          
          // 跳转到登录页
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/login'
            });
          }, 1000);
        }
      }
    });
  }
});

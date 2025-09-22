"use strict";
// profile.ts
const profileDefaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
Page({
    data: {
        userRole: '', // 'passenger' | 'driver'
        userInfo: {
            avatarUrl: profileDefaultAvatarUrl,
            nickName: '微信用户',
            phone: '138****8888',
            level: '黄金会员',
            balance: '128.50',
            availableCoupons: 3
        },
        userStats: {
            totalTrips: 56,
            totalDistance: 1280,
            avgRating: 4.8
        }
    },
    onLoad() {
        this.loadUserData();
    },
    loadUserData() {
        // 从本地存储加载用户数据
        try {
            const userInfo = wx.getStorageSync('userInfo');
            const userRole = wx.getStorageSync('userRole');
            if (userInfo) {
                this.setData({
                    'userInfo.avatarUrl': userInfo.avatarUrl || profileDefaultAvatarUrl,
                    'userInfo.nickName': userInfo.nickName || '微信用户'
                });
            }
            if (userRole) {
                this.setData({
                    userRole: userRole
                });
            }
        }
        catch (error) {
            console.log('加载用户数据失败:', error);
        }
    },
    onChooseAvatar(e) {
        const { avatarUrl } = e.detail;
        this.setData({
            'userInfo.avatarUrl': avatarUrl
        });
        // 保存到本地存储
        this.saveUserInfo();
    },
    onNicknameChange(e) {
        const nickName = e.detail.value;
        this.setData({
            'userInfo.nickName': nickName
        });
        // 保存到本地存储
        this.saveUserInfo();
    },
    saveUserInfo() {
        try {
            wx.setStorageSync('userInfo', {
                avatarUrl: this.data.userInfo.avatarUrl,
                nickName: this.data.userInfo.nickName
            });
        }
        catch (error) {
            console.log('保存用户信息失败:', error);
        }
    },
    navigateTo(_e) {
        // 暂时显示提示，实际项目中可以导航到对应页面
        wx.showToast({
            title: '功能开发中',
            icon: 'none'
        });
        // 实际使用时可以取消注释下面的代码
        // const url = e.currentTarget.dataset.url;
        // wx.navigateTo({
        //   url: url
        // });
    },
    switchRole() {
        const newRole = this.data.userRole === 'passenger' ? 'driver' : 'passenger';
        const roleText = newRole === 'passenger' ? '乘客' : '司机';
        wx.showModal({
            title: '切换身份',
            content: `确定要切换为${roleText}身份吗？`,
            success: (res) => {
                if (res.confirm) {
                    // 保存新身份
                    try {
                        wx.setStorageSync('userRole', newRole);
                    }
                    catch (error) {
                        console.log('保存用户身份失败:', error);
                    }
                    // 更新全局数据
                    const app = getApp();
                    app.globalData.userRole = newRole;
                    // 显示切换成功提示
                    wx.showToast({
                        title: `已切换为${roleText}`,
                        icon: 'success',
                        duration: 1500
                    });
                    // 延迟跳转到对应首页
                    setTimeout(() => {
                        if (newRole === 'passenger') {
                            wx.switchTab({
                                url: '/pages/proxy/proxy'
                            });
                        }
                        else {
                            // 司机身份需要跳转到接单页面，但由于tabBar限制，这里显示提示
                            wx.showModal({
                                title: '司机模式',
                                content: '司机身份请通过菜单进入接单页面',
                                showCancel: false,
                                success: () => {
                                    wx.navigateTo({
                                        url: '/pages/orders/orders'
                                    });
                                }
                            });
                        }
                    }, 1500);
                    // 更新当前数据
                    this.setData({
                        userRole: newRole
                    });
                }
            }
        });
    },
    logout() {
        wx.showModal({
            title: '提示',
            content: '确定要退出登录吗？',
            success: (res) => {
                if (res.confirm) {
                    // 清除本地存储的用户信息
                    try {
                        wx.removeStorageSync('userInfo');
                        wx.removeStorageSync('userToken');
                        wx.removeStorageSync('userRole');
                    }
                    catch (error) {
                        console.log('清除用户数据失败:', error);
                    }
                    // 重置用户信息
                    this.setData({
                        'userInfo.avatarUrl': profileDefaultAvatarUrl,
                        'userInfo.nickName': '微信用户',
                        userRole: ''
                    });
                    wx.showToast({
                        title: '已退出登录',
                        icon: 'success'
                    });
                    // 跳转到身份选择页面
                    setTimeout(() => {
                        wx.reLaunch({
                            url: '/pages/role-selection/role-selection'
                        });
                    }, 1500);
                }
            }
        });
    }
});

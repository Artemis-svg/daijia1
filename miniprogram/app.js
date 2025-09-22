"use strict";
// app.ts
App({
    globalData: {
        userRole: '', // 'passenger' | 'driver'
    },
    onLaunch() {
        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || [];
        logs.unshift(Date.now());
        wx.setStorageSync('logs', logs);
        // 登录
        wx.login({
            success: res => {
                console.log(res.code);
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            },
        });
        // 检查用户身份
        this.checkUserRole?.();
    },
    checkUserRole() {
        try {
            const userRole = wx.getStorageSync('userRole');
            if (userRole) {
                this.globalData.userRole = userRole;
                this.setupTabBar?.(userRole);
                // 如果当前在身份选择页面，但已有身份，跳转到对应首页
                const pages = getCurrentPages();
                const currentPage = pages[pages.length - 1];
                if (currentPage && currentPage.route === 'pages/role-selection/role-selection') {
                    setTimeout(() => {
                        if (userRole === 'passenger') {
                            wx.switchTab({
                                url: '/pages/proxy/proxy'
                            });
                        }
                        else {
                            wx.navigateTo({
                                url: '/pages/orders/orders'
                            });
                        }
                    }, 1000);
                }
            }
            // 如果没有身份信息，保持在身份选择页面（因为首页就是身份选择页面）
        }
        catch (error) {
            console.log('检查用户身份失败:', error);
        }
    },
    setupTabBar(role) {
        // 动态设置tabBar
        if (role === 'passenger') {
            // 乘客的tabBar配置
            this.setPassengerTabBar?.();
        }
        else if (role === 'driver') {
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
});

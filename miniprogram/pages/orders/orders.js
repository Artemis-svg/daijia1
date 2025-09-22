"use strict";
// orders.ts
Page({
    data: {
        driverStatus: 'offline', // online | offline
        driverInfo: {
            name: '张师傅',
            carModel: '大众朗逸',
            plateNumber: '京A12345'
        },
        todayEarnings: '256.50',
        currentOrder: null,
        availableOrders: [
            {
                id: 1,
                time: '10分钟前',
                distance: 2.5,
                startAddress: '北京市朝阳区三里屯SOHO',
                endAddress: '北京市海淀区中关村大厦',
                price: '45.00',
                customerName: '李先生',
                customerPhone: '138****8888'
            },
            {
                id: 2,
                time: '15分钟前',
                distance: 1.8,
                startAddress: '北京市朝阳区国贸中心',
                endAddress: '北京市朝阳区望京SOHO',
                price: '32.00',
                customerName: '王女士',
                customerPhone: '139****9999'
            },
            {
                id: 3,
                time: '20分钟前',
                distance: 4.2,
                startAddress: '北京市西城区金融街',
                endAddress: '北京市海淀区五道口',
                price: '68.00',
                customerName: '刘先生',
                customerPhone: '137****7777'
            }
        ],
        todayStats: {
            orders: 8,
            hours: 6.5,
            rating: 4.9
        },
        statusText: '离线状态'
    },
    onLoad() {
        this.loadDriverStatus();
    },
    loadDriverStatus() {
        // 从本地存储加载司机状态
        try {
            const status = wx.getStorageSync('driverStatus') || 'offline';
            this.setData({
                driverStatus: status,
                statusText: status === 'online' ? '在线接单中' : '离线状态'
            });
        }
        catch (error) {
            console.log('加载司机状态失败:', error);
        }
    },
    toggleStatus() {
        const newStatus = this.data.driverStatus === 'online' ? 'offline' : 'online';
        this.setData({
            driverStatus: newStatus,
            statusText: newStatus === 'online' ? '在线接单中' : '离线状态'
        });
        // 保存状态到本地存储
        try {
            wx.setStorageSync('driverStatus', newStatus);
        }
        catch (error) {
            console.log('保存司机状态失败:', error);
        }
        // 显示状态变更提示
        const statusText = newStatus === 'online' ? '上线' : '下线';
        wx.showToast({
            title: `已${statusText}`,
            icon: 'success'
        });
        // 如果上线，开始模拟接收订单
        if (newStatus === 'online') {
            this.startReceivingOrders();
        }
    },
    startReceivingOrders() {
        // 模拟接收新订单
        setTimeout(() => {
            if (this.data.driverStatus === 'online' && !this.data.currentOrder) {
                wx.showToast({
                    title: '有新订单！',
                    icon: 'none'
                });
            }
        }, 5000);
    },
    acceptOrder(e) {
        const order = e.currentTarget.dataset.order;
        wx.showModal({
            title: '确认接单',
            content: `确定接受这个订单吗？预估收益 ¥${order.price}`,
            success: (res) => {
                if (res.confirm) {
                    this.setData({
                        currentOrder: {
                            ...order,
                            status: '前往接客'
                        },
                        availableOrders: this.data.availableOrders.filter(item => item.id !== order.id)
                    });
                    wx.showToast({
                        title: '接单成功！',
                        icon: 'success'
                    });
                }
            }
        });
    },
    contactCustomer() {
        if (this.data.currentOrder && this.data.currentOrder.customerPhone) {
            wx.makePhoneCall({
                phoneNumber: this.data.currentOrder.customerPhone.replace(/\*/g, '1')
            });
        }
    },
    completeOrder() {
        if (!this.data.currentOrder)
            return;
        wx.showModal({
            title: '完成订单',
            content: '确认已完成这个订单吗？',
            success: (res) => {
                if (res.confirm) {
                    // 更新收益
                    const newEarnings = (parseFloat(this.data.todayEarnings) + parseFloat(this.data.currentOrder?.price || '0')).toFixed(2);
                    const newStats = {
                        ...this.data.todayStats,
                        orders: this.data.todayStats.orders + 1
                    };
                    this.setData({
                        currentOrder: null,
                        todayEarnings: newEarnings,
                        todayStats: newStats
                    });
                    wx.showToast({
                        title: '订单完成！',
                        icon: 'success'
                    });
                    // 继续接收新订单
                    this.startReceivingOrders();
                }
            }
        });
    }
});

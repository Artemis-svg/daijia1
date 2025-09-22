"use strict";
// proxy.ts
Page({
    data: {
        startAddress: '',
        endAddress: '',
        selectedServiceType: 'standard',
        serviceTypes: [
            {
                type: 'standard',
                name: '标准代驾',
                price: '起步价 ¥25',
                icon: '🚗',
                desc: '专业司机 安全可靠'
            },
            {
                type: 'luxury',
                name: '豪车代驾',
                price: '起步价 ¥45',
                icon: '🚘',
                desc: '高端车型专属服务'
            },
            {
                type: 'long',
                name: '长途代驾',
                price: '协商价格',
                icon: '🛣️',
                desc: '跨城市长途服务'
            }
        ]
    },
    onLoad() {
        console.log('代驾页面加载');
    },
    canCallProxy() {
        return !!(this.data.startAddress.trim() && this.data.endAddress.trim());
    },
    onStartAddressInput(e) {
        this.setData({
            startAddress: e.detail.value
        });
    },
    onEndAddressInput(e) {
        this.setData({
            endAddress: e.detail.value
        });
    },
    selectServiceType(e) {
        const type = e.currentTarget.dataset.type;
        this.setData({
            selectedServiceType: type
        });
    },
    callProxy() {
        if (!this.canCallProxy()) {
            wx.showToast({
                title: '请输入出发地和目的地',
                icon: 'none'
            });
            return;
        }
        wx.showLoading({
            title: '正在为您安排代驾...'
        });
        // 模拟代驾预约请求
        setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
                title: '代驾预约成功！',
                icon: 'success'
            });
        }, 2000);
    }
});

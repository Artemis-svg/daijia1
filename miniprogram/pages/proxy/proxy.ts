// proxy.ts
Page({
  data: {
    startAddress: '',
    endAddress: '',
    startCoords: null, // 起点坐标
    endCoords: null,   // 终点坐标
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
        icon: '🏎️',
        desc: '高端车型专属服务'
      },
      {
        type: 'long',
        name: '长途代驾',
        price: '协商价格',
        icon: '🚐',
        desc: '跨城市长途服务'
      }
    ]
  },

  onLoad() {
    console.log('代驾页面加载')
  },

  onShow() {
    // 页面显示时检查是否有地址更新
    console.log('页面显示 - 当前地址:', {
      start: this.data.startAddress,
      end: this.data.endAddress
    })
  },

  canCallProxy(): boolean {
    return !!(this.data.startAddress.trim() && this.data.endAddress.trim())
  },

  // 选择起点地址
  selectStartAddress() {
    wx.navigateTo({
      url: `/pages/map-picker/map-picker?type=start${this.data.startCoords ? `&longitude=${this.data.startCoords.longitude}&latitude=${this.data.startCoords.latitude}` : ''}`
    })
  },

  // 选择终点地址
  selectEndAddress() {
    wx.navigateTo({
      url: `/pages/map-picker/map-picker?type=end${this.data.endCoords ? `&longitude=${this.data.endCoords.longitude}&latitude=${this.data.endCoords.latitude}` : ''}`
    })
  },

  // 交换起点和终点
  swapAddresses() {
    const { startAddress, endAddress, startCoords, endCoords } = this.data
    
    this.setData({
      startAddress: endAddress,
      endAddress: startAddress,
      startCoords: endCoords,
      endCoords: startCoords
    })
    
    wx.showToast({
      title: '起点终点已交换',
      icon: 'success',
      duration: 1000
    })
  },

    selectServiceType(e: any) {
      const type = e.currentTarget.dataset.type;
      this.setData({
        selectedServiceType: type
      });
    },

  callProxy() {
    if (!this.canCallProxy()) {
      wx.showToast({
        title: '请选择出发地和目的地',
        icon: 'none'
      })
      return
    }

    const { startAddress, endAddress, startCoords, endCoords, selectedServiceType } = this.data
    const selectedService = this.data.serviceTypes.find(s => s.type === selectedServiceType)

    // 显示订单确认信息
    const orderInfo = [
      `出发地：${startAddress}`,
      `目的地：${endAddress}`,
      `服务类型：${selectedService?.name}`,
      `预估费用：${selectedService?.price}`
    ].join('\n')

    wx.showModal({
      title: '确认代驾订单',
      content: orderInfo,
      confirmText: '确认预约',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.submitOrder()
        }
      }
    })
  },

  // 提交订单
  submitOrder() {
    wx.showLoading({
      title: '正在为您安排代驾...'
    })

    // 构建订单数据
    const orderData = {
      startAddress: this.data.startAddress,
      endAddress: this.data.endAddress,
      startCoords: this.data.startCoords,
      endCoords: this.data.endCoords,
      serviceType: this.data.selectedServiceType,
      timestamp: new Date().toISOString()
    }

    console.log('提交代驾订单:', orderData)

    // 模拟代驾预约请求
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '代驾预约成功！',
        icon: 'success'
      })
      
      // 可以在这里跳转到订单详情页面
      // wx.navigateTo({
      //   url: '/pages/order-detail/order-detail?orderId=xxx'
      // })
    }, 2000)
  }
});

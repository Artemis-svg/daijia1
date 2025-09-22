// review.ts - 历史订单页面
import { UserService } from '../../utils/api'

Page({
  data: {
    userRole: 'passenger', // 用户角色
    filterType: 'all', // 筛选类型: all, completed, cancelled
    totalOrders: 15,
    totalAmount: '¥428.50',
    avgRating: '4.8',
    
    // 所有订单数据
    allOrders: [
      {
        id: 1,
        date: '2025-09-19',
        time: '14:30',
        status: 'completed',
        statusText: '已完成',
        startAddress: '北京市朝阳区三里屯SOHO',
        endAddress: '北京市海淀区中关村大厦',
        partnerName: '张师傅',
        distance: '15.2km',
        price: '28.50',
        reviewed: true
      },
      {
        id: 2,
        date: '2025-09-18',
        time: '09:15',
        status: 'completed',
        statusText: '已完成',
        startAddress: '北京市东城区王府井大街',
        endAddress: '北京市朝阳区三里屯',
        partnerName: '李师傅',
        distance: '8.5km',
        price: '18.00',
        reviewed: false
      },
      {
        id: 3,
        date: '2025-09-17',
        time: '18:45',
        status: 'cancelled',
        statusText: '已取消',
        startAddress: '北京市海淀区清华大学',
        endAddress: '北京市朝阳区国贸',
        partnerName: '王师傅',
        distance: '22.1km',
        price: '35.00',
        reviewed: false
      },
      {
        id: 4,
        date: '2025-09-15',
        time: '16:20',
        status: 'completed',
        statusText: '已完成',
        startAddress: '北京首都国际机场T3',
        endAddress: '北京市朝阳区酒店',
        partnerName: '陈师傅',
        distance: '28.7km',
        price: '52.00',
        reviewed: true
      },
      {
        id: 5,
        date: '2025-09-12',
        time: '08:30',
        status: 'completed',
        statusText: '已完成',
        startAddress: '北京市西城区公司大厦',
        endAddress: '北京市海淀区地铁站',
        partnerName: '刘师傅',
        distance: '12.3km',
        price: '22.50',
        reviewed: true
      }
    ],
    
    filteredOrders: [] // 筛选后的订单
  },

  onLoad() {
    console.log('历史订单页面加载')
    this.loadUserRole()
    this.filterOrders()
  },

  // 加载用户角色
  loadUserRole() {
    const userInfo = UserService.getUserInfo()
    if (userInfo) {
      this.setData({
        userRole: userInfo.role
      })
    }
  },

  // 设置筛选条件
  setFilter(e: any) {
    const filterType = e.currentTarget.dataset.type
    this.setData({
      filterType
    })
    this.filterOrders()
  },

  // 筛选订单
  filterOrders() {
    const { allOrders, filterType } = this.data
    let filteredOrders = allOrders
    
    if (filterType === 'completed') {
      filteredOrders = allOrders.filter(order => order.status === 'completed')
    } else if (filterType === 'cancelled') {
      filteredOrders = allOrders.filter(order => order.status === 'cancelled')
    }
    
    this.setData({
      filteredOrders
    })
  },

  // 查看订单详情
  viewDetails(e: any) {
    const order = e.currentTarget.dataset.order
    wx.showModal({
      title: '订单详情',
      content: `订单号: ${order.id}\n时间: ${order.date} ${order.time}\n路线: ${order.startAddress} → ${order.endAddress}\n${this.data.userRole === 'driver' ? '乘客' : '司机'}: ${order.partnerName}\n距离: ${order.distance}\n金额: ¥${order.price}`,
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 写评价
  writeReview(e: any) {
    const order = e.currentTarget.dataset.order
    wx.showModal({
      title: '写评价',
      content: `即将为订单 ${order.id} 写评价`,
      confirmText: '去评价',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 这里可以跳转到评价页面或显示评价弹窗
          wx.showToast({
            title: '评价功能开发中',
            icon: 'none'
          })
        }
      }
    })
  }
});

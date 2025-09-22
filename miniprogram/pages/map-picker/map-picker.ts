// map-picker.ts
import { getCurrentLocation, reverseGeocode, LocationInfo, POI } from '../../utils/location'

Page({
  data: {
    // 地图相关
    longitude: 116.397128, // 默认北京坐标
    latitude: 39.916527,
    scale: 16,
    markers: [],
    
    // 地址相关
    addressType: 'start', // 'start' | 'end'
    selectedAddress: {
      name: '',
      address: '',
      longitude: 0,
      latitude: 0
    },
    
    // 标记点是否已设置
    hasMarker: false,
    
    // 状态
    isLoading: false,
    loadingText: '获取位置中...'
  },


  onLoad(options: any) {
    console.log('地图选择页面加载', options)
    
    // 获取传入的参数
    if (options.type) {
      this.setData({
        addressType: options.type
      })
    }
    
    // 如果有传入的坐标，使用传入的坐标
    if (options.longitude && options.latitude) {
      this.setData({
        longitude: parseFloat(options.longitude),
        latitude: parseFloat(options.latitude)
      })
    }
    
    // 获取当前位置（但不自动添加标记）
    this.getCurrentLocation()
  },

  // 获取当前位置
  async getCurrentLocation() {
    this.setData({
      isLoading: true,
      loadingText: '获取当前位置...'
    })
    
    try {
      const location = await getCurrentLocation()
      
      this.setData({
        longitude: location.longitude,
        latitude: location.latitude
      })
    } catch (error) {
      console.error('获取位置失败:', error)
      
      wx.showModal({
        title: '获取位置失败',
        content: '请检查位置权限设置，或手动在地图上选择位置',
        showCancel: false,
        confirmText: '知道了'
      })
      
      // 使用默认位置，不自动获取地址
    } finally {
      this.setData({
        isLoading: false
      })
    }
  },

  // 点击地图
  onMapTap(e: any) {
    const { longitude, latitude } = e.detail
    console.log('点击地图:', longitude, latitude)
    
    // 创建标记点
    const marker = {
      id: 1,
      longitude: longitude,
      latitude: latitude,
      iconPath: '/images/map-pin.png',
      width: 30,
      height: 30,
      callout: {
        content: '选中的位置',
        color: '#333',
        fontSize: 14,
        borderRadius: 5,
        bgColor: '#fff',
        padding: 5,
        display: 'ALWAYS'
      }
    }
    
    this.setData({
      longitude,
      latitude,
      markers: [marker],
      hasMarker: true
    })
    
    // 获取地址信息
    this.getAddressFromCoords(longitude, latitude)
  },

  // 根据坐标获取地址信息（逆地理编码）
  async getAddressFromCoords(longitude: number, latitude: number) {
    // 避免重复调用
    if (this.data.isLoading) {
      return
    }

    this.setData({
      isLoading: true,
      loadingText: '获取地址信息...'
    })

    try {
      const result = await reverseGeocode(longitude, latitude)
      
      this.setData({
        selectedAddress: {
          name: result.address.name,
          address: result.address.address,
          longitude: longitude,
          latitude: latitude
        }
      })
    } catch (error) {
      console.error('获取地址信息失败:', error)
      wx.showToast({
        title: '获取地址失败',
        icon: 'none'
      })
      
      // 即使获取地址失败，也保存坐标信息
      this.setData({
        selectedAddress: {
          name: `位置 (${longitude.toFixed(6)}, ${latitude.toFixed(6)})`,
          address: '无法获取详细地址',
          longitude: longitude,
          latitude: latitude
        }
      })
    } finally {
      this.setData({
        isLoading: false
      })
    }
  },

  // 确认位置
  confirmLocation() {
    const { selectedAddress, addressType } = this.data
    
    if (!selectedAddress.name || !this.data.hasMarker) {
      wx.showToast({
        title: '请先点击地图选择位置',
        icon: 'none'
      })
      return
    }
    
    // 返回上一页并传递选中的地址信息
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    
    if (prevPage) {
      // 调用上一页的方法来设置地址
      if (addressType === 'start') {
        prevPage.setData({
          startAddress: selectedAddress.name,
          startCoords: {
            longitude: selectedAddress.longitude,
            latitude: selectedAddress.latitude
          }
        })
      } else {
        prevPage.setData({
          endAddress: selectedAddress.name,
          endCoords: {
            longitude: selectedAddress.longitude,
            latitude: selectedAddress.latitude
          }
        })
      }
    }
    
    wx.navigateBack()
  }
})

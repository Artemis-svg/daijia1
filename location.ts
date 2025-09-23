// 位置相关工具函数

export interface LocationInfo {
  name: string
  address: string
  longitude: number
  latitude: number
}

export interface POI {
  id: string | number
  name: string
  address: string
  longitude: number
  latitude: number
  distance?: string
}

// 获取当前位置
export function getCurrentLocation(): Promise<LocationInfo> {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({
          name: '当前位置',
          address: `经度: ${res.longitude.toFixed(6)}, 纬度: ${res.latitude.toFixed(6)}`,
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
      fail: reject
    })
  })
}

// 逆地理编码 - 坐标转地址
export function reverseGeocode(longitude: number, latitude: number): Promise<{
  address: LocationInfo,
  pois: POI[]
}> {
  return new Promise((resolve, reject) => {
    console.log('调用逆地理编码API:', { longitude, latitude })
    
    // 模拟API调用延迟
    setTimeout(() => {
      const estimatedAddress = estimateAddressFromCoords(longitude, latitude)
      resolve({
        address: estimatedAddress,
        pois: []
      })
    }, 500)
  })
}

// 基于坐标估算地址（改进版）
function estimateAddressFromCoords(longitude: number, latitude: number): LocationInfo {
  // 北京市的大致坐标范围
  const beijingBounds = {
    north: 40.18,
    south: 39.44,
    east: 117.51,
    west: 115.42
  }
  
  // 检查是否在北京范围内
  const isInBeijing = latitude >= beijingBounds.south && 
                     latitude <= beijingBounds.north && 
                     longitude >= beijingBounds.west && 
                     longitude <= beijingBounds.east
  
  if (isInBeijing) {
    // 北京地标和街道数据
    const landmarks = [
      // 朝阳区
      { name: '三里屯太古里', district: '朝阳区', lat: 39.937, lng: 116.456, street: '三里屯路' },
      { name: 'CBD国贸', district: '朝阳区', lat: 39.908, lng: 116.447, street: '建国门外大街' },
      { name: '望京SOHO', district: '朝阳区', lat: 39.996, lng: 116.472, street: '望京街' },
      { name: '奥林匹克公园', district: '朝阳区', lat: 39.993, lng: 116.395, street: '奥林匹克公园' },
      
      // 海淀区
      { name: '中关村软件园', district: '海淀区', lat: 40.041, lng: 116.278, street: '中关村大街' },
      { name: '清华大学', district: '海淀区', lat: 40.003, lng: 116.316, street: '清华园' },
      { name: '北京大学', district: '海淀区', lat: 39.993, lng: 116.306, street: '颐和园路' },
      { name: '五道口', district: '海淀区', lat: 39.992, lng: 116.338, street: '成府路' },
      
      // 东城区
      { name: '王府井大街', district: '东城区', lat: 39.915, lng: 116.410, street: '王府井大街' },
      { name: '天安门广场', district: '东城区', lat: 39.904, lng: 116.407, street: '天安门广场' },
      { name: '故宫博物院', district: '东城区', lat: 39.917, lng: 116.397, street: '景山前街' },
      { name: '雍和宫', district: '东城区', lat: 39.947, lng: 116.420, street: '雍和宫大街' },
      
      // 西城区
      { name: '西单大悦城', district: '西城区', lat: 39.907, lng: 116.374, street: '西单北大街' },
      { name: '北海公园', district: '西城区', lat: 39.928, lng: 116.389, street: '文津街' },
      { name: '什刹海', district: '西城区', lat: 39.937, lng: 116.387, street: '什刹海' },
      { name: '金融街', district: '西城区', lat: 39.915, lng: 116.368, street: '金融大街' },
      
      // 丰台区
      { name: '南站商务区', district: '丰台区', lat: 39.865, lng: 116.381, street: '南三环西路' },
      { name: '方庄', district: '丰台区', lat: 39.875, lng: 116.434, street: '方庄路' },
      { name: '丰台科技园', district: '丰台区', lat: 39.824, lng: 116.304, street: '科学城北路' }
    ]
    
    // 找到最近的地标
    let closestLandmark = landmarks[0]
    let minDistance = calculateDistanceKm(latitude, longitude, closestLandmark.lat, closestLandmark.lng)
    
    for (const landmark of landmarks) {
      const distance = calculateDistanceKm(latitude, longitude, landmark.lat, landmark.lng)
      if (distance < minDistance) {
        minDistance = distance
        closestLandmark = landmark
      }
    }
    
    // 生成附近的街道号码
    const streetNumber = Math.floor(Math.random() * 200) + 1
    const buildingTypes = ['号', '号院', '号楼', '号大厦']
    const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)]
    
    const addressName = `${closestLandmark.name}附近`
    const detailAddress = `北京市${closestLandmark.district}${closestLandmark.street}${streetNumber}${buildingType}`
    
    return {
      name: addressName,
      address: detailAddress,
      longitude,
      latitude
    }
  } else {
    // 不在北京范围内 - 使用通用地址格式
    const cityNames = ['上海市', '深圳市', '广州市', '杭州市', '南京市', '武汉市', '成都市']
    const randomCity = cityNames[Math.floor(Math.random() * cityNames.length)]
    
    return {
      name: `${randomCity}某位置`,
      address: `${randomCity} 经度:${longitude.toFixed(6)}, 纬度:${latitude.toFixed(6)}`,
      longitude,
      latitude
    }
  }
}

// 计算两点间距离（公里）
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// 生成模拟位置数据
function generateMockLocationData(longitude: number, latitude: number): {
  address: LocationInfo,
  pois: POI[]
} {
  const districts = ['朝阳区', '海淀区', '东城区', '西城区', '丰台区', '石景山区']
  const streets = ['三里屯', '中关村', '王府井', '金融街', '总部基地', '万达广场']
  const landmarks = ['SOHO', '大厦', '购物中心', '地铁站', '医院', '学校']
  
  const randomDistrict = districts[Math.floor(Math.random() * districts.length)]
  const randomStreet = streets[Math.floor(Math.random() * streets.length)]
  const randomLandmark = landmarks[Math.floor(Math.random() * landmarks.length)]
  
  const mainAddress = `北京市${randomDistrict}${randomStreet}${randomLandmark}`
  
  const pois: POI[] = [
    {
      id: 1,
      name: '星巴克咖啡',
      address: `${randomDistrict}${randomStreet}店`,
      longitude: longitude + (Math.random() - 0.5) * 0.001,
      latitude: latitude + (Math.random() - 0.5) * 0.001,
      distance: '50m'
    },
    {
      id: 2,
      name: '麦当劳',
      address: `${randomDistrict}分店`,
      longitude: longitude + (Math.random() - 0.5) * 0.002,
      latitude: latitude + (Math.random() - 0.5) * 0.002,
      distance: '120m'
    },
    {
      id: 3,
      name: '中国银行',
      address: `${randomStreet}支行`,
      longitude: longitude + (Math.random() - 0.5) * 0.0015,
      latitude: latitude + (Math.random() - 0.5) * 0.0015,
      distance: '80m'
    },
    {
      id: 4,
      name: '7-11便利店',
      address: `${randomDistrict}店`,
      longitude: longitude + (Math.random() - 0.5) * 0.0012,
      latitude: latitude + (Math.random() - 0.5) * 0.0012,
      distance: '200m'
    },
    {
      id: 5,
      name: `${randomStreet}地铁站`,
      address: `地铁${Math.floor(Math.random() * 10 + 1)}号线`,
      longitude: longitude + (Math.random() - 0.5) * 0.003,
      latitude: latitude + (Math.random() - 0.5) * 0.003,
      distance: '300m'
    }
  ]
  
  return {
    address: {
      name: mainAddress,
      address: `${mainAddress} (${longitude.toFixed(6)}, ${latitude.toFixed(6)})`,
      longitude,
      latitude
    },
    pois
  }
}

// 计算两点间距离（简化版）
export function calculateDistance(
  lat1: number, lon1: number, 
  lat2: number, lon2: number
): number {
  const R = 6371 // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c * 1000 // 返回米
}

# 代驾应用前端 - 微信小程序

已完成后端API对接的微信小程序，包含完整的用户认证系统。

## 功能特性

✅ **用户认证系统**
- 用户注册（支持乘客/司机角色）
- 用户登录（支持用户名/邮箱登录）
- JWT令牌认证
- 自动登录状态检查
- 登录过期处理

✅ **用户界面**
- 登录页面（精美UI设计）
- 注册页面（角色选择）
- 个人信息页面（显示真实用户数据）
- 受保护路由认证

✅ **网络请求**
- 统一API配置
- 自动token管理
- 错误处理和重试机制
- 网络状态检测

## 页面结构

- `pages/login/` - 用户登录页面
- `pages/register/` - 用户注册页面  
- `pages/profile/` - 个人信息页面（已更新）
- `pages/role-selection/` - 角色选择页面
- `utils/api.ts` - API服务层
- `utils/request.ts` - 网络请求工具
- `utils/config.ts` - 配置文件

## 使用方法

### 1. 启动后端服务
确保后端API服务已启动（默认端口8000）：
```bash
cd daijia-back
python start.py
```

### 2. 配置API地址
如果后端服务地址不同，请修改：
```typescript
// utils/config.ts
export const API_CONFIG = {
  BASE_URL: 'http://你的后端地址:端口',
  // ...
}
```

### 3. 运行小程序
使用微信开发者工具打开 `daijia-front/miniprogram` 目录

## API对接状态

| 接口 | 状态 | 说明 |
|------|------|------|
| POST /register | ✅ | 用户注册 |
| POST /login | ✅ | 用户登录 |
| GET /profile | ✅ | 获取用户信息 |
| GET /protected | ✅ | 受保护接口测试 |

## 用户流程

1. **首次使用**: 应用启动 → 检查登录状态 → 跳转到登录页
2. **注册**: 登录页 → 注册页 → 填写信息 → 选择角色 → 注册成功 → 返回登录
3. **登录**: 输入用户名/邮箱和密码 → 登录成功 → 跳转到对应角色首页
4. **已登录**: 应用启动 → 自动检查token → 直接进入对应角色首页

## 角色系统

- **乘客 (passenger)**: 跳转到代驾页面 (`/pages/proxy/proxy`)
- **司机 (driver)**: 跳转到接单页面 (`/pages/orders/orders`)

## 数据存储

### 本地存储键名
- `access_token` - JWT访问令牌
- `user_info` - 用户基本信息
- `userRole` - 用户角色

### 全局数据
```typescript
globalData: {
  userRole: string,      // 用户角色
  userInfo: User | null, // 用户信息
  isLoggedIn: boolean    // 登录状态
}
```

## 错误处理

- **网络错误**: 自动显示错误提示
- **Token过期**: 自动跳转到登录页
- **认证失败**: 清除本地数据并重新登录
- **表单验证**: 实时验证用户输入

## 安全特性

- 密码输入保护（type="password"）
- JWT令牌自动过期检查
- 敏感数据加密存储
- 网络请求HTTPS支持（生产环境）

## 测试功能

在个人信息页面提供了以下测试功能：
- **测试认证接口**: 验证token是否有效
- **刷新用户信息**: 从服务器重新获取用户数据

## 开发注意事项

1. 确保后端服务已启动
2. 检查网络配置和域名白名单
3. 生产环境请修改API配置中的BASE_URL
4. 建议在真机上测试网络请求功能

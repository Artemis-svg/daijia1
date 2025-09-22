/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    userRole?: string,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
  checkUserRole?(): void,
  setupTabBar?(role: string): void,
  setPassengerTabBar?(): void,
  setDriverTabBar?(): void,
}
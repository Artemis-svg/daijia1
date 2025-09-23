/**
 * 简单的事件管理器
 * 用于页面间通信
 */

// 事件管理器 - 单例模式
export class EventManager {
  private static instance: EventManager;
  private listeners: Map<string, Array<(data: any) => void>> = new Map();

  private constructor() {}

  static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  // 订阅事件
  subscribe(eventType: string, callback: (data: any) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  // 取消订阅事件
  unsubscribe(eventType: string, callback: (data: any) => void): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // 发布事件
  publish(eventType: string, data: any): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => {
        callback(data);
      });
    }
  }
}

// 导出单例实例
export const eventManager = EventManager.getInstance();

// 事件类型常量
export const EVENT_TYPES = {
  NEW_ORDER_CREATED: 'NEW_ORDER_CREATED',  // 新订单创建
  ORDER_STATUS_CHANGED: 'ORDER_STATUS_CHANGED'  // 订单状态变化
} as const;

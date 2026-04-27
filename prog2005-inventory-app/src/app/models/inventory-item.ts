// 库存类别枚举
export enum Category {
  Electronics = 'Electronics',
  Furniture = 'Furniture',
  Clothing = 'Clothing',
  Tools = 'Tools',
  Miscellaneous = 'Miscellaneous'
}

// 库存状态枚举
export enum StockStatus {
  InStock = 'In Stock',
  LowStock = 'Low Stock',
  OutOfStock = 'Out of Stock'
}

// 库存物品接口
export interface InventoryItem {
  item_id?: number;          // 自增，可选
  item_name: string;          // 唯一，必填
  category: Category;         // 必填
  quantity: number;           // 必填，整数
  price: number;              // 必填，整数
  supplier_name: string;      // 必填
  stock_status: StockStatus;  // 必填
  featured_item: number;      // 0或1，默认0
  special_note?: string;      // 可选
}
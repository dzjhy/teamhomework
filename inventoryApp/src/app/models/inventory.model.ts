// 作业要求的品类枚举
export enum ItemCategory {
  Electronics = 'Electronics',
  Furniture = 'Furniture',
  Clothing = 'Clothing',
  Tools = 'Tools',
  Miscellaneous = 'Miscellaneous'
}

// 作业要求的库存状态枚举
export enum StockStatus {
  InStock = 'In Stock',
  LowStock = 'Low Stock',
  OutOfStock = 'Out of Stock'
}

// 作业要求的完整库存字段（与数据库字段完全匹配）
export interface InventoryItem {
  item_id?: number;          // 主键、自增，新增时无需传入
  item_name: string;          // 唯一、必填
  category: ItemCategory;     // 枚举、必填
  quantity: number;           // 整数、必填
  price: number;              // 整数、必填
  supplier_name: string;      // 字符串、必填
  stock_status: StockStatus;  // 枚举、必填
  featured_item: number;      // 0/1，默认0
  special_note?: string;      // 可选、可空
}
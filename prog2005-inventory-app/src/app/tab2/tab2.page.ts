import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem, Category, StockStatus } from '../models/inventory-item';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  newItem: InventoryItem = {
    item_name: '',
    category: Category.Electronics,
    quantity: 0,
    price: 0,
    supplier_name: '',
    stock_status: StockStatus.InStock,
    featured_item: 0,
    special_note: ''
  };
  featuredItems: InventoryItem[] = [];

  constructor(
    private inventoryService: InventoryService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadFeaturedItems();
  }

  // 加载推荐商品
  loadFeaturedItems() {
    this.inventoryService.getItems().subscribe({
      next: (items) => {
        this.featuredItems = items.filter(item => item.featured_item === 1);
      },
      error: (err) => console.error('加载推荐商品失败:', err)
    });
  }

  // 表单验证
  isFormValid(): boolean {
    return !!(
      this.newItem.item_name.trim() &&
      this.newItem.category &&
      this.newItem.quantity > 0 &&
      this.newItem.price > 0 &&
      this.newItem.supplier_name.trim() &&
      this.newItem.stock_status
    );
  }

  // 新增物品
  addItem() {
    this.inventoryService.addItem(this.newItem).subscribe({
      next: async () => {
        const alert = await this.alertController.create({
          header: '成功',
          message: '物品新增成功！',
          buttons: ['OK']
        });
        await alert.present();
        this.resetForm();
        this.loadFeaturedItems();
      },
      error: async (err) => {
        const alert = await this.alertController.create({
          header: '错误',
          message: '新增失败，请重试',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  // 重置表单
  resetForm() {
    this.newItem = {
      item_name: '',
      category: Category.Electronics,
      quantity: 0,
      price: 0,
      supplier_name: '',
      stock_status: StockStatus.InStock,
      featured_item: 0,
      special_note: ''
    };
  }

  // 显示帮助
  async showHelp() {
    const alert = await this.alertController.create({
      header: '使用帮助',
      message: '填写表单新增物品，带*为必填项。下方展示所有推荐商品。',
      buttons: ['知道了']
    });
    await alert.present();
  }
}

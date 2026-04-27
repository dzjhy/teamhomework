import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem, StockStatus } from '../models/inventory-item';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
  // 这里绝对不能有 standalone: true！！！
})
export class Tab1Page implements OnInit {
  allItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  searchTerm: string = '';

  constructor(
    private inventoryService: InventoryService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  // 加载所有物品
  loadItems() {
    this.inventoryService.getItems().subscribe({
      next: (items) => {
        this.allItems = items;
        this.filteredItems = items;
      },
      error: (err) => console.error('加载失败:', err)
    });
  }

  // 过滤物品
  filterItems() {
    if (!this.searchTerm.trim()) {
      this.filteredItems = this.allItems;
      return;
    }
    this.filteredItems = this.allItems.filter(item =>
      item.item_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // 获取状态颜色
  getStatusColor(status: StockStatus): string {
    switch (status) {
      case StockStatus.InStock: return 'success';
      case StockStatus.LowStock: return 'warning';
      case StockStatus.OutOfStock: return 'danger';
      default: return 'medium';
    }
  }

  // 显示帮助
  async showHelp() {
    const alert = await this.alertController.create({
      header: '使用帮助',
      message: '在此页面查看所有库存物品，使用顶部搜索栏按名称过滤。',
      buttons: ['知道了']
    });
    await alert.present();
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem, StockStatus } from '../models/inventory.model';
import { HelpComponent } from '../components/help/help.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab1Page implements OnInit {
  // 全量库存数据
  fullInventoryList: InventoryItem[] = [];
  // 过滤后的展示数据
  filteredList: InventoryItem[] = [];
  // 搜索关键词
  searchKeyword: string = '';

  constructor(
    private inventoryService: InventoryService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadInventoryList();
  }

  // 加载全量库存数据
  loadInventoryList(refresher?: any) {
    this.inventoryService.getAllItems().subscribe({
      next: (data) => {
        this.fullInventoryList = data;
        this.filteredList = data;
        // 关闭刷新动画
        if (refresher) refresher.complete();
      },
      error: (err) => {
        console.error('加载库存数据失败：', err);
        if (refresher) refresher.complete();
      }
    });
  }

  // 按名称过滤库存
  filterInventoryList() {
    const keyword = this.searchKeyword.trim().toLowerCase();
    if (!keyword) {
      this.filteredList = this.fullInventoryList;
      return;
    }
    this.filteredList = this.fullInventoryList.filter(item => 
      item.item_name.toLowerCase().includes(keyword)
    );
  }

  // 获取库存状态对应的颜色
  getStatusColor(status: StockStatus): string {
    switch (status) {
      case StockStatus.InStock: return 'success';
      case StockStatus.LowStock: return 'warning';
      case StockStatus.OutOfStock: return 'danger';
      default: return 'medium';
    }
  }

  // 打开帮助弹窗
  async openHelp() {
    const modal = await this.modalController.create({
      component: HelpComponent,
      componentProps: {
        pageTitle: '库存列表页',
        helpContent: '本页面展示所有库存记录，支持按物品名称搜索。下拉可刷新数据。精选物品会显示黄色徽章，库存状态用不同颜色标识：绿色=有货、黄色=库存不足、红色=缺货。'
      }
    });
    await modal.present();
  }
}
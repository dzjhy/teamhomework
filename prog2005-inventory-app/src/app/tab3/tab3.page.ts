import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem } from '../models/inventory-item';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  searchName: string = '';
  currentItem: InventoryItem | null = null;
  originalName: string = '';

  constructor(
    private inventoryService: InventoryService,
    private alertController: AlertController
  ) {}

  // 加载待编辑物品
  loadItemForEdit() {
    if (!this.searchName.trim()) {
      this.currentItem = null;
      return;
    }

    this.inventoryService.getItems().subscribe({
      next: (items) => {
        const found = items.find(item => 
          item.item_name.toLowerCase() === this.searchName.toLowerCase()
        );
        if (found) {
          this.currentItem = { ...found }; // 深拷贝避免直接修改
          this.originalName = found.item_name;
        } else {
          this.currentItem = null;
        }
      },
      error: (err) => console.error('加载失败:', err)
    });
  }

  // 更新物品
  updateItem() {
    if (!this.currentItem) return;

    this.inventoryService.updateItem(this.originalName, this.currentItem).subscribe({
      next: async () => {
        const alert = await this.alertController.create({
          header: '成功',
          message: '物品更新成功！',
          buttons: ['OK']
        });
        await alert.present();
      },
      error: async (err) => {
        const alert = await this.alertController.create({
          header: '错误',
          message: '更新失败，请重试',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  // 删除物品
  async deleteItem() {
    if (!this.currentItem) return;

    // 检查是否为Laptop
    if (this.currentItem.item_name === 'Laptop') {
      const alert = await this.alertController.create({
        header: '禁止删除',
        message: '根据系统要求，Laptop物品不可删除！',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // 确认删除
    const confirm = await this.alertController.create({
      header: '确认删除',
      message: `确定要删除物品 "${this.currentItem.item_name}" 吗？`,
      buttons: [
        { text: '取消', role: 'cancel' },
        {
          text: '删除',
          handler: () => {
            this.inventoryService.deleteItem(this.currentItem!.item_name).subscribe({
              next: async () => {
                const successAlert = await this.alertController.create({
                  header: '成功',
                  message: '物品删除成功！',
                  buttons: ['OK']
                });
                await successAlert.present();
                this.currentItem = null;
                this.searchName = '';
              },
              error: async (err) => {
                const errorAlert = await this.alertController.create({
                  header: '错误',
                  message: '删除失败，请重试',
                  buttons: ['OK']
                });
                await errorAlert.present();
              }
            });
          }
        }
      ]
    });
    await confirm.present();
  }

  // 显示帮助
  async showHelp() {
    const alert = await this.alertController.create({
      header: '使用帮助',
      message: '先搜索物品名称，加载后可编辑或删除。注意：Laptop不可删除！',
      buttons: ['知道了']
    });
    await alert.present();
  }
}

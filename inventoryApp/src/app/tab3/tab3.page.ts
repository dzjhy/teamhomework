import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController, AlertController } from '@ionic/angular';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem, ItemCategory, StockStatus } from '../models/inventory.model';
import { HelpComponent } from '../components/help/help.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class Tab3Page {
  searchItemName: string = '';
  targetItem?: InventoryItem;
  editForm!: FormGroup;
  categoryList = Object.values(ItemCategory);
  stockStatusList = Object.values(StockStatus);

  constructor(
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  searchTargetItem() {
    const itemName = this.searchItemName.trim();
    if (!itemName) return;

    this.inventoryService.getItemByName(itemName).subscribe({
      next: (item) => {
        this.targetItem = item;
        this.initEditForm(item);
      },
      error: async () => {
        const toast = await this.toastController.create({
          message: '未找到该物品，请检查名称是否正确',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
        this.targetItem = undefined;
      }
    });
  }

  // 修复：在FormControl里设置item_name为禁用状态，彻底解决类型报错
  initEditForm(item: InventoryItem) {
    this.editForm = this.formBuilder.group({
      // 这里设置disabled: true，模板里不需要写disabled了
      item_name: [{ value: item.item_name, disabled: true }, [Validators.required]],
      category: [item.category, [Validators.required]],
      quantity: [item.quantity, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      price: [item.price, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      supplier_name: [item.supplier_name, [Validators.required]],
      stock_status: [item.stock_status, [Validators.required]],
      featured_item: [item.featured_item === 1],
      special_note: [item.special_note || '']
    });
  }

  submitUpdate() {
    if (!this.editForm.valid || !this.targetItem) return;

    // 修复：禁用的表单控件需要用getRawValue()获取完整值
    const updateData = { ...this.editForm.getRawValue() };
    updateData.featured_item = updateData.featured_item ? 1 : 0;
    delete updateData.item_id;

    this.inventoryService.updateItem(this.targetItem.item_name, updateData).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: '物品信息更新成功！',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.searchTargetItem();
      },
      error: async (err) => {
        const toast = await this.toastController.create({
          message: err.error?.message || '更新失败',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  async confirmDelete() {
    if (!this.targetItem) return;

    if (this.targetItem.item_name === 'Laptop') {
      const toast = await this.toastController.create({
        message: '系统禁止删除Laptop物品！',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const alert = await this.alertController.create({
      header: '确认删除',
      message: `确定要永久删除物品「${this.targetItem.item_name}」吗？此操作不可恢复。`,
      buttons: [
        { text: '取消', role: 'cancel' },
        {
          text: '确认删除',
          role: 'destructive',
          handler: () => this.executeDelete()
        }
      ]
    });
    await alert.present();
  }

  executeDelete() {
    if (!this.targetItem) return;

    this.inventoryService.deleteItem(this.targetItem.item_name).subscribe({
      next: async (res) => {
        const toast = await this.toastController.create({
          message: res.message || '删除成功！',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.targetItem = undefined;
        this.searchItemName = '';
        this.editForm.reset();
      },
      error: async (err) => {
        const toast = await this.toastController.create({
          message: err.error?.message || '删除失败',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  async openHelp() {
    const modal = await this.modalController.create({
      component: HelpComponent,
      componentProps: {
        pageTitle: '编辑/删除页',
        helpContent: '本页面支持按物品名称搜索后，编辑或删除库存记录。物品名称不可修改，系统禁止删除Laptop物品。删除前会进行二次确认，防止误操作。'
      }
    });
    await modal.present();
  }
}
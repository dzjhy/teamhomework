import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem, ItemCategory, StockStatus } from '../models/inventory.model';
import { HelpComponent } from '../components/help/help.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class Tab2Page implements OnInit {
  // 新增表单
  addForm!: FormGroup;
  // 枚举选项列表
  categoryList = Object.values(ItemCategory);
  stockStatusList = Object.values(StockStatus);
  // 精选物品列表
  featuredList: InventoryItem[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.initAddForm();
    this.loadFeaturedList();
  }

  // 初始化表单（带作业要求的校验规则）
  initAddForm() {
    this.addForm = this.formBuilder.group({
      item_name: ['', [Validators.required]],
      category: [ItemCategory.Miscellaneous, [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      price: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      supplier_name: ['', [Validators.required]],
      stock_status: [StockStatus.InStock, [Validators.required]],
      featured_item: [false],
      special_note: ['']
    });
  }

  // 提交新增表单
  submitAddForm() {
    if (!this.addForm.valid) return;

    // 转换表单数据：toggle转为0/1，符合数据库要求
    const formData = { ...this.addForm.value };
    formData.featured_item = formData.featured_item ? 1 : 0;

    this.inventoryService.addItem(formData).subscribe({
      next: async () => {
        // 成功提示
        const toast = await this.toastController.create({
          message: '新增库存成功！',
          duration: 2000,
          color: 'success'
        });
        await toast.present();

        // 重置表单、刷新精选列表
        this.addForm.reset();
        this.initAddForm();
        this.loadFeaturedList();
      },
      error: async (err) => {
        // 失败提示
        const toast = await this.toastController.create({
          message: err.error?.message || '新增失败，请检查物品名称是否重复',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  // 加载精选物品列表
  loadFeaturedList() {
    this.inventoryService.getAllItems().subscribe({
      next: (data) => {
        this.featuredList = data.filter(item => item.featured_item === 1);
      },
      error: (err) => console.error('加载精选物品失败：', err)
    });
  }

  // 打开帮助弹窗
  async openHelp() {
    const modal = await this.modalController.create({
      component: HelpComponent,
      componentProps: {
        pageTitle: '新增/精选页',
        helpContent: '本页面支持新增库存记录（带完整表单校验），物品名称必须唯一。设为精选的物品会在下方列表展示。带*的为必填项。'
      }
    });
    await modal.present();
  }
}
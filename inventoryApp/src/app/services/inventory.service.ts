import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItem } from '../models/inventory.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // 作业指定的API根地址
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // GET: 获取所有库存记录
  getAllItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.apiUrl);
  }

  // GET: 按物品名称查询单条记录
  getItemByName(itemName: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.apiUrl}/${encodeURIComponent(itemName)}`);
  }

  // POST: 新增库存记录
  addItem(itemData: InventoryItem): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.apiUrl, itemData);
  }

  // PUT: 按名称更新已有记录
  updateItem(originalName: string, itemData: InventoryItem): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.apiUrl}/${encodeURIComponent(originalName)}`, itemData);
  }

  // DELETE: 按名称删除记录（作业要求禁止删除Laptop）
  deleteItem(itemName: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${encodeURIComponent(itemName)}`);
  }
}
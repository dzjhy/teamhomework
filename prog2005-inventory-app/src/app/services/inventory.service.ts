import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItem } from '../models/inventory-item';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  
  private apiUrl = 'https://prog2005.it.scu.edu.au/ArtGalley';

  constructor(private http: HttpClient) { }

  // 获取所有物品
  getItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.apiUrl);
  }

  // 新增物品
  addItem(item: InventoryItem): Observable<any> {
    return this.http.post(this.apiUrl, item);
  }

  // 按名称更新物品
  updateItem(name: string, item: InventoryItem): Observable<any> {
    return this.http.post(`${this.apiUrl}/${encodeURIComponent(name)}`, item);
  }

  // 按名称删除物品
  deleteItem(name: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${encodeURIComponent(name)}`);
  }
}
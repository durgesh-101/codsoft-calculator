import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly ordersStorageKey = 'phonehub_orders';
  private readonly ordersSubject = new BehaviorSubject<Order[]>(this.getStoredOrders());

  orders$ = this.ordersSubject.asObservable();

  placeOrder(order: Omit<Order, 'id' | 'placedAt'>): void {
    const nextOrder: Order = {
      ...order,
      id: Date.now(),
      placedAt: new Date().toISOString()
    };

    const orders = [nextOrder, ...this.ordersSubject.value];
    this.persistOrders(orders);
  }

  private getStoredOrders(): Order[] {
    const storedOrders = localStorage.getItem(this.ordersStorageKey);

    if (!storedOrders) {
      return [];
    }

    try {
      return JSON.parse(storedOrders) as Order[];
    } catch {
      return [];
    }
  }

  private persistOrders(orders: Order[]): void {
    localStorage.setItem(this.ordersStorageKey, JSON.stringify(orders));
    this.ordersSubject.next(orders);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  add(product: Product): void {
    const existing = this.items.find((item) => item.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.emit();
  }

  remove(productId: number): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.emit();
  }

  decrement(productId: number): void {
    const existing = this.items.find((item) => item.product.id === productId);
    if (!existing) {
      return;
    }
    existing.quantity -= 1;
    if (existing.quantity <= 0) {
      this.remove(productId);
      return;
    }
    this.emit();
  }

  clear(): void {
    this.items = [];
    this.emit();
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  getCount(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  private emit(): void {
    this.itemsSubject.next(this.getItems());
  }
}

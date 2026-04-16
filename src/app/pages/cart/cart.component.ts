import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  items$: Observable<CartItem[]> = this.cartService.items$;

  constructor(private cartService: CartService) {}

  increment(item: CartItem): void {
    this.cartService.add(item.product);
  }

  decrement(item: CartItem): void {
    this.cartService.decrement(item.product.id);
  }

  remove(item: CartItem): void {
    this.cartService.remove(item.product.id);
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }
}

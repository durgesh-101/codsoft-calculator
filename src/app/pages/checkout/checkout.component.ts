import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/product';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  items$: Observable<CartItem[]> = this.cartService.items$;
  orderPlaced = false;

  customer = {
    name: '',
    email: '',
    address: ''
  };

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private orderService: OrderService
  ) {}

  getTotal(): number {
    return this.cartService.getTotal();
  }

  placeOrder(): void {
    const currentUser = this.authService.getCurrentUser();
    const items = this.cartService.getItems();

    if (!currentUser || !items.length) {
      return;
    }

    this.orderService.placeOrder({
      customer: { ...this.customer },
      items,
      total: this.getTotal(),
      placedBy: {
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role
      }
    });

    this.orderPlaced = true;
    this.cartService.clear();
  }
}

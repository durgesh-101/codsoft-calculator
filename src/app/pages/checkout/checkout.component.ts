import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/product';
import { CartService } from '../../services/cart.service';

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

  constructor(private cartService: CartService) {}

  getTotal(): number {
    return this.cartService.getTotal();
  }

  placeOrder(): void {
    this.orderPlaced = true;
    this.cartService.clear();
  }
}

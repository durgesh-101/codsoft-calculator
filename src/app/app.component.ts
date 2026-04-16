import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cartCount$ = this.cartService.items$.pipe(
    map((items) => items.reduce((total, item) => total + item.quantity, 0))
  );

  constructor(private cartService: CartService) {}
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser$ = this.authService.currentUser$;
  isAuthenticated$ = this.authService.currentUser$.pipe(
    map((user) => !!user)
  );
  cartCount$ = this.cartService.items$.pipe(
    map((items) => items.reduce((total, item) => total + item.quantity, 0))
  );

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  logout(): void {
    this.cartService.clear();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

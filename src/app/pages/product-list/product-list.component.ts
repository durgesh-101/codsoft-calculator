import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  pageSize = 6;
  tableMinWidth = '1280px';
  frozenColumnWidth = '360px';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateTableLayout();

    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateTableLayout();
  }

  private updateTableLayout(): void {
    const viewportWidth = window.innerWidth;

    if (viewportWidth <= 640) {
      this.tableMinWidth = '920px';
      this.frozenColumnWidth = '220px';
      return;
    }

    if (viewportWidth <= 900) {
      this.tableMinWidth = '1080px';
      this.frozenColumnWidth = '280px';
      return;
    }

    this.tableMinWidth = '1280px';
    this.frozenColumnWidth = '360px';
  }

  goToProduct(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }

  addToCart(product: Product, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.cartService.add(product);
  }
}

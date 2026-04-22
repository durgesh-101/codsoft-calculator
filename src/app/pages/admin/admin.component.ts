import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, Product } from '../../models/product';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  products$: Observable<Product[]> = this.productService.getProducts();
  orders$: Observable<Order[]> = this.orderService.orders$;

  editingProductId: number | null = null;
  productForm: Product = this.createEmptyProduct();

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productService.initializeProducts();
  }

  saveProduct(): void {
    if (this.editingProductId) {
      this.productService.updateProduct(this.productForm);
    } else {
      this.productService.addProduct(this.productForm);
    }

    this.resetForm();
  }

  editProduct(product: Product): void {
    this.editingProductId = product.id;
    this.productForm = { ...product };
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId);

    if (this.editingProductId === productId) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.editingProductId = null;
    this.productForm = this.createEmptyProduct();
  }

  trackByProductId(_index: number, product: Product): number {
    return product.id;
  }

  trackByOrderId(_index: number, order: Order): number {
    return order.id;
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString();
  }

  private createEmptyProduct(): Product {
    return {
      id: 0,
      name: '',
      price: 0,
      brand: '',
      storage: '',
      camera: '',
      battery: '',
      screen: '',
      color: '#0f172a',
      description: '',
      image: ''
    };
  }
}

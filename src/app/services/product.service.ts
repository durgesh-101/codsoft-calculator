import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsUrl = 'assets/products.json';
  private readonly productsStorageKey = 'phonehub_products';
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  private initialized = false;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    this.initializeProducts();
    return this.productsSubject.asObservable();
  }

  getProduct(id: number): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map((products) => products.find((product) => product.id === id))
    );
  }

  initializeProducts(): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    const storedProducts = this.getStoredProducts();

    if (storedProducts.length) {
      this.productsSubject.next(storedProducts);
      return;
    }

    this.http.get<Product[]>(this.productsUrl).subscribe((products) => {
      this.persistProducts(products);
    });
  }

  addProduct(product: Product): void {
    const products = this.productsSubject.value;
    const nextProduct: Product = {
      ...product,
      id: this.getNextId(products)
    };

    this.persistProducts([...products, nextProduct]);
  }

  updateProduct(product: Product): void {
    const products = this.productsSubject.value.map((existingProduct) =>
      existingProduct.id === product.id ? { ...product } : existingProduct
    );

    this.persistProducts(products);
  }

  deleteProduct(productId: number): void {
    const products = this.productsSubject.value.filter((product) => product.id !== productId);
    this.persistProducts(products);
  }

  private getStoredProducts(): Product[] {
    const storedProducts = localStorage.getItem(this.productsStorageKey);

    if (!storedProducts) {
      return [];
    }

    try {
      return JSON.parse(storedProducts) as Product[];
    } catch {
      return [];
    }
  }

  private persistProducts(products: Product[]): void {
    localStorage.setItem(this.productsStorageKey, JSON.stringify(products));
    this.productsSubject.next(products);
  }

  private getNextId(products: Product[]): number {
    return products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
  }
}

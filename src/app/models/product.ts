export interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  storage: string;
  camera: string;
  battery: string;
  screen: string;
  color: string;
  description: string;
  image: string; 
}

export interface CartItem {
  product: Product;
  quantity: number;
}

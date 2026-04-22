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

export interface Order {
  id: number;
  customer: {
    name: string;
    email: string;
    address: string;
  };
  items: CartItem[];
  total: number;
  placedAt: string;
  placedBy: {
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}

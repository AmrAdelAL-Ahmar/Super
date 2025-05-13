export interface CartItem {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  unit: string;
  // Optional fields for compatibility with other parts of the app
  category?: string;
  categoryAr?: string;
  inStock?: boolean;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
} 
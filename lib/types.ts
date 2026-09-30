// lib/types.ts

export type StoreColor = 
  | 'primary' 
  | 'emerald' 
  | 'blue' 
  | 'purple' 
  | 'rose' 
  | 'amber' 
  | 'orange' 
  | 'teal' 
  | 'indigo' 
  | 'pink' 
  | 'cyan' 
  | 'slate';

export interface Store {
  id: number;
  code: string;
  name: string;
  description: string;
  phone: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  color: StoreColor;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  companyWholesalePrice: number;
  wholesalePrice: number;
  suggestedPrice: number;
  sellingPriceMin: number;
  category: string;
  imageUrl: string;
  images: string;
  stock: number;
  isRenewable: boolean;
  discount: number;
  adLinks: string;
  isActive: boolean;
  createdAt: string;
}

export interface StoreProduct {
  id: number;
  productId: number;
  price: number;
  sortOrder: number;
  product: Product;
}

export interface StorePublic {
  store: Store;
  products: StoreProduct[];
}

export interface StoreProductPublic {
  store: Store;
  item: StoreProduct;
}

export interface CartItem {
  productId: number;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface OrderPayload {
  items: { productId: number; quantity: number }[];
  customerName: string;
  customerPhone: string;
  backupPhone?: string;
  province: string;
  address: string;
  notes?: string;
}

export interface OrderResponse {
  orderId: number;
  totalAmount: number;
  storeName: string;
  storePhone: string;
}

export const PROVINCES = [
  'بغداد', 'البصرة', 'نينوى', 'الأنبار', 'كربلاء', 'النجف',
  'ذي قار', 'القادسية', 'بابل', 'ديالى', 'ميسان', 'واسط',
  'صلاح الدين', 'المثنى', 'كركوك', 'دهوك', 'أربيل', 'السليمانية',
] as const;
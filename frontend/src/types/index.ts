export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  active: boolean;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  categoryId: number;
  categoryName?: string;
  categorySlug?: string;
  description: string;
  price: number;
  packSize: string;
  stock: number;
  imageUrl: string;
  active: boolean;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  brand?: string;
  packSize?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerMobile: string;
  customerVillage?: string;
  customerNotes?: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  items: OrderItem[];
  createdAt: string;
  whatsAppMessage?: string;
  whatsAppUrl?: string;
}

export interface ShopSetting {
  shopName: string;
  phone: string;
  whatsapp: string;
  address: string;
  state?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  logoUrl?: string;
}

export interface AdminUser {
  username: string;
  fullName: string;
  role: string;
  token?: string;
}

export interface DashboardSummary {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  outOfStockProducts: number;
  totalCategories: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
}

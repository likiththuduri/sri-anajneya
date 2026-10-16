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
  bookingAvailable?: boolean;
  bookingNotes?: string;
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

export interface Booking {
  id: number;
  bookingReference: string;
  productId?: number;
  productName: string;
  brand?: string;
  packSize?: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  customerName: string;
  customerMobile: string;
  preferredPickupDate?: string;
  customerNotes?: string;
  adminNotes?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'READY_FOR_PICKUP' | 'COLLECTED' | 'CANCELLED';
  createdAt: string;
  updatedAt?: string;
  whatsAppUrl?: string;
}

export interface BookingCreateRequest {
  productId: number;
  quantity: number;
  customerName: string;
  customerMobile: string;
  preferredPickupDate?: string;
  customerNotes?: string;
}

export interface BookingStatusUpdateRequest {
  status: string;
  adminNotes?: string;
}

export interface WebsiteSection {
  id?: number;
  sectionKey: string;
  title: string;
  subtitle?: string;
  content?: string;
  buttonLabel?: string;
  buttonLink?: string;
  enabled: boolean;
  displayOrder: number;
  updatedAt?: string;
}

export interface ShopSetting {
  shopName: string;
  phone: string;
  whatsapp: string;
  address: string;
  buildingName?: string;
  doorPlotNumber?: string;
  streetRoad?: string;
  landmark?: string;
  villageLocality?: string;
  mandalDistrict?: string;
  state?: string;
  pincode?: string;
  country?: string;
  googleMapsUrl?: string;
  directionsUrl?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  announcementText?: string;
  announcementEnabled?: boolean;
  pickupInstructions?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  logoUrl?: string;
  heroCtaText?: string;
  heroBookCtaText?: string;
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

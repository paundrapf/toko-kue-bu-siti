// Types for Toko Kue Bu Siti E-Commerce Platform

export interface ProductVariant {
  id: string;
  name: string;
  size: 'Small' | 'Medium' | 'Large';
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  category: string;
  categoryName: string;
  variants: ProductVariant[];
  status: 'Available' | 'SoldOut' | 'PreOrder';
  featured: boolean;
  totalSold: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryNotes: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  orderType: 'Delivery' | 'Pickup';
  deliveryDate: string;
  deliveryTime: string;
  paymentMethod: string;
  paymentProof?: string;
  paymentStatus: 'Unpaid' | 'Paid' | 'Refunded';
  status: 'Pending' | 'Confirmed' | 'Baking' | 'Ready' | 'Delivered' | 'Cancelled';
  statusHistory: StatusChange[];
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantName: string;
  variantSize: string;
  quantity: number;
  pricePerItem: number;
  subtotal: number;
  image: string;
}

export interface StatusChange {
  status: string;
  changedAt: string;
  notes?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  categoryName: string;
  tags: string[];
  author: string;
  status: 'Draft' | 'Published';
  featured: boolean;
  views: number;
  createdAt: string;
  publishedAt?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  logo: string;
  favicon: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  instagram: string;
  facebook?: string;
  tiktok?: string;
  shippingCost: number;
  minOrderAmount?: number;
  leadTime: number;
  bankAccounts: BankAccount[];
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  ordersToday: number;
  revenueToday: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  ordersByStatus: Record<string, number>;
  topProducts: { product: Product; sold: number }[];
  recentOrders: Order[];
  lowStockProducts: Product[];
}

export type ViewState = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'order-confirmation' 
  | 'track-order' 
  | 'blog' 
  | 'blog-detail' 
  | 'about' 
  | 'contact' 
  | 'admin' 
  | 'admin-login';

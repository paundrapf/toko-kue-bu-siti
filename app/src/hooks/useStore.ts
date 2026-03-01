import { useState, useEffect, useCallback } from 'react';
import type { Cart, CartItem, Order, CustomerInfo, Product, ProductVariant } from '@/types';

const SHIPPING_COST = 20000;

// Generate order number: TK-YYYYMMDD-XXX
const generateOrderNumber = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 900) + 100;
  return `TK-${dateStr}-${random}`;
};

// Cart Store
export const useCartStore = () => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    shipping: SHIPPING_COST,
    total: 0,
    itemCount: 0
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCart(parsed);
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const calculateTotals = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = subtotal > 500000 ? 0 : SHIPPING_COST; // Free shipping for orders > 500k
    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
      itemCount
    };
  };

  const addToCart = useCallback((product: Product, variant: ProductVariant, quantity: number = 1) => {
    setCart(prev => {
      const existingItemIndex = prev.items.findIndex(
        item => item.product.id === product.id && item.variant.id === variant.id
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...prev.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: Math.min(
            newItems[existingItemIndex].quantity + quantity,
            variant.stock
          )
        };
      } else {
        // Add new item
        newItems = [...prev.items, {
          id: `${product.id}-${variant.id}-${Date.now()}`,
          product,
          variant,
          quantity: Math.min(quantity, variant.stock)
        }];
      }

      const totals = calculateTotals(newItems);
      return { ...prev, items: newItems, ...totals };
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setCart(prev => {
      const newItems = prev.items.map(item => {
        if (item.id === itemId) {
          return { ...item, quantity: Math.min(Math.max(1, quantity), item.variant.stock) };
        }
        return item;
      });
      const totals = calculateTotals(newItems);
      return { ...prev, items: newItems, ...totals };
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => {
      const newItems = prev.items.filter(item => item.id !== itemId);
      const totals = calculateTotals(newItems);
      return { ...prev, items: newItems, ...totals };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      subtotal: 0,
      shipping: SHIPPING_COST,
      total: 0,
      itemCount: 0
    });
  }, []);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };
};

// Orders Store
export const useOrdersStore = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        setOrders(parsed);
      } catch (e) {
        console.error('Failed to parse orders:', e);
      }
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = useCallback((
    customer: CustomerInfo,
    cart: Cart,
    orderType: 'Delivery' | 'Pickup',
    deliveryDate: string,
    deliveryTime: string
  ): Order => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      customer,
      items: cart.items.map(item => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId: item.product.id,
        productName: item.product.name,
        variantName: item.variant.name,
        variantSize: item.variant.size,
        quantity: item.quantity,
        pricePerItem: item.variant.price,
        subtotal: item.variant.price * item.quantity,
        image: item.product.images[0]
      })),
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      discount: 0,
      total: cart.total,
      orderType,
      deliveryDate,
      deliveryTime,
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Unpaid',
      status: 'Pending',
      statusHistory: [{
        status: 'Pending',
        changedAt: new Date().toISOString(),
        notes: 'Order created'
      }],
      adminNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const getOrderByNumber = useCallback((orderNumber: string): Order | undefined => {
    return orders.find(o => o.orderNumber === orderNumber);
  }, [orders]);

  const getOrderByNumberAndEmail = useCallback((orderNumber: string, email: string): Order | undefined => {
    const normalizedOrderNumber = orderNumber.trim().toUpperCase();
    const normalizedEmail = email.trim().toLowerCase();
    return orders.find(o =>
      o.orderNumber.toUpperCase() === normalizedOrderNumber &&
      o.customer.email.trim().toLowerCase() === normalizedEmail
    );
  }, [orders]);

  const upsertOrder = useCallback((order: Order) => {
    setOrders(prev => {
      const existingIndex = prev.findIndex(
        o => o.id === order.id || o.orderNumber === order.orderNumber
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = order;
        return updated;
      }
      return [order, ...prev];
    });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status'], notes?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const newStatusHistory = [...order.statusHistory, {
          status,
          changedAt: new Date().toISOString(),
          notes
        }];
        return {
          ...order,
          status,
          statusHistory: newStatusHistory,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    }));
  }, []);

  const uploadPaymentProof = useCallback((orderId: string, imageUrl: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          paymentProof: imageUrl,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    }));
  }, []);

  const confirmPayment = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const newStatusHistory = [...order.statusHistory, {
          status: 'Confirmed',
          changedAt: new Date().toISOString(),
          notes: 'Payment confirmed'
        }];
        return {
          ...order,
          status: 'Confirmed',
          paymentStatus: 'Paid',
          statusHistory: newStatusHistory,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    }));
  }, []);

  return {
    orders,
    createOrder,
    getOrderByNumber,
    getOrderByNumberAndEmail,
    upsertOrder,
    updateOrderStatus,
    uploadPaymentProof,
    confirmPayment
  };
};

// Admin Store
export const useAdminStore = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{ username: string; name: string } | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.expiresAt > Date.now()) {
          setIsAuthenticated(true);
          setAdminUser(parsed.user);
        } else {
          localStorage.removeItem('adminSession');
        }
      } catch (e) {
        localStorage.removeItem('adminSession');
      }
    }
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    // Simple authentication - in production, this should be server-side
    if (username === 'admin' && password === 'admin123') {
      const user = { username, name: 'Bu Siti' };
      setIsAuthenticated(true);
      setAdminUser(user);
      localStorage.setItem('adminSession', JSON.stringify({
        user,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      }));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('adminSession');
  }, []);

  return {
    isAuthenticated,
    adminUser,
    login,
    logout
  };
};

// Analytics Store
export const useAnalyticsStore = (orders: Order[]) => {
  const analytics = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    ordersToday: orders.filter(o => {
      const today = new Date().toISOString().slice(0, 10);
      return o.createdAt.slice(0, 10) === today;
    }).length,
    revenueToday: orders
      .filter(o => o.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10))
      .reduce((sum, o) => sum + o.total, 0),
    ordersThisMonth: orders.filter(o => {
      const thisMonth = new Date().toISOString().slice(0, 7);
      return o.createdAt.slice(0, 7) === thisMonth;
    }).length,
    revenueThisMonth: orders
      .filter(o => o.createdAt.slice(0, 7) === new Date().toISOString().slice(0, 7))
      .reduce((sum, o) => sum + o.total, 0),
    ordersByStatus: orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    recentOrders: orders.slice(0, 10)
  };

  return analytics;
};

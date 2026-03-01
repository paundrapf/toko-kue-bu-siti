import { useState, useEffect } from 'react';
import { 
  ShoppingCart, Search, Menu, X, Phone, Mail, MapPin, 
  Instagram, Facebook, ChevronLeft, ChevronRight, ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

import { ProductsView } from '@/sections/ProductsView';
import { ProductDetailView } from '@/sections/ProductDetailView';
import { CartDrawer } from '@/sections/CartDrawer';
import { CheckoutView } from '@/sections/CheckoutView';
import { OrderTrackingView } from '@/sections/OrderTrackingView';
import { BlogView } from '@/sections/BlogView';
import { BlogDetailView } from '@/sections/BlogDetailView';
import { AboutView } from '@/sections/AboutView';
import { ContactView } from '@/sections/ContactView';
import { AdminView } from '@/sections/AdminView';
import { AdminLoginView } from '@/sections/AdminLoginView';

import { 
  products, categories, siteSettings, 
  getFeaturedProducts, getFeaturedBlogPosts
} from '@/data/products';
import { 
  useCartStore, useOrdersStore, useAdminStore, useAnalyticsStore 
} from '@/hooks/useStore';
import { createOrderApi, trackOrderApi, uploadPaymentProofApi } from '@/lib/api';
import type { 
  ViewState, Product, BlogPost, Order
} from '@/types';

// Format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Main App Component
function App() {
  const [view, setView] = useState<ViewState>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const { cart, addToCart, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const {
    orders,
    getOrderByNumberAndEmail,
    updateOrderStatus,
    upsertOrder,
    uploadPaymentProof
  } = useOrdersStore();
  const { isAuthenticated, login, logout } = useAdminStore();
  const analytics = useAnalyticsStore(orders);

  // Hero slider auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Navigation handlers
  const navigateToHome = () => {
    setView('home');
    setSelectedProduct(null);
    setSelectedBlogPost(null);
    setSelectedCategory(null);
    window.scrollTo(0, 0);
  };

  const navigateToProducts = (categorySlug?: string) => {
    setView('products');
    setSelectedCategory(categorySlug || null);
    setSelectedProduct(null);
    window.scrollTo(0, 0);
  };

  const navigateToProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setView('product-detail');
    window.scrollTo(0, 0);
  };

  const navigateToBlog = () => {
    setView('blog');
    setSelectedBlogPost(null);
    window.scrollTo(0, 0);
  };

  const navigateToBlogDetail = (post: BlogPost) => {
    setSelectedBlogPost(post);
    setView('blog-detail');
    window.scrollTo(0, 0);
  };

  const navigateToCart = () => {
    setIsCartOpen(true);
  };

  const navigateToCheckout = () => {
    if (cart.items.length === 0) {
      toast.error('Keranjang belanja kosong');
      return;
    }
    setView('checkout');
    setIsCartOpen(false);
    window.scrollTo(0, 0);
  };

  const navigateToTrackOrder = () => {
    setView('track-order');
    window.scrollTo(0, 0);
  };

  const navigateToAbout = () => {
    setView('about');
    window.scrollTo(0, 0);
  };

  const navigateToContact = () => {
    setView('contact');
    window.scrollTo(0, 0);
  };

  const navigateToAdmin = () => {
    if (isAuthenticated) {
      setView('admin');
    } else {
      setView('admin-login');
    }
    window.scrollTo(0, 0);
  };

  const handleOrderComplete = async (order: Order): Promise<Order> => {
    let persistedOrder = order;
    try {
      persistedOrder = await createOrderApi(order);
      upsertOrder(persistedOrder);
      toast.success('Pesanan berhasil disimpan ke server');
    } catch {
      upsertOrder(order);
      toast.error('Gagal sinkron ke server. Pesanan disimpan lokal.');
    }

    clearCart();
    // Send WhatsApp notification
    const message = `Halo ${siteSettings.siteName}, saya telah melakukan pemesanan dengan nomor ${persistedOrder.orderNumber}. Mohon konfirmasinya. Terima kasih!`;
    const whatsappUrl = `https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    return persistedOrder;
  };

  const handleTrackOrder = async (orderNumber: string, email: string): Promise<Order | null> => {
    const apiOrder = await trackOrderApi(orderNumber, email);
    if (apiOrder) {
      upsertOrder(apiOrder);
      return apiOrder;
    }

    const localOrder = getOrderByNumberAndEmail(orderNumber, email);
    return localOrder || null;
  };

  const handleUploadPaymentProof = async (currentOrder: Order, file: File): Promise<Order> => {
    const uploaded = await uploadPaymentProofApi(currentOrder.id, file);
    uploadPaymentProof(currentOrder.id, uploaded.viewUrl);

    const refreshedOrder = await trackOrderApi(currentOrder.orderNumber, currentOrder.customer.email);
    if (refreshedOrder) {
      upsertOrder(refreshedOrder);
      return refreshedOrder;
    }

    const updatedOrder = {
      ...currentOrder,
      paymentProof: uploaded.viewUrl,
      updatedAt: new Date().toISOString()
    };
    upsertOrder(updatedOrder);
    return updatedOrder;
  };



  // Render Header
  const renderHeader = () => (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="bg-[#FF6B9D] text-white py-2 text-center text-sm">
        <span>Gratis Ongkir untuk pembelian di atas Rp 500.000</span>
      </div>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={navigateToHome}
          >
            <div className="w-10 h-10 bg-[#FF6B9D] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl font-bold text-gray-900">Toko Kue Bu Siti</h1>
              <p className="text-xs text-gray-500">Kue Homemade dengan Cinta</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={navigateToHome} className="text-gray-700 hover:text-[#FF6B9D] transition-colors">Beranda</button>
            <button onClick={() => navigateToProducts()} className="text-gray-700 hover:text-[#FF6B9D] transition-colors">Produk</button>
            <button onClick={navigateToBlog} className="text-gray-700 hover:text-[#FF6B9D] transition-colors">Blog</button>
            <button onClick={navigateToAbout} className="text-gray-700 hover:text-[#FF6B9D] transition-colors">Tentang Kami</button>
            <button onClick={navigateToContact} className="text-gray-700 hover:text-[#FF6B9D] transition-colors">Kontak</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden sm:flex items-center relative">
              <Input
                type="text"
                placeholder="Cari kue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-10 pr-4 py-2 rounded-full border-gray-200 focus:border-[#FF6B9D]"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    navigateToProducts();
                  }
                }}
              />
              <Search className="w-4 h-4 absolute left-3 text-gray-400" />
            </div>

            {/* Cart */}
            <button 
              onClick={navigateToCart}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B9D] text-white text-xs rounded-full flex items-center justify-center cart-badge">
                  {cart.itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4 space-y-2">
            <button onClick={() => { navigateToHome(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700">Beranda</button>
            <button onClick={() => { navigateToProducts(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700">Produk</button>
            <button onClick={() => { navigateToBlog(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700">Blog</button>
            <button onClick={() => { navigateToAbout(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700">Tentang Kami</button>
            <button onClick={() => { navigateToContact(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700">Kontak</button>
            <button onClick={() => { navigateToTrackOrder(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700">Lacak Pesanan</button>
          </nav>
        )}
      </div>
    </header>
  );

  // Render Footer
  const renderFooter = () => (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#FF6B9D] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">Toko Kue Bu Siti</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Kue homemade dengan resep turun-temurun. Menyediakan berbagai macam kue, brownies, cake, dan kue kering berkualitas premium.
            </p>
            <div className="flex gap-4">
              <a href={`https://instagram.com/${siteSettings.instagram}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF6B9D] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={`https://facebook.com/${siteSettings.facebook}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF6B9D] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={`https://wa.me/${siteSettings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#25D366] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Menu Cepat</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={navigateToHome} className="hover:text-[#FF6B9D] transition-colors">Beranda</button></li>
              <li><button onClick={() => navigateToProducts()} className="hover:text-[#FF6B9D] transition-colors">Produk</button></li>
              <li><button onClick={navigateToBlog} className="hover:text-[#FF6B9D] transition-colors">Blog</button></li>
              <li><button onClick={navigateToAbout} className="hover:text-[#FF6B9D] transition-colors">Tentang Kami</button></li>
              <li><button onClick={navigateToTrackOrder} className="hover:text-[#FF6B9D] transition-colors">Lacak Pesanan</button></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold mb-4">Kategori</h4>
            <ul className="space-y-2 text-gray-400">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <button onClick={() => navigateToProducts(cat.slug)} className="hover:text-[#FF6B9D] transition-colors">
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Hubungi Kami</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#FF6B9D] flex-shrink-0 mt-0.5" />
                <span className="text-sm">{siteSettings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#FF6B9D] flex-shrink-0" />
                <span className="text-sm">{siteSettings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#FF6B9D] flex-shrink-0" />
                <span className="text-sm">{siteSettings.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-gray-800" />

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Toko Kue Bu Siti. All rights reserved.
          </p>
          <button onClick={navigateToAdmin} className="text-gray-400 text-sm hover:text-[#FF6B9D] transition-colors">
            Admin Login
          </button>
        </div>
      </div>
    </footer>
  );

  // Render Hero Section
  const renderHero = () => {
    const heroSlides = [
      {
        image: '/images/hero/hero-1.jpg',
        title: 'Kue Homemade dengan Cinta',
        subtitle: 'Nikmati kelezatan kue premium buatan tangan dengan bahan berkualitas terbaik'
      },
      {
        image: '/images/hero/hero-2.jpg',
        title: 'Brownies Premium',
        subtitle: 'Brownies lembut dan nyoklat, favorit keluarga Indonesia'
      },
      {
        image: '/images/hero/hero-3.jpg',
        title: 'Cake Spesial untuk Momen Berharga',
        subtitle: 'Pesan cake custom untuk ulang tahun, pernikahan, dan acara spesial lainnya'
      }
    ];

    return (
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentHeroSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-3xl">
                <h2 className="font-display text-4xl md:text-6xl font-bold mb-4 animate-slideUp">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl mb-8 text-gray-200 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                  {slide.subtitle}
                </p>
                <div className="flex gap-4 justify-center animate-slideUp" style={{ animationDelay: '0.4s' }}>
                  <button 
                    onClick={() => navigateToProducts()}
                    className="btn-primary"
                  >
                    Lihat Produk
                  </button>
                  <button 
                    onClick={navigateToAbout}
                    className="btn-secondary border-white text-white hover:bg-white hover:text-gray-900"
                  >
                    Tentang Kami
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentHeroSlide ? 'bg-[#FF6B9D] w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentHeroSlide((prev) => (prev - 1 + 3) % 3)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentHeroSlide((prev) => (prev + 1) % 3)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>
    );
  };

  // Render Featured Products Section
  const renderFeaturedProducts = () => {
    const featuredProducts = getFeaturedProducts();

    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Produk Unggulan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan kue-kue terbaik kami yang paling diminati pelanggan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <div
                key={product.id}
                className="product-card bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer"
                onClick={() => navigateToProductDetail(product)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="product-image w-full h-full object-cover"
                  />
                  {product.featured && (
                    <span className="absolute top-3 left-3 bg-[#FF6B9D] text-white text-xs px-3 py-1 rounded-full">
                      Unggulan
                    </span>
                  )}
                  {product.status !== 'Available' && (
                    <span className={`absolute top-3 right-3 text-white text-xs px-3 py-1 rounded-full ${
                      product.status === 'SoldOut' ? 'bg-red-500' : 'bg-amber-500'
                    }`}>
                      {product.status === 'SoldOut' ? 'Habis' : 'Pre-Order'}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs text-[#FF6B9D] font-medium">{product.categoryName}</span>
                  <h3 className="font-semibold text-gray-900 mt-1 mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.shortDescription}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#FF6B9D]">
                      {formatPrice(product.variants[0]?.price || 0)}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (product.variants[0]) {
                          addToCart(product, product.variants[0], 1);
                          toast.success(`${product.name} ditambahkan ke keranjang`);
                        }
                      }}
                      disabled={product.status !== 'Available'}
                      className="w-10 h-10 bg-[#FF6B9D] text-white rounded-full flex items-center justify-center hover:bg-[#E85A8A] transition-colors disabled:bg-gray-300"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button 
              onClick={() => navigateToProducts()}
              className="btn-secondary inline-flex items-center gap-2"
            >
              Lihat Semua Produk
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    );
  };

  // Render Categories Section
  const renderCategories = () => (
    <section className="py-16 bg-[#FFF8E7]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kategori Produk
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pilih dari berbagai kategori kue yang kami sediakan
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => navigateToProducts(category.slug)}
              className="group cursor-pointer"
            >
              <div className="relative rounded-xl overflow-hidden aspect-square mb-3">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white font-semibold text-lg text-center">{category.name}</h3>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600">{category.productCount} Produk</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Render About Section
  const renderAboutSection = () => (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="/images/hero/hero-1.jpg"
              alt="Toko Kue Bu Siti"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-[#FF6B9D] text-white p-6 rounded-xl">
              <p className="text-4xl font-bold">20+</p>
              <p className="text-sm">Tahun Pengalaman</p>
            </div>
          </div>
          <div>
            <span className="text-[#FF6B9D] font-medium">Tentang Kami</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Cerita Kami, Cita Rasa yang Menginspirasi
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Toko Kue Bu Siti didirikan dengan cinta dan passion untuk baking. Berawal dari dapur kecil di rumah, 
              kami telah berkembang menjadi toko kue yang dikenal akan kualitas dan kelezatannya.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Setiap kue yang kami buat menggunakan bahan-bahan premium dan resep turun-temurun 
              yang telah sempurna selama lebih dari 20 tahun. Kami percaya bahwa kue yang baik 
              datang dari hati dan dibuat dengan cinta.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#FF6B9D]">5000+</p>
                <p className="text-sm text-gray-600">Pelanggan Puas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#FF6B9D]">50+</p>
                <p className="text-sm text-gray-600">Varian Kue</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#FF6B9D]">100%</p>
                <p className="text-sm text-gray-600">Homemade</p>
              </div>
            </div>
            <button 
              onClick={navigateToAbout}
              className="btn-primary inline-flex items-center gap-2"
            >
              Pelajari Lebih Lanjut
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  // Render Blog Section
  const renderBlogSection = () => {
    const featuredPosts = getFeaturedBlogPosts();

    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Artikel Terbaru
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tips, resep, dan cerita menarik seputar dunia baking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.slice(0, 3).map((post) => (
              <article
                key={post.id}
                onClick={() => navigateToBlogDetail(post)}
                className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#FF6B9D] text-white">{post.categoryName}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    <span>{post.views} views</span>
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-[#FF6B9D] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
                  <span className="text-[#FF6B9D] font-medium inline-flex items-center gap-2">
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-10">
            <button 
              onClick={navigateToBlog}
              className="btn-secondary inline-flex items-center gap-2"
            >
              Lihat Semua Artikel
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    );
  };

  // Render Home Page
  const renderHome = () => (
    <div className="animate-fadeIn">
      {renderHero()}
      {renderCategories()}
      {renderFeaturedProducts()}
      {renderAboutSection()}
      {renderBlogSection()}
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      
      {/* Render different views based on state */}
      {view === 'admin-login' && (
        <AdminLoginView 
          onLogin={(username, password) => {
            const success = login(username, password);
            if (success) {
              setView('admin');
            }
            return success;
          }}
          onBack={navigateToHome}
        />
      )}

      {view === 'admin' && isAuthenticated && (
        <AdminView
          orders={orders}
          products={products}
          analytics={analytics}
          onLogout={() => {
            logout();
            setView('home');
          }}
          onUpdateOrderStatus={updateOrderStatus}
        />
      )}

      {(view !== 'admin' && view !== 'admin-login') && (
        <>
          {renderHeader()}
          
          <main>
            {view === 'home' && renderHome()}
            
            {view === 'products' && (
              <ProductsView
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onProductClick={navigateToProductDetail}
                onAddToCart={(product, variant, quantity) => {
                  addToCart(product, variant, quantity);
                }}
              />
            )}

            {view === 'product-detail' && selectedProduct && (
              <ProductDetailView
                product={selectedProduct}
                onBack={() => navigateToProducts(selectedCategory || undefined)}
                onAddToCart={addToCart}
                onProductClick={navigateToProductDetail}
              />
            )}

            {view === 'checkout' && (
              <CheckoutView
                cart={cart}
                onBack={() => setView('products')}
                onOrderComplete={handleOrderComplete}
              />
            )}

            {view === 'track-order' && (
              <OrderTrackingView
                onTrackOrder={handleTrackOrder}
                onUploadPaymentProof={handleUploadPaymentProof}
              />
            )}

            {view === 'blog' && (
              <BlogView onPostClick={navigateToBlogDetail} />
            )}

            {view === 'blog-detail' && selectedBlogPost && (
              <BlogDetailView
                post={selectedBlogPost}
                onBack={navigateToBlog}
                onPostClick={navigateToBlogDetail}
              />
            )}

            {view === 'about' && <AboutView />}

            {view === 'contact' && <ContactView />}
          </main>

          {renderFooter()}

          {/* Cart Drawer */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={navigateToCheckout}
            onProductClick={navigateToProductDetail}
          />

          {/* WhatsApp Float Button */}
          <a
            href={`https://wa.me/${siteSettings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-float no-print"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </>
      )}
    </div>
  );
}

export default App;

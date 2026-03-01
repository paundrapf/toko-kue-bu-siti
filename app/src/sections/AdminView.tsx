import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, 
  LogOut, TrendingUp, DollarSign,
  Clock, Search, Eye, Plus, Trash2, RefreshCw,
  FileText, Settings, Save, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  createAdminBlogPostApi,
  createAdminProductApi,
  deleteAdminBlogPostApi,
  deleteAdminProductApi,
  fetchAdminBlogPostsApi,
  fetchAdminProductsApi,
  getSiteSettingsApi,
  sendTestNotificationApi,
  updateAdminProductApi,
  updateSiteSettingsApi
} from '@/lib/api';
import type { ApiSiteSettings } from '@/lib/api';
import type { BlogPost, Order, Product } from '@/types';

interface AdminViewProps {
  orders: Order[];
  products: Product[];
  analytics: {
    totalOrders: number;
    totalRevenue: number;
    ordersToday: number;
    revenueToday: number;
    ordersThisMonth: number;
    revenueThisMonth: number;
    ordersByStatus: Record<string, number>;
    recentOrders: Order[];
  };
  onLogout: () => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], notes?: string) => Promise<void> | void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Baking: 'bg-pink-100 text-pink-700',
  Ready: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700'
};

export function AdminView({ orders, products, analytics, onLogout, onUpdateOrderStatus }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [managedProducts, setManagedProducts] = useState<Product[]>(products);
  const [managedBlogPosts, setManagedBlogPosts] = useState<BlogPost[]>([]);
  const [settingsDraft, setSettingsDraft] = useState<ApiSiteSettings | null>(null);
  const [isSyncingProducts, setIsSyncingProducts] = useState(false);
  const [isSyncingBlog, setIsSyncingBlog] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [notificationChannel, setNotificationChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [notificationTarget, setNotificationTarget] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('Ini adalah pesan test notifikasi dari admin panel.');

  useEffect(() => {
    setManagedProducts(products);
  }, [products]);

  useEffect(() => {
    if (activeTab === 'blog' && managedBlogPosts.length === 0) {
      void syncBlogFromApi();
    }
    if (activeTab === 'settings' && !settingsDraft) {
      void loadSettings();
    }
  }, [activeTab]);

  const syncProductsFromApi = async () => {
    setIsSyncingProducts(true);
    try {
      const apiProducts = await fetchAdminProductsApi();
      if (apiProducts.length > 0) {
        setManagedProducts(apiProducts);
        toast.success('Data produk berhasil disinkronkan dari API');
      } else {
        toast.info('API produk belum memiliki data, menampilkan data lokal');
      }
    } catch {
      toast.error('Gagal sinkron produk dari API');
    } finally {
      setIsSyncingProducts(false);
    }
  };

  const createSampleProduct = async () => {
    try {
      const now = Date.now();
      await createAdminProductApi({
        name: `Produk Contoh ${now}`,
        slug: `produk-contoh-${now}`,
        description: 'Produk contoh dari admin panel',
        shortDescription: 'Produk contoh',
        category: managedProducts[0]?.category || 'cat-default',
        status: 'Available',
        featured: false,
        images: ['/images/products/brownies-cokelat-1.jpg'],
        variants: [
          {
            id: `variant-${now}`,
            name: 'Original',
            size: 'Medium',
            price: 85000,
            stock: 10
          }
        ]
      });
      toast.success('Produk contoh berhasil ditambahkan');
      await syncProductsFromApi();
    } catch {
      toast.error('Gagal menambahkan produk contoh');
    }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      await updateAdminProductApi(product.id, { featured: !product.featured });
      setManagedProducts(prev =>
        prev.map(item => (item.id === product.id ? { ...item, featured: !item.featured } : item))
      );
      toast.success('Featured produk berhasil diperbarui');
    } catch {
      toast.error('Gagal mengubah status featured');
    }
  };

  const deleteProduct = async (product: Product) => {
    try {
      await deleteAdminProductApi(product.id);
      setManagedProducts(prev => prev.filter(item => item.id !== product.id));
      toast.success('Produk berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus produk');
    }
  };

  const syncBlogFromApi = async () => {
    setIsSyncingBlog(true);
    try {
      const posts = await fetchAdminBlogPostsApi();
      setManagedBlogPosts(posts);
      toast.success('Data blog berhasil disinkronkan dari API');
    } catch {
      toast.error('Gagal sinkron blog dari API');
    } finally {
      setIsSyncingBlog(false);
    }
  };

  const createSampleBlogPost = async () => {
    try {
      const now = Date.now();
      await createAdminBlogPostApi({
        title: `Artikel Contoh ${now}`,
        slug: `artikel-contoh-${now}`,
        excerpt: 'Artikel contoh dari admin panel',
        content: '<p>Konten artikel contoh.</p>',
        category: managedBlogPosts[0]?.category || 'blog-default',
        featuredImage: '/images/blog/brownies-recipe.jpg',
        tags: ['contoh', 'admin'],
        status: 'Draft',
        featured: false
      });
      toast.success('Artikel contoh berhasil ditambahkan');
      await syncBlogFromApi();
    } catch {
      toast.error('Gagal menambahkan artikel contoh');
    }
  };

  const deleteBlogPost = async (post: BlogPost) => {
    try {
      await deleteAdminBlogPostApi(post.id);
      setManagedBlogPosts(prev => prev.filter(item => item.id !== post.id));
      toast.success('Artikel berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus artikel');
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await getSiteSettingsApi();
      setSettingsDraft(settings);
      toast.success('Pengaturan berhasil dimuat');
    } catch {
      toast.error('Gagal memuat pengaturan');
    }
  };

  const saveSettings = async () => {
    if (!settingsDraft) {
      return;
    }

    setIsSavingSettings(true);
    try {
      const updated = await updateSiteSettingsApi(settingsDraft);
      setSettingsDraft(updated);
      toast.success('Pengaturan berhasil disimpan');
    } catch {
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const sendNotificationTest = async () => {
    if (!notificationTarget.trim()) {
      toast.error('Target notifikasi wajib diisi');
      return;
    }

    try {
      await sendTestNotificationApi(
        notificationChannel,
        notificationTarget,
        notificationMessage,
        'Test Notifikasi Admin'
      );
      toast.success('Test notifikasi berhasil dikirim');
    } catch {
      toast.error('Gagal mengirim test notifikasi');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    await onUpdateOrderStatus(orderId, newStatus);
    toast.success(`Status pesanan diperbarui menjadi ${newStatus}`);
    setSelectedOrder(null);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pesanan</p>
                <p className="text-3xl font-bold">{analytics.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{analytics.ordersToday} hari ini
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pendapatan</p>
                <p className="text-3xl font-bold">{formatPrice(analytics.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {formatPrice(analytics.revenueToday)} hari ini
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Produk</p>
                <p className="text-3xl font-bold">{managedProducts.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">
                {managedProducts.filter(p => p.status === 'Available').length} tersedia
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Menunggu</p>
                <p className="text-3xl font-bold">{analytics.ordersByStatus.Pending || 0}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-amber-600">
                Perlu diproses
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pesanan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">No. Pesanan</th>
                  <th className="text-left py-3 px-4">Pelanggan</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Tanggal</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                    <td className="py-3 px-4">{order.customer.fullName}</td>
                    <td className="py-3 px-4">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[order.status]}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Orders by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
              <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-gray-500">{status}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrders = () => (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Daftar Pesanan</CardTitle>
          <div className="flex gap-4">
            <select
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Baking">Baking</option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari pesanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">No. Pesanan</th>
                <th className="text-left py-3 px-4">Pelanggan</th>
                <th className="text-left py-3 px-4">Produk</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Tanggal</th>
                <th className="text-left py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{order.customer.fullName}</p>
                      <p className="text-sm text-gray-500">{order.customer.phone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{order.items.length} item</td>
                  <td className="py-3 px-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="py-3 px-4">
                    <Badge className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#FF6B9D] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">Admin Panel</h1>
                <p className="text-sm text-gray-500">Toko Kue Bu Siti</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Pesanan
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="w-4 h-4 mr-2" />
              Produk
            </TabsTrigger>
            <TabsTrigger value="blog">
              <FileText className="w-4 h-4 mr-2" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Pengaturan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {renderDashboard()}
          </TabsContent>

          <TabsContent value="orders">
            {renderOrders()}
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between gap-3">
                  <CardTitle>Daftar Produk</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={syncProductsFromApi} disabled={isSyncingProducts}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {isSyncingProducts ? 'Sinkron...' : 'Sinkronkan API'}
                    </Button>
                    <Button onClick={createSampleProduct} className="bg-[#FF6B9D] hover:bg-[#E85A8A]">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Contoh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Produk</th>
                        <th className="text-left py-3 px-4">Kategori</th>
                        <th className="text-left py-3 px-4">Harga</th>
                        <th className="text-left py-3 px-4">Stok</th>
                        <th className="text-left py-3 px-4">Terjual</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {managedProducts.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images?.[0] || '/images/products/brownies-cokelat-1.jpg'}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{product.categoryName}</td>
                          <td className="py-3 px-4">{formatPrice(product.variants[0]?.price || 0)}</td>
                          <td className="py-3 px-4">
                            {product.variants.reduce((sum, v) => sum + v.stock, 0)}
                          </td>
                          <td className="py-3 px-4">{product.totalSold}</td>
                          <td className="py-3 px-4">
                            <Badge className={product.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                              {product.status === 'Available' ? 'Tersedia' : 'Habis'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => toggleFeatured(product)}>
                                {product.featured ? 'Unfeature' : 'Feature'}
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => deleteProduct(product)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {managedProducts.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-gray-500">
                            Belum ada data produk. Klik "Sinkronkan API" atau "Tambah Contoh".
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between gap-3">
                  <CardTitle>Manajemen Blog</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={syncBlogFromApi} disabled={isSyncingBlog}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {isSyncingBlog ? 'Sinkron...' : 'Sinkronkan API'}
                    </Button>
                    <Button onClick={createSampleBlogPost} className="bg-[#FF6B9D] hover:bg-[#E85A8A]">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Artikel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Judul</th>
                        <th className="text-left py-3 px-4">Kategori</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Views</th>
                        <th className="text-left py-3 px-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {managedBlogPosts.map((post) => (
                        <tr key={post.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{post.title}</td>
                          <td className="py-3 px-4">{post.categoryName}</td>
                          <td className="py-3 px-4">{post.status}</td>
                          <td className="py-3 px-4">{post.views}</td>
                          <td className="py-3 px-4">
                            <Button size="sm" variant="destructive" onClick={() => deleteBlogPost(post)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {managedBlogPosts.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-500">
                            Belum ada data blog. Klik "Sinkronkan API" atau "Tambah Artikel".
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between gap-3">
                  <CardTitle>Pengaturan Situs</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={loadSettings}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Muat dari API
                    </Button>
                    <Button
                      onClick={saveSettings}
                      disabled={!settingsDraft || isSavingSettings}
                      className="bg-[#FF6B9D] hover:bg-[#E85A8A]"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSavingSettings ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!settingsDraft && (
                  <p className="text-sm text-gray-500">Klik "Muat dari API" untuk menampilkan data pengaturan.</p>
                )}

                {settingsDraft && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Nama Situs</label>
                      <Input
                        value={String(settingsDraft.site_name || '')}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, site_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Tagline</label>
                      <Input
                        value={String(settingsDraft.tagline || '')}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, tagline: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Email</label>
                      <Input
                        value={String(settingsDraft.email || '')}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Telepon</label>
                      <Input
                        value={String(settingsDraft.phone || '')}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Instagram URL</label>
                      <Input
                        value={String(settingsDraft.instagram_url || '')}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, instagram_url: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Ongkir Default</label>
                      <Input
                        type="number"
                        value={String(settingsDraft.shipping_cost || 0)}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, shipping_cost: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <h4 className="font-semibold mb-3">Test Notifikasi</h4>
                  <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_1fr_auto] gap-3">
                    <select
                      value={notificationChannel}
                      onChange={(e) => setNotificationChannel(e.target.value as 'whatsapp' | 'email')}
                      className="border rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                    </select>
                    <Input
                      placeholder={notificationChannel === 'whatsapp' ? 'Contoh: 62812xxxx' : 'email@domain.com'}
                      value={notificationTarget}
                      onChange={(e) => setNotificationTarget(e.target.value)}
                    />
                    <Input
                      placeholder="Pesan test"
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                    />
                    <Button onClick={sendNotificationTest}>
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Pesanan</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Nomor Pesanan</p>
                  <p className="text-xl font-bold">{selectedOrder.orderNumber}</p>
                </div>
                <Badge className={statusColors[selectedOrder.status]}>
                  {selectedOrder.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Pelanggan</p>
                  <p className="font-medium">{selectedOrder.customer.fullName}</p>
                  <p className="text-sm">{selectedOrder.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal</p>
                  <p>{formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Item Pesanan</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img src={item.image} alt={item.productName} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-500">{item.variantName} x{item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatPrice(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[#FF6B9D]">{formatPrice(selectedOrder.total)}</span>
              </div>

              {/* Status Update */}
              {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {['Pending', 'Confirmed', 'Baking', 'Ready', 'Delivered', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder.id, status as Order['status'])}
                        disabled={selectedOrder.status === status}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedOrder.status === status
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-[#FF6B9D] text-white hover:bg-[#E85A8A]'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

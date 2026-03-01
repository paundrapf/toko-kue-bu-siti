import { useState } from 'react';
import { Search, ShoppingCart, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { products, categories } from '@/data/products';
import type { Product } from '@/types';

interface ProductsViewProps {
  selectedCategory: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, variant: any, quantity: number) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

export function ProductsView({ 
  selectedCategory, 
  searchQuery, 
  setSearchQuery,
  onProductClick,
  onAddToCart 
}: ProductsViewProps) {
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  // Filter products
  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory 
      ? product.category === categories.find(c => c.slug === selectedCategory)?.id
      : true;
    const matchesPrice = product.variants.some(v => v.price >= priceRange[0] && v.price <= priceRange[1]);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0);
      case 'price-high':
        return (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0);
      case 'popular':
        return b.totalSold - a.totalSold;
      default:
        return 0;
    }
  });

  const selectedCategoryName = selectedCategory 
    ? categories.find(c => c.slug === selectedCategory)?.name 
    : null;

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="bg-[#FFF8E7] py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {selectedCategoryName || 'Semua Produk'}
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Temukan berbagai macam kue lezat dan berkualitas untuk berbagai acara spesial Anda.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Filter</h3>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Kategori</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => window.location.reload()}
                    className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${
                      !selectedCategory ? 'bg-[#FF6B9D] text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    Semua Kategori
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.set('category', cat.slug);
                        window.history.pushState({}, '', url);
                      }}
                      className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${
                        selectedCategory === cat.slug ? 'bg-[#FF6B9D] text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Rentang Harga</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="50000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-[#FF6B9D]"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Rp 0</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="text-gray-600">
                Menampilkan <span className="font-semibold">{filteredProducts.length}</span> produk
              </p>
              
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 pl-10"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm focus:border-[#FF6B9D] focus:outline-none"
                >
                  <option value="newest">Terbaru</option>
                  <option value="popular">Terpopuler</option>
                  <option value="price-low">Harga: Rendah ke Tinggi</option>
                  <option value="price-high">Harga: Tinggi ke Rendah</option>
                </select>

                {/* View Mode */}
                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-[#FF6B9D] text-white' : 'hover:bg-gray-100'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-[#FF6B9D] text-white' : 'hover:bg-gray-100'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Produk tidak ditemukan</h3>
                <p className="text-gray-600">Coba ubah filter atau kata kunci pencarian Anda</p>
              </div>
            ) : (
              <div className={`grid ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'grid-cols-1 gap-4'
              }`}>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer group ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                    onClick={() => onProductClick(product)}
                  >
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-48' : 'h-56'}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                    <div className="p-4 flex-1">
                      <span className="text-xs text-[#FF6B9D] font-medium">{product.categoryName}</span>
                      <h3 className="font-semibold text-gray-900 mt-1 mb-2">{product.name}</h3>
                      <p className={`text-sm text-gray-500 mb-3 ${viewMode === 'list' ? '' : 'line-clamp-2'}`}>
                        {product.shortDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-[#FF6B9D]">
                            {formatPrice(product.variants[0]?.price || 0)}
                          </span>
                          {product.variants.length > 1 && (
                            <span className="text-sm text-gray-400 ml-2">
                              {product.variants.length} varian
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (product.variants[0] && product.status === 'Available') {
                              onAddToCart(product, product.variants[0], 1);
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

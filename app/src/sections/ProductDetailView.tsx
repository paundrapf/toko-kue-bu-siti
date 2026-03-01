import { useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingCart, Share2, Heart, Star, Truck, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { getRelatedProducts } from '@/data/products';
import type { Product } from '@/types';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, variant: any, quantity: number) => void;
  onProductClick: (product: Product) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

export function ProductDetailView({ 
  product, 
  onBack, 
  onAddToCart,
  onProductClick 
}: ProductDetailViewProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const relatedProducts = getRelatedProducts(product.id, 4);

  const handleAddToCart = () => {
    if (selectedVariant.stock < quantity) {
      toast.error('Stok tidak mencukupi');
      return;
    }
    onAddToCart(product, selectedVariant, quantity);
    toast.success(`${product.name} (${selectedVariant.name}) ditambahkan ke keranjang`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link produk disalin ke clipboard');
  };

  return (
    <div className="animate-fadeIn">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF6B9D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Produk
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.status !== 'Available' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className={`text-white text-xl font-bold px-6 py-3 rounded-full ${
                    product.status === 'SoldOut' ? 'bg-red-500' : 'bg-amber-500'
                  }`}>
                    {product.status === 'SoldOut' ? 'Stok Habis' : 'Pre-Order'}
                  </span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-[#FF6B9D]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="mb-2 bg-[#FFF8E7] text-[#8B4513] hover:bg-[#FFF8E7]">
                  {product.categoryName}
                </Badge>
                <h1 className="font-display text-3xl font-bold text-gray-900">{product.name}</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-full border transition-colors ${
                    isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full border hover:bg-gray-100 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-gray-600">(128 ulasan)</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">{product.totalSold} terjual</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl font-bold text-[#FF6B9D]">
                {formatPrice(selectedVariant?.price || 0)}
              </p>
              {selectedVariant?.stock <= 5 && selectedVariant?.stock > 0 && (
                <p className="text-amber-600 text-sm mt-1">
                  Stok tersisa: {selectedVariant.stock}
                </p>
              )}
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

            {/* Variant Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Pilih Varian</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock === 0}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedVariant?.id === variant.id
                        ? 'border-[#FF6B9D] bg-[#FF6B9D]/10 text-[#FF6B9D]'
                        : variant.stock === 0
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-200 hover:border-[#FF6B9D]'
                    }`}
                  >
                    <span className="font-medium">{variant.name}</span>
                    <span className="text-sm ml-2">({variant.size})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-semibold mb-3">Jumlah</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariant?.stock || 10, quantity + 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-gray-500">
                  Stok: {selectedVariant?.stock || 0}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={product.status !== 'Available' || selectedVariant?.stock === 0}
                className="flex-1 bg-[#FF6B9D] hover:bg-[#E85A8A] text-white py-6 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Tambah ke Keranjang
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-[#FF6B9D]" />
                <p className="text-sm text-gray-600">Gratis Ongkir</p>
                <p className="text-xs text-gray-400">Min. Rp 500rb</p>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-[#FF6B9D]" />
                <p className="text-sm text-gray-600">Pesanan Dibuat</p>
                <p className="text-xs text-gray-400">2-3 Hari</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-[#FF6B9D]" />
                <p className="text-sm text-gray-600">Garansi</p>
                <p className="text-xs text-gray-400">Kualitas Terbaik</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent">
              <TabsTrigger value="description" className="data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B9D] rounded-none">
                Deskripsi
              </TabsTrigger>
              <TabsTrigger value="ingredients" className="data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B9D] rounded-none">
                Bahan
              </TabsTrigger>
              <TabsTrigger value="shipping" className="data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B9D] rounded-none">
                Pengiriman
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-6">
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="ingredients" className="py-6">
              <div className="prose max-w-none">
                <p className="text-gray-600">Bahan-bahan premium yang kami gunakan:</p>
                <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
                  <li>Tepung terigu premium</li>
                  <li>Mentega berkualitas tinggi</li>
                  <li>Gula pasir halus</li>
                  <li>Telur segar</li>
                  <li>Cokelat premium (untuk varian cokelat)</li>
                  <li>Tanpa pengawet buatan</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="py-6">
              <div className="prose max-w-none">
                <p className="text-gray-600">Informasi pengiriman:</p>
                <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
                  <li>Pengiriman dilakukan setiap hari kecuali Minggu</li>
                  <li>Gratis ongkir untuk pembelian di atas Rp 500.000</li>
                  <li>Estimasi pengiriman 1-3 hari untuk area Jakarta</li>
                  <li>3-5 hari untuk luar Jakarta</li>
                  <li>Kue dikemas dengan aman menggunakan box khusus</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Produk Terkait</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  onClick={() => onProductClick(relatedProduct)}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-[#FF6B9D] font-medium">{relatedProduct.categoryName}</span>
                    <h3 className="font-semibold text-gray-900 mt-1 mb-2 line-clamp-1">{relatedProduct.name}</h3>
                    <p className="text-lg font-bold text-[#FF6B9D]">
                      {formatPrice(relatedProduct.variants[0]?.price || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

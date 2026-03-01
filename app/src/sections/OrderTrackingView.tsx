import { useState } from 'react';
import { Search, Package, Clock, CheckCircle, Truck, Home, X, Copy, Check, Calendar, Phone, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import type { Order } from '@/types';

interface OrderTrackingViewProps {
  getOrderByNumber: (orderNumber: string) => Order | undefined;
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
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const statusConfig: Record<string, { icon: any; color: string; label: string; description: string }> = {
  Pending: { 
    icon: Clock, 
    color: 'text-amber-500', 
    label: 'Menunggu Pembayaran',
    description: 'Pesanan menunggu konfirmasi pembayaran'
  },
  Confirmed: { 
    icon: CheckCircle, 
    color: 'text-blue-500', 
    label: 'Dikonfirmasi',
    description: 'Pesanan telah dikonfirmasi'
  },
  Baking: { 
    icon: Package, 
    color: 'text-pink-500', 
    label: 'Sedang Dibuat',
    description: 'Kue sedang dalam proses pembuatan'
  },
  Ready: { 
    icon: Package, 
    color: 'text-purple-500', 
    label: 'Siap Diambil/Dikirim',
    description: 'Pesanan siap untuk diambil atau dikirim'
  },
  Delivered: { 
    icon: Home, 
    color: 'text-green-500', 
    label: 'Selesai',
    description: 'Pesanan telah diterima'
  },
  Cancelled: { 
    icon: X, 
    color: 'text-red-500', 
    label: 'Dibatalkan',
    description: 'Pesanan telah dibatalkan'
  }
};

const statusFlow = ['Pending', 'Confirmed', 'Baking', 'Ready', 'Delivered'];

export function OrderTrackingView({ getOrderByNumber }: OrderTrackingViewProps) {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast.error('Masukkan nomor pesanan');
      return;
    }
    const found = getOrderByNumber(orderNumber.trim().toUpperCase());
    setOrder(found || null);
    setSearched(true);
    if (!found) {
      toast.error('Pesanan tidak ditemukan');
    }
  };

  const copyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Nomor pesanan disalin');
    }
  };

  const getStatusIndex = (status: string) => statusFlow.indexOf(status);

  return (
    <div className="animate-fadeIn min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lacak Pesanan
          </h1>
          <p className="text-gray-600">
            Masukkan nomor pesanan Anda untuk melihat status pesanan
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Contoh: TK-20240301-123"
                  className="pl-12 py-6 text-lg"
                />
              </div>
              <Button type="submit" className="bg-[#FF6B9D] hover:bg-[#E85A8A] px-8 py-6">
                Cari
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nomor Pesanan</p>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-[#FF6B9D]">{order.orderNumber}</h2>
                      <button
                        onClick={copyOrderNumber}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {(() => {
                      const StatusIcon = statusConfig[order.status]?.icon || Clock;
                      return (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 ${statusConfig[order.status]?.color}`}>
                          <StatusIcon className="w-5 h-5" />
                          <span className="font-medium">{statusConfig[order.status]?.label}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <p className="text-gray-600 mt-4">{statusConfig[order.status]?.description}</p>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-6">Status Pesanan</h3>
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                  {statusFlow.map((status, idx) => {
                    const StatusIcon = statusConfig[status].icon;
                    const isCompleted = getStatusIndex(order.status) >= idx;
                    const isCurrent = order.status === status;
                    
                    return (
                      <div key={status} className={`relative flex items-start gap-4 mb-6 ${
                        isCompleted ? 'opacity-100' : 'opacity-40'
                      }`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                          isCurrent ? 'bg-[#FF6B9D] text-white' :
                          isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 pt-2">
                          <p className={`font-semibold ${isCurrent ? 'text-[#FF6B9D]' : 'text-gray-900'}`}>
                            {statusConfig[status].label}
                          </p>
                          {isCurrent && (
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(order.updatedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Informasi Pembeli</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{order.customer.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <p>{order.customer.phone}</p>
                    </div>
                    {order.customer.email && (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5" />
                        <p className="text-gray-600">{order.customer.email}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Informasi Pengiriman</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{order.orderType === 'Delivery' ? 'Delivery' : 'Pickup'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <p>{new Date(order.deliveryDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    {order.deliveryTime && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <p>{order.deliveryTime}</p>
                      </div>
                    )}
                    {order.orderType === 'Delivery' && order.customer.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <p className="text-gray-600">{order.customer.address}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Detail Pesanan</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{item.productName}</p>
                        <p className="text-sm text-gray-500">{item.variantName} ({item.variantSize})</p>
                        <p className="text-sm text-gray-500">{item.quantity} x {formatPrice(item.pricePerItem)}</p>
                      </div>
                      <p className="font-semibold text-[#FF6B9D]">{formatPrice(item.subtotal)}</p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ongkir</span>
                    <span>{order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Diskon</span>
                      <span className="text-green-600">-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#FF6B9D]">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Informasi Pembayaran</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Metode Pembayaran</p>
                    <p className="font-medium">{order.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Status Pembayaran</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      order.paymentStatus === 'Paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.paymentStatus === 'Paid' ? 'Lunas' : 'Belum Dibayar'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Order Found */}
        {searched && !order && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Pesanan Tidak Ditemukan
              </h3>
              <p className="text-gray-600">
                Nomor pesanan yang Anda masukkan tidak ditemukan. Pastikan nomor pesanan sudah benar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

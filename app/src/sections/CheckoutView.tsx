import { useState } from 'react';
import { ArrowLeft, Check, CreditCard, Truck, Store, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { siteSettings } from '@/data/products';
import type { Cart, CustomerInfo, Order } from '@/types';

interface CheckoutViewProps {
  cart: Cart;
  onBack: () => void;
  onOrderComplete: (order: Order) => Promise<Order> | Order;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

export function CheckoutView({ cart, onBack, onOrderComplete }: CheckoutViewProps) {
  const [step, setStep] = useState<'customer' | 'delivery' | 'payment' | 'confirmation'>('customer');
  const [orderType, setOrderType] = useState<'Delivery' | 'Pickup'>('Delivery');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryNotes: ''
  });
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [selectedBank, setSelectedBank] = useState(siteSettings.bankAccounts[0]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.fullName || !customerInfo.phone) {
      toast.error('Nama dan nomor telepon wajib diisi');
      return;
    }
    setStep('delivery');
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderType === 'Delivery' && (!customerInfo.address || !deliveryDate)) {
      toast.error('Alamat dan tanggal pengiriman wajib diisi');
      return;
    }
    if (!deliveryDate) {
      toast.error('Tanggal pengambilan wajib diisi');
      return;
    }
    setStep('payment');
  };

  const handlePaymentSubmit = async () => {
    // Create order
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `TK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 900) + 100}`,
      customer: customerInfo,
      items: cart.items.map(item => ({
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
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
      paymentMethod: paymentMethod === 'transfer' ? 'Bank Transfer' : 'COD',
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

    const persistedOrder = await onOrderComplete(newOrder);
    setCreatedOrder(persistedOrder);
    setShowSuccessDialog(true);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(type);
    setTimeout(() => setCopiedAccount(null), 2000);
    toast.success('Nomor rekening disalin');
  };

  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + siteSettings.leadTime);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="animate-fadeIn min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF6B9D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Keranjang
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {['Data Pembeli', 'Pengiriman', 'Pembayaran'].map((label, idx) => {
              const steps = ['customer', 'delivery', 'payment'];
              const isActive = steps[idx] === step;
              const isCompleted = steps.indexOf(step) > idx;
              return (
                <div key={label} className="flex items-center">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    isActive ? 'bg-[#FF6B9D] text-white' :
                    isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : <span>{idx + 1}</span>}
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                  {idx < 2 && <div className="w-8 h-0.5 bg-gray-200 mx-2" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Customer Info */}
            {step === 'customer' && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">Data Pembeli</h2>
                  <form onSubmit={handleCustomerSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Nama Lengkap *</Label>
                      <Input
                        id="fullName"
                        value={customerInfo.fullName}
                        onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Nomor Telepon *</Label>
                        <Input
                          id="phone"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          placeholder="0812-3456-7890"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-[#FF6B9D] hover:bg-[#E85A8A]">
                      Lanjutkan
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Delivery */}
            {step === 'delivery' && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">Pengiriman</h2>
                  
                  {/* Order Type */}
                  <div className="mb-6">
                    <Label className="mb-3 block">Tipe Pesanan</Label>
                    <RadioGroup value={orderType} onValueChange={(v) => setOrderType(v as 'Delivery' | 'Pickup')} className="flex gap-4">
                      <div className={`flex items-center space-x-2 p-4 border-2 rounded-lg cursor-pointer ${
                        orderType === 'Delivery' ? 'border-[#FF6B9D] bg-[#FF6B9D]/5' : 'border-gray-200'
                      }`}>
                        <RadioGroupItem value="Delivery" id="delivery" />
                        <Label htmlFor="delivery" className="cursor-pointer flex items-center gap-2">
                          <Truck className="w-5 h-5" />
                          <div>
                            <p className="font-medium">Delivery</p>
                            <p className="text-sm text-gray-500">Dikirim ke alamat Anda</p>
                          </div>
                        </Label>
                      </div>
                      <div className={`flex items-center space-x-2 p-4 border-2 rounded-lg cursor-pointer ${
                        orderType === 'Pickup' ? 'border-[#FF6B9D] bg-[#FF6B9D]/5' : 'border-gray-200'
                      }`}>
                        <RadioGroupItem value="Pickup" id="pickup" />
                        <Label htmlFor="pickup" className="cursor-pointer flex items-center gap-2">
                          <Store className="w-5 h-5" />
                          <div>
                            <p className="font-medium">Pickup</p>
                            <p className="text-sm text-gray-500">Ambil di toko</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <form onSubmit={handleDeliverySubmit} className="space-y-4">
                    {orderType === 'Delivery' && (
                      <>
                        <div>
                          <Label htmlFor="address">Alamat Lengkap *</Label>
                          <textarea
                            id="address"
                            value={customerInfo.address}
                            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                            placeholder="Masukkan alamat lengkap"
                            className="w-full p-3 border rounded-lg focus:border-[#FF6B9D] focus:outline-none"
                            rows={3}
                            required={orderType === 'Delivery'}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">Kota *</Label>
                            <Input
                              id="city"
                              value={customerInfo.city}
                              onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                              placeholder="Jakarta"
                              required={orderType === 'Delivery'}
                            />
                          </div>
                          <div>
                            <Label htmlFor="postalCode">Kode Pos</Label>
                            <Input
                              id="postalCode"
                              value={customerInfo.postalCode}
                              onChange={(e) => setCustomerInfo({...customerInfo, postalCode: e.target.value})}
                              placeholder="12345"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deliveryDate">
                          {orderType === 'Delivery' ? 'Tanggal Pengiriman' : 'Tanggal Pickup'} *
                        </Label>
                        <Input
                          id="deliveryDate"
                          type="date"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          min={getMinDate()}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Minimal {siteSettings.leadTime} hari dari sekarang
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="deliveryTime">Waktu</Label>
                        <select
                          id="deliveryTime"
                          value={deliveryTime}
                          onChange={(e) => setDeliveryTime(e.target.value)}
                          className="w-full p-3 border rounded-lg focus:border-[#FF6B9D] focus:outline-none"
                        >
                          <option value="">Pilih waktu</option>
                          <option value="09:00-12:00">09:00 - 12:00</option>
                          <option value="12:00-15:00">12:00 - 15:00</option>
                          <option value="15:00-18:00">15:00 - 18:00</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Catatan</Label>
                      <textarea
                        id="notes"
                        value={customerInfo.deliveryNotes}
                        onChange={(e) => setCustomerInfo({...customerInfo, deliveryNotes: e.target.value})}
                        placeholder="Catatan tambahan (opsional)"
                        className="w-full p-3 border rounded-lg focus:border-[#FF6B9D] focus:outline-none"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep('customer')} className="flex-1">
                        Kembali
                      </Button>
                      <Button type="submit" className="flex-1 bg-[#FF6B9D] hover:bg-[#E85A8A]">
                        Lanjutkan
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {step === 'payment' && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">Pembayaran</h2>

                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className={`p-4 border-2 rounded-lg cursor-pointer ${
                      paymentMethod === 'transfer' ? 'border-[#FF6B9D] bg-[#FF6B9D]/5' : 'border-gray-200'
                    }`}>
                      <RadioGroupItem value="transfer" id="transfer" className="sr-only" />
                      <Label htmlFor="transfer" className="cursor-pointer flex items-start gap-3">
                        <CreditCard className="w-6 h-6 text-[#FF6B9D]" />
                        <div className="flex-1">
                          <p className="font-medium">Transfer Bank</p>
                          <p className="text-sm text-gray-500">Transfer ke rekening bank kami</p>
                          
                          {paymentMethod === 'transfer' && (
                            <div className="mt-4 space-y-3">
                              {siteSettings.bankAccounts.map((bank) => (
                                <div 
                                  key={bank.bankName}
                                  onClick={() => setSelectedBank(bank)}
                                  className={`p-3 border rounded-lg cursor-pointer ${
                                    selectedBank.bankName === bank.bankName ? 'border-[#FF6B9D] bg-white' : 'border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium">{bank.bankName}</p>
                                      <p className="text-lg font-mono">{bank.accountNumber}</p>
                                      <p className="text-sm text-gray-500">a.n. {bank.accountHolder}</p>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(bank.accountNumber, bank.bankName);
                                      }}
                                      className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                      {copiedAccount === bank.bankName ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <Copy className="w-5 h-5 text-gray-400" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Label>
                    </div>

                    <div className={`p-4 border-2 rounded-lg cursor-pointer ${
                      paymentMethod === 'cod' ? 'border-[#FF6B9D] bg-[#FF6B9D]/5' : 'border-gray-200'
                    }`}>
                      <RadioGroupItem value="cod" id="cod" className="sr-only" />
                      <Label htmlFor="cod" className="cursor-pointer flex items-start gap-3">
                        <Store className="w-6 h-6 text-[#FF6B9D]" />
                        <div>
                          <p className="font-medium">Bayar di Tempat (COD)</p>
                          <p className="text-sm text-gray-500">Bayar saat menerima pesanan</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="flex gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => setStep('delivery')} className="flex-1">
                      Kembali
                    </Button>
                    <Button 
                      onClick={handlePaymentSubmit}
                      className="flex-1 bg-[#FF6B9D] hover:bg-[#E85A8A]"
                    >
                      Buat Pesanan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Ringkasan Pesanan</h3>
                
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-gray-500">{item.variant.name} x{item.quantity}</p>
                        <p className="text-sm text-[#FF6B9D]">{formatPrice(item.variant.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ongkir</span>
                    <span>{cart.shipping === 0 ? 'Gratis' : formatPrice(cart.shipping)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#FF6B9D]">{formatPrice(cart.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              Pesanan Berhasil!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Terima kasih telah berbelanja di Toko Kue Bu Siti
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-500">Nomor Pesanan</p>
              <p className="text-xl font-bold text-[#FF6B9D]">{createdOrder?.orderNumber}</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              {paymentMethod === 'transfer' 
                ? 'Silakan lakukan pembayaran dan upload bukti transfer' 
                : 'Pesanan Anda akan segera kami proses'}
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowSuccessDialog(false);
                  onBack();
                }}
                className="flex-1"
              >
                Lanjutkan Belanja
              </Button>
              <Button 
                onClick={() => {
                  setShowSuccessDialog(false);
                  // Navigate to order tracking
                }}
                className="flex-1 bg-[#FF6B9D] hover:bg-[#E85A8A]"
              >
                Lacak Pesanan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

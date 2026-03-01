import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Cart, Product } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  onProductClick: (product: Product) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onProductClick
}: CartDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Keranjang Belanja
            {cart.itemCount > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({cart.itemCount} item)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Keranjang Kosong
            </h3>
            <p className="text-gray-500 mb-6">
              Yuk, tambahkan kue favoritmu ke keranjang!
            </p>
            <Button onClick={onClose} className="bg-[#FF6B9D] hover:bg-[#E85A8A]">
              Lihat Produk
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <div 
                      className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                      onClick={() => onProductClick(item.product)}
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="font-semibold text-gray-900 line-clamp-1 cursor-pointer hover:text-[#FF6B9D]"
                        onClick={() => onProductClick(item.product)}
                      >
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {item.variant.name} ({item.variant.size})
                      </p>
                      <p className="text-[#FF6B9D] font-semibold mt-1">
                        {formatPrice(item.variant.price)}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 mt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ongkir</span>
                  <span>{cart.shipping === 0 ? 'Gratis' : formatPrice(cart.shipping)}</span>
                </div>
                {cart.shipping === 0 && (
                  <p className="text-xs text-green-600">
                    Selamat! Anda mendapatkan gratis ongkir
                  </p>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-[#FF6B9D]">{formatPrice(cart.total)}</span>
                </div>
              </div>

              <Button
                onClick={onCheckout}
                className="w-full bg-[#FF6B9D] hover:bg-[#E85A8A] text-white py-6"
              >
                Lanjutkan ke Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full mt-2"
              >
                Lanjutkan Belanja
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

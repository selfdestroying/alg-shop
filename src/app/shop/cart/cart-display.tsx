'use client';

import { addOrUpdateProductInCart, removeFromCart } from '@/actions/cart';
import { StudentData } from '@/actions/students';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CartItem, Prisma } from '@prisma/client';
import {
  ArrowLeft,
  Coins,
  CreditCard,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTransition } from 'react';

type CartWithItems = Prisma.CartGetPayload<{
  include: { items: { include: { product: { include: { category: true } } } } };
}>;

export default function CartDisplay({ cart, student }: { cart: CartWithItems, student: StudentData }) {
  const [isPending, startTransition] = useTransition();

  const formatPrice = (price: number) => {
    return (
      <div className="flex items-center space-x-1">
        <Coins size={16} color="rgb(131, 58, 224)" />
        <span>{price}</span>
      </div>
    );
  };

  const handleUpdateQuantity = (item: CartItem, quantity: number) => {
    startTransition(() => {
      addOrUpdateProductInCart({
        cartId: item.cartId,
        productId: item.productId,
        quantity,
      });
    });
  };

  const handleRemoveFromCart = (id: number) => {
    const ok = removeFromCart(id);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart size={128} className="mb-8" />
            <h1 className="text-3xl font-bold mb-4">Корзина пуста</h1>

            <Link href="/">
              <Button size="lg" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Продолжить покупки
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-8 space-y-8">
        {/* Mobile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Корзина</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="gap-2 bg-transparent w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Продолжить покупки
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <ShoppingBag className="w-5 h-5" />
                  Товары в корзине
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.items.map((item, index) => (
                  <div className="flex flex-col sm:flex-row gap-4" key={index}>
                    <div className="relative w-full h-32 sm:w-20 sm:h-20 flex-shrink-0">
                      <Image
                        src={`/uploads/${item.product.image || 'placeholder.svg'}`}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-3 sm:space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-base sm:text-lg line-clamp-2">
                            {item.product.name}
                          </h3>
                          <Badge variant="secondary" className="text-xs w-fit">
                            {item.product.category.name}
                          </Badge>
                        </div>
                        <div className="text-left sm:text-right flex flex-col items-end">
                          <div className="font-bold text-lg">
                            {formatPrice(item.product.price)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-sm font-medium flex gap-2">
                              Подсумма:{' '}
                              {formatPrice(item.product.price * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Label
                            htmlFor={`quantity-${item.id}`}
                            className="text-sm font-medium whitespace-nowrap"
                          >
                            Количество:
                          </Label>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8 bg-transparent"
                              onClick={() =>
                                handleUpdateQuantity(item, item.quantity - 1)
                              }
                              disabled={isPending || item.quantity == 1}
                            >
                              {isPending ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <Minus className="w-3 h-3" />
                              )}
                            </Button>
                            <Input
                              id={`quantity-${item.id}`}
                              type="number"
                              min={1}
                              value={item.quantity}
                              className="w-16 text-center"
                              readOnly
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8 bg-transparent"
                              onClick={() =>
                                handleUpdateQuantity(item, item.quantity + 1)
                              }
                              disabled={isPending}
                            >
                              {isPending ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <Plus className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {index < cart.items.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Desktop Order Summary */}
          <div className="hidden lg:block space-y-6">
            <div className="space-y-4 border rounded-xl shadow-sm p-8">
              <div className="flex justify-between text-lg font-bold">
                <span>Итого:</span>
                <span>
                  {formatPrice(
                    cart.items.reduce(
                      (prev, item) => prev + item.product.price * item.quantity,
                      0,
                    ),
                  )}
                </span>
              </div>
            </div>

            <Button size="lg" className="w-full gap-2">
              <CreditCard className="w-4 h-4" />
              Заказать
            </Button>
          </div>
        </div>

        {/* Mobile Sticky Footer */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-10 mb-0">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="text-left">
              <div className="text-sm text-muted-foreground">Итого:</div>
              <div className="font-bold text-lg">
                {formatPrice(
                  cart.items.reduce(
                    (prev, item) => prev + item.product.price * item.quantity,
                    0,
                  ),
                )}
              </div>
            </div>
            <Button size="lg" className="gap-2 flex-1 max-w-xs">
              <CreditCard className="w-4 h-4" />
              Заказать
            </Button>
          </div>
        </div>

        {/* Add bottom padding to prevent content from being hidden behind sticky footer */}
        <div className="lg:hidden h-20" />
      </div>
    </div>
  );
}

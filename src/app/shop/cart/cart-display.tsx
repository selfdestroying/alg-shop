'use client';

import { addOrUpdateProductInCart, removeFromCart } from '@/actions/cart';
import { createOrder } from '@/actions/orders';
import { StudentData } from '@/actions/students';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem, Prisma } from '@prisma/client';
import {
  ArrowLeft,
  Coins,
  CreditCard,
  Loader2,
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

export default function CartDisplay({
  cart,
  student,
}: {
  cart: CartWithItems;
  student: StudentData;
}) {
  const [isPending, startTransition] = useTransition();

  const formatPrice = (price: number) => {
    return (
      <div className="flex items-center space-x-1">
        <Coins size={16} color="rgb(131, 58, 224)" />
        <span>{price}</span>
      </div>
    );
  };

  const handleUpdateQuantity = (
    item: CartItem,
    quantity: number,
    operation: 'increment' | 'decrement',
  ) => {
    startTransition(() => {
      addOrUpdateProductInCart(
        {
          cartId: item.cartId,
          productId: item.productId,
          quantity,
        },
        operation,
      );
    });
  };

  const handleRemoveFromCart = (id: number) => {
    const ok = removeFromCart(id);
  };

  const handleCreateOrder = () => {
    const totalPrice = cart.items.reduce(
      (prev, item) => prev + item.product.price,
      0,
    );
    const ok = createOrder(
      cart.items.map((item) => ({
        productId: item.productId,
        studentId: student.id,
      })),
      totalPrice,
    );
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
              <CardContent className="space-y-2">
                {cart.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-[max-content_1fr] gap-2"
                  >
                    <Image
                      src={item.product.image || 'placeholder.svg'}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="object-cover rounded-lg"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg line-clamp-2">
                          {item.product.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs w-fit">
                          {item.product.category.name}
                        </Badge>
                      </div>
                      <div className="text-left sm:text-right flex justify-between sm:grid sm:grid-cols-1">
                        <div className="font-bold text-lg flex items-center justify-between sm:justify-end">
                          {formatPrice(item.product.price)}
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

            <Button
              size="lg"
              className="w-full gap-2"
              disabled={
                cart.items.reduce(
                  (prev, item) => prev + item.product.price * item.quantity,
                  0,
                ) > student.coins || isPending
              }
              onClick={() => startTransition(handleCreateOrder)}
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Заказать
                </>
              )}
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
            <Button
              size="lg"
              className="gap-2 flex-1 max-w-xs"
              disabled={
                cart.items.reduce(
                  (prev, item) => prev + item.product.price * item.quantity,
                  0,
                ) > student.coins || isPending
              }
              onClick={() => startTransition(handleCreateOrder)}
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Заказать
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Add bottom padding to prevent content from being hidden behind sticky footer */}
        <div className="lg:hidden h-20" />
      </div>
    </div>
  );
}

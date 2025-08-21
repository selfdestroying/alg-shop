'use client';

import { addOrUpdateProductInCart } from '@/actions/cart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { Category, Prisma, Product } from '@prisma/client';
import { Coins, Grid3X3, List, Search, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type ProductWithCategory = Product & { category: Category };
type CartWithItems = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export default function ProductsTable({
  cart,
  products,
  categories,
}: {
  cart: CartWithItems;
  products: ProductWithCategory[];
  categories: Category[];
}) {
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getFilteredProducts = () => {
    let filtered = products;
    // Category filter
    if (selectedCategory !== -1) {
      filtered = filtered.filter(
        (product) => product.category.id === selectedCategory,
      );
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  };

  const handleAddToCart = (productId: number) => {
    addOrUpdateProductInCart({
      cartId: cart!.id,
      productId: productId,
      quantity: 1,
    });
  };

  const filteredProducts = getFilteredProducts();

  const ProductCard = ({ product }: { product: ProductWithCategory }) => (
    <Card className="group py-0 transition-shadow duration-200">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={`/uploads/${product.image || 'placeholder.svg'}`}
            alt={product.name}
            width={300}
            height={200}
            className="h-48 w-full object-cover transition-transform duration-200"
          />
          {product.popular && (
            <Badge className="bg-primary absolute top-2 left-2">Popular</Badge>
          )}
          {product.originalPrice && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Sale
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 line-clamp-2 text-lg">
          {product.name}
        </CardTitle>
        <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
          {product.description}
        </p>

        <div className="mb-3 flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs">
            {product.category.name}
          </Badge>
        </div>

        <div className="mb-3 flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-current text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-muted-foreground text-sm">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xl font-bold flex items-center space-x-1">
            <Coins size={16} color="rgb(131, 58, 224)" />
            <span>{product.price}</span>
          </div>
          {product.originalPrice && (
            <div className="text-muted-foreground text-sm line-through flex items-center space-x-1">
              <Coins size={12} />
              <span>{product.originalPrice}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          size="sm"
          onClick={() => handleAddToCart(product.id)}
          disabled={Boolean(
            cart?.items.find((item) => item.productId == product.id),
          )}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );

  const ProductListItem = ({ product }: { product: ProductWithCategory }) => (
    <Card className="transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative h-24 w-24 flex-shrink-0">
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              width={96}
              height={96}
              className="h-full w-full rounded object-cover"
            />
            {product.popular && (
              <Badge className="bg-primary absolute -top-1 -right-1 text-xs">
                Popular
              </Badge>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="line-clamp-1 text-lg font-semibold">
                {product.name}
              </h3>
              <div className="ml-4 flex items-center gap-2">
                <div className="text-xl font-bold flex items-center space-x-1">
                  <Coins size={16} color="rgb(131, 58, 224)" />
                  <span>{product.price}</span>
                </div>
                {product.originalPrice && (
                  <div className="text-muted-foreground text-sm line-through flex items-center space-x-1">
                    <Coins size={12} />
                    <span>{product.originalPrice}</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">
                  {product.category.name}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span className="text-sm">{product.rating}</span>
                </div>
                <Button size="sm">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Category Tabs */}
      <Tabs
        value={selectedCategory.toString()}
        onValueChange={(value) => setSelectedCategory(+value)}
        className="mb-8"
      >
        <TabsList className="grid h-auto w-full grid-cols-3 p-1 lg:grid-cols-6">
          {categories.map((category) => {
            return (
              <TabsTrigger
                key={category.id}
                value={category.id.toString()}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex flex-col items-center gap-1 px-2 py-3"
              >
                <span className="text-xs font-medium">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Search and Controls */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex w-full items-center gap-4 sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-muted-foreground text-sm whitespace-nowrap">
            {filteredProducts.length} products
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center rounded-md border">
            <Toggle
              pressed={viewMode === 'grid'}
              onPressedChange={() => setViewMode('grid')}
              size="sm"
            >
              <Grid3X3 className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={viewMode === 'list'}
              onPressedChange={() => setViewMode('list')}
              size="sm"
            >
              <List className="h-4 w-4" />
            </Toggle>
          </div>

          {/* Sort Select */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Display */}
      <div className="w-full">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-4xl">🔍</div>
          <h3 className="mb-2 text-xl font-semibold">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Try searching for something else or browse all categories
          </p>
          <Button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(-1);
            }}
            variant="outline"
          >
            Show All Products
          </Button>
        </div>
      )}
    </>
  );
}

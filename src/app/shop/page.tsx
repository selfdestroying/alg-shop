import { getCart } from '@/actions/cart';
import { getCategories } from '@/actions/categories';
import { getProducts } from '@/actions/products';
import ProductsTable from './products-table';

export default async function Page() {
  const cart = await getCart();
  const products = await getProducts();
  const categories = await getCategories();
  return (
    <ProductsTable
      cart={cart!}
      products={products}
      categories={[{ id: -1, name: 'Все' }, ...categories]}
    />
  );
}

import { getCart } from '@/actions/cart';
import { getStudent } from '@/actions/students';
import CartDisplay from './cart-display';

export default async function Page() {
  const cart = await getCart();
  const student = await getStudent();

  return <CartDisplay cart={cart!} student={student!} />;
}

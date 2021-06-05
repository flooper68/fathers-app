import { getOrders } from './order-resolvers'
import { getProducts } from './product-resolvers'
import { getGreenCoffees } from './green-coffee-resolvers'
import { getRoastedCoffees } from './roasted-coffee-resolvers'
import { getRoastings } from './roasting-resolvers'

export const appResolvers = {
  greenCoffees: getGreenCoffees,
  roastedCoffees: getRoastedCoffees,
  products: getProducts,
  orders: getOrders,
  roastings: getRoastings,
}

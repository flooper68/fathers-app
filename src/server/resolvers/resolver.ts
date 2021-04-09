import { CategoryModel } from '../models/category'
import { OrderModel } from '../models/order'
import { ProductModel } from '../models/product.'

export const appResolvers = {
  products: async () => {
    const products = await ProductModel.find()
    return products.map((item) => ({ id: item.id, name: item.name }))
  },
  categories: async () => {
    const entity = await CategoryModel.find()
    return entity.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
    }))
  },
  orders: async () => {
    const entity = await OrderModel.find()
    return entity.map((item) => ({
      id: item.id,
      number: item.number,
      status: item.status,
    }))
  },
}

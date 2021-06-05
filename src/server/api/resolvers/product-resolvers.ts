import { ProductDocument, ProductModel } from '../../models/product.'
import { getRoastedCoffee } from './roasted-coffee-resolvers'

const mapProduct = (item: ProductDocument) => ({
  id: item.id,
  name: item.name,
  dateModified: item.dateModified,
  description: item.description,
  shortDescription: item.shortDescription,
  categories: item.categories.map((category) => ({
    id: category.id,
    name: category.name,
  })),
  images: item.images.map((image) => ({
    id: image.id,
    name: image.name,
    src: image.src,
  })),
  variations: item.variations,
  roastedCoffeeId: item.roastedCoffeeId,
  roastedCoffee: () => getRoastedCoffee(item.roastedCoffeeId),
})

export const getProduct = async (productId: number) => {
  const item = await ProductModel.findOne({ id: productId })
  return mapProduct(item)
}

export const getProducts = async () => {
  const products = await ProductModel.find()
  return products.map(mapProduct)
}

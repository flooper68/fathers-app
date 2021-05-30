import { OrderModel } from '../../models/order'
import { ProductModel } from '../../models/product.'

export const appResolvers = {
  products: async () => {
    const products = await ProductModel.find()
    return products.map((item) => ({
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
      roastedCoffeeCategoryId: item.roastedCoffeeCategoryId,
    }))
  },
  orders: async () => {
    const entities = await OrderModel.find()
    return entities.map((item) => {
      return {
        id: item.id,
        number: item.number,
        status: item.status,
        dateCreated: item.dateCreated,
        dateModified: item.dateModified,
        roastingId: item.roastingId,
        roasted: item.roasted,
        lineItems: item.lineItems.map((lineItem) => {
          return {
            id: lineItem.id,
            name: lineItem.name,
            productName: lineItem.productName,
            productId: lineItem.productId,
            variationId: lineItem.variationId,
            quantity: lineItem.quantity,
            product: () => ProductModel.findOne({ id: lineItem.productId }),
          }
        }),
      }
    })
  },
}

import { Logger } from '../../../shared/logger'
import {
  WooCommerceProductResponse,
  Product,
} from '../../../shared/types/product'
import { RoastedCoffeeProductMap } from '../../domain/roasting-settings'
import { ProductModel } from '../../models/product.'
import { reducePromisesInSequence } from '../../promise-utils'
import { WooCommerceClient } from '../woocommerce'

const fetchVariationsAndMapProducts = async (
  item: WooCommerceProductResponse,
  client: WooCommerceClient,
  products: Product[]
) => {
  Logger.info(`Fetching product variations for product ${item.name}`)
  const variations = await client.getAllProductVariations(item.id)

  Logger.info(`Received ${variations.totalCount} product variations`)

  const roastedCoffeeId = RoastedCoffeeProductMap[item.id]

  if (!roastedCoffeeId) {
    Logger.info(`Product ${item.name} is not setup for roasting.`)
  }

  products.push({
    id: item.id,
    name: item.name,
    dateModified: item.date_modified,
    description: item.description,
    shortDescription: item.short_description,
    roastedCoffeeId,
    images: item.images,
    categories: item.categories.map((category) => {
      return { id: category.id, name: category.name }
    }),
    variations: variations.rows.map((variation) => {
      return {
        id: variation.id,
        weight: isNaN(parseFloat(variation.weight))
          ? null
          : parseFloat(variation.weight),
      }
    }),
  })

  return products
}

const syncProduct = async (product: Product) => {
  const dbEntity = await ProductModel.findOne({
    id: product.id,
  }).exec()

  if (dbEntity) {
    Logger.info(`Product ${product.id} exists, updating`)
    await dbEntity.update({ product })
  } else {
    Logger.info(`Product ${product.id} does not exist, creating new entry`)
    const dbEntity = new ProductModel(product)
    await dbEntity.save()
  }
}

export const buildSyncProducts = (client: WooCommerceClient) => async () => {
  const start = Date.now()
  Logger.info('Syncing products')
  const result = await client.getAllProducts()

  Logger.info(`Fetched ${result.totalCount} products`)

  const products = await reducePromisesInSequence(
    result.rows,
    (item: WooCommerceProductResponse, productsMemo: Product[]) =>
      fetchVariationsAndMapProducts(item, client, productsMemo)
  )

  Logger.debug('Finished downloading data')

  await Promise.all(products.map(syncProduct))

  const stop = Date.now()
  Logger.info(`Syncing products finished, took ${stop - start} ms`)
}

import { findOneRoastedCoffeeProduct } from '../../roasting/repositories/roasted-coffee-product-repository';
import { Logger } from '../../../shared/logger';
import {
  WooCommerceProductResponse,
  Product,
} from '../../../shared/types/product';
import { ProductModel } from '../../catalog/repository/product-model';
import { reducePromisesInSequence } from '../promise-utils';
import { WooCommerceClient } from '../woocommerce-client';

export const fetchVariationsAndMapProducts = async (
  item: WooCommerceProductResponse,
  client: WooCommerceClient,
  products: Product[]
) => {
  Logger.info(`Fetching product variations for product ${item.name}`);
  const variations = await client.getAllProductVariations(item.id);

  Logger.info(`Received ${variations.totalCount} product variations`);

  const roastedCoffeeProduct = await findOneRoastedCoffeeProduct({
    where: { productId: item.id },
  });

  if (!roastedCoffeeProduct) {
    Logger.info(`Product ${item.name} is not setup for roasting.`);
  }

  products.push({
    id: item.id,
    name: item.name,
    dateModified: item.date_modified,
    description: item.description,
    shortDescription: item.short_description,
    roastedCoffeeId: roastedCoffeeProduct.roastedCoffeeId,
    images: item.images,
    categories: item.categories.map((category) => {
      return { id: category.id, name: category.name };
    }),
    variations: variations.rows.map((variation) => {
      return {
        id: variation.id,
        weight: isNaN(parseFloat(variation.weight))
          ? undefined
          : parseFloat(variation.weight),
      };
    }),
  });

  return products;
};

export const syncProduct = async (product: Product) => {
  const dbEntity = await ProductModel.findOne({
    id: product.id,
  }).exec();

  if (dbEntity) {
    Logger.info(`Product ${product.id} exists, updating`);
    await dbEntity.update({ product });
  } else {
    Logger.info(`Product ${product.id} does not exist, creating new entry`);
    const dbEntity = new ProductModel(product);
    await dbEntity.save();
  }
};

export const buildSyncProducts = (
  client: WooCommerceClient,
  updateSyncState: (state: {
    productSyncInProgress: boolean;
    productSyncError?: boolean;
    productSyncErrorMessage?: string;
  }) => void
) => async () => {
  const start = Date.now();
  updateSyncState({ productSyncInProgress: true });
  Logger.info('Syncing products');

  try {
    const result = await client.getAllProducts();

    Logger.info(`Fetched ${result.totalCount} products`);

    const products = await reducePromisesInSequence(
      result.rows,
      (item: WooCommerceProductResponse, productsMemo: Product[]) =>
        fetchVariationsAndMapProducts(item, client, productsMemo)
    );

    Logger.debug('Finished downloading data');

    await Promise.all(products.map(syncProduct));
  } catch (e) {
    updateSyncState({
      productSyncInProgress: false,
      productSyncError: true,
      productSyncErrorMessage: e?.message,
    });
    Logger.error(`Error syncing products`, e);
  }

  const stop = Date.now();
  Logger.info(`Syncing products finished, took ${stop - start} ms`);
  updateSyncState({ productSyncInProgress: false });
};

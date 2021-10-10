import { ProductDocument, ProductModel } from './repository/product-model';

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
});

const getProduct = async (productId: number) => {
  const item = await ProductModel.findOne({ id: productId });
  if (!item) {
    return;
  }
  return mapProduct(item);
};

const getProducts = async () => {
  const products = await ProductModel.find().sort({ id: -1 });
  return products.map(mapProduct);
};

export const buildCatalogModule = () => {
  return { getProduct, getProducts };
};

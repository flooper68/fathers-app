import { CatalogModule } from '../../modules/catalog/catalog-contracts';
import { GraphQLRootMutationAssignProductToRoastedCoffeeArgs } from './../../../shared/graphql-types.d';
import { Logger } from '../../../shared/logger';
import { RoastingModule } from '../../modules/roasting/roasting-contracts';

export const buildProductResolvers = (context: {
  roastingModule: RoastingModule;
  catalogModule: CatalogModule;
}) => {
  return {
    getProducts: async () => {
      try {
        const products = await context.catalogModule.getProducts();

        return products.map(async (product) => {
          return {
            ...product,
            roastedCoffeeId: async () => {
              const roastingProduct = await context.roastingModule.getRoastingProduct(
                { id: product.id }
              );
              return roastingProduct?.roastedCoffeeId;
            },
            roastedCoffeeName: async () => {
              const roastingProduct = await context.roastingModule.getRoastingProduct(
                { id: product.id }
              );
              if (!roastingProduct || !roastingProduct.roastedCoffeeId) {
                return;
              }

              const roastedCoffee = await context.roastingModule.getRoastedCoffee(
                { id: roastingProduct?.roastedCoffeeId }
              );
              return roastedCoffee?.name;
            },
          };
        });
      } catch (e) {
        Logger.error(`Error while executing resolver`, e);
        throw e;
      }
    },
    assignProductToRoastedCoffee: async (
      props: GraphQLRootMutationAssignProductToRoastedCoffeeArgs
    ) => {
      try {
        await context.roastingModule.assignProductToRoastedCoffee(props);
        return {
          success: true,
        };
      } catch (e) {
        Logger.error(`Error while executing resolver`, e);
        return {
          success: false,
        };
      }
    },
  };
};

import { RoastingModule } from './../../modules/roasting/roasting-contracts';
import {
  GraphQLRootMutationCreateRoastedCoffeeArgs,
  GraphQLRootMutationUpdateRoastedCoffeeArgs,
} from './../../../shared/graphql-types.d';
import { Logger } from '../../../shared/logger';

export const buildRoastedCoffeeResolvers = (context: {
  roastingModule: RoastingModule;
}) => {
  return {
    getRoastedCoffees: async () => {
      const rows = await context.roastingModule.getAllRoastedCoffees();

      return rows.map((coffee) => {
        return {
          ...coffee,
          greenCoffeeName: async () => {
            const entity = await context.roastingModule.getGreenCoffee({
              id: coffee.greenCoffeeId,
            });
            return entity?.name;
          },
        };
      });
    },
    create: async (props: GraphQLRootMutationCreateRoastedCoffeeArgs) => {
      try {
        await context.roastingModule.createRoastedCoffee(props);
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
    update: async (props: GraphQLRootMutationUpdateRoastedCoffeeArgs) => {
      try {
        await context.roastingModule.updateRoastedCoffee(props);
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

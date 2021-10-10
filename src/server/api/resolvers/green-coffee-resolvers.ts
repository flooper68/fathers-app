import {
  GraphQLRootMutationCreateGreenCoffeeArgs,
  GraphQLRootMutationUpdateGreenCoffeeArgs,
} from './../../../shared/graphql-types.d';
import { Logger } from '../../../shared/logger';
import { RoastingModule } from '../../modules/roasting/roasting-contracts';

export const buildGreenCoffeeResolvers = (context: {
  roastingModule: RoastingModule;
}) => {
  return {
    getAllGreenCoffees: async () => {
      const rows = await context.roastingModule.getAllGreenCoffees();
      return rows.map((coffee) => {
        return {
          ...coffee,
        };
      });
    },
    create: async (props: GraphQLRootMutationCreateGreenCoffeeArgs) => {
      try {
        await context.roastingModule.createGreenCoffee(props);
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
    update: async (props: GraphQLRootMutationUpdateGreenCoffeeArgs) => {
      try {
        await context.roastingModule.updateGreenCoffee(props);
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

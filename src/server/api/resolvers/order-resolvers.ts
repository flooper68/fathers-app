import { DataLoaders } from './../data-loaders/data-loaders';
import { SalesModule } from '../../modules/sales/sales-contracts';
import { RoastingModule } from '../../modules/roasting/roasting-contracts';
import { Logger } from '../../../shared/logger';

export const buildOrderResolvers = (context: {
  roastingModule: RoastingModule;
  salesModule: SalesModule;
  dataLoaders: DataLoaders;
}) => {
  return {
    getOrders: async (params: { page: number }) => {
      try {
        const orders = await context.salesModule.getOrders(params);
        return {
          page: orders.page,
          pageCount: orders.pageCount,
          rows: orders.rows.map(context.dataLoaders.resolveOrder),
        };
      } catch (e) {
        Logger.error(`Error while executing resolver`, e);
        throw e;
      }
    },
  };
};

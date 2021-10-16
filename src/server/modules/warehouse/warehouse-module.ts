import PromiseQueue from 'promise-queue';

import { getRoastedCoffeeHistoryUseCase } from './use-cases/get-roasted-coffee-history';
import { useRoastingLeftoversUseCase } from './use-cases/use-roasted-coffee-leftovers';
import { addRoastingLeftoversUseCase } from './use-cases/add-roasting-leftovers';
import { WarehouseModule, WarehouseContext } from './warehouse-contracts';
import { adjustRoastedCoffeeLeftoversUseCase } from './use-cases/adjust-roasted-coffee-leftovers';
import { roastingFinishedSubscriber } from './subscribers/roasting-finished-subscriber';
import { Logger } from '../../../shared/logger';

export const buildWarehouseModule = (
  context: WarehouseContext
): WarehouseModule => {
  //Due to nature of mongo, we need single writer pattern to keep ordering
  const processingQueue = new PromiseQueue(1, Infinity);

  const processUseCase = async <Result>(
    useCase: () => Promise<Result>
  ): Promise<Result> => {
    Logger.debug(`Queuing warehouse usecase for processing`);
    const start = Date.now();
    const result = await processingQueue.add(() => useCase());
    Logger.debug(
      `Use case handling finished, it took ${Date.now() - start} ms`
    );
    return result;
  };

  const warehouseModule: WarehouseModule = {
    addRoastingLeftovers: (props) =>
      processUseCase(() => addRoastingLeftoversUseCase(props, context)),
    useRoastedCoffeeLeftovers: (props) =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      processUseCase(() => useRoastingLeftoversUseCase(props, context)),
    adjustRoastedCoffeeLeftovers: (props) =>
      processUseCase(() => adjustRoastedCoffeeLeftoversUseCase(props, context)),
    getRoastedCoffeeHistory: (props) =>
      processUseCase(() => getRoastedCoffeeHistoryUseCase(props, context)),
  };

  roastingFinishedSubscriber({ ...context, warehouseModule });

  return warehouseModule;
};

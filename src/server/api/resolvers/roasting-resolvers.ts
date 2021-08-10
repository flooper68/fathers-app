import { findGreenCoffee } from '../../roasting/repositories/green-coffee-repository';
import { reportRealYieldUseCase } from '../../roasting/use-cases/report-real-yield';
import { selectOrdersRoastingUseCase } from '../../roasting/use-cases/select-orders-roasting';
import { startRoastingUseCase } from '../../roasting/use-cases/start-roasting';
import { buildRoastingRepository } from '../../roasting/repositories/roasting-repository';
import { Logger } from '../../../shared/logger';
import { createRoastingUseCase } from '../../roasting/use-cases/create-roasting';
import { finishRoastingUseCase } from '../../roasting/use-cases/finish-roasting';
import { getRoastingsProjection } from '../../roasting/projections/roasting-projection';
import { finishBatchUseCase } from '../../roasting/use-cases/finish-batch';

export const buildRoastingResolvers = () => {
  const repository = buildRoastingRepository();

  const createRoastingResolver = async (args: { date: string }) => {
    try {
      await createRoastingUseCase(args.date, repository);
      return {
        success: true,
      };
    } catch (e) {
      Logger.error(`Error handling createRoasting mutation`, e);
      return {
        success: false,
      };
    }
  };

  const selectOrdersRoastingResolver = async (args: {
    orderId: number;
    roastingId: string;
  }) => {
    try {
      await selectOrdersRoastingUseCase(
        args.roastingId,
        args.orderId,
        repository
      );
      return {
        success: true,
      };
    } catch (e) {
      Logger.error(`Error handling addOrderToRoasting mutation`, e);
      return {
        success: false,
      };
    }
  };

  const startRoastingResolver = async () => {
    try {
      await startRoastingUseCase(repository, findGreenCoffee);
      return {
        success: true,
      };
    } catch (e) {
      Logger.error(`Error handling startRoasting mutation`, e);
      return {
        success: false,
      };
    }
  };

  const finishBatchResolver = async (args: { roastedCoffeeId: number }) => {
    try {
      await finishBatchUseCase(args.roastedCoffeeId, repository);
      return {
        success: true,
      };
    } catch (e) {
      Logger.error(`Error handling finishBatch mutation`, e);
      return {
        success: false,
      };
    }
  };

  const reportRealYieldResolver = async (args: {
    roastedCoffeeId: number;
    weight: number;
  }) => {
    try {
      await reportRealYieldUseCase(
        args.roastedCoffeeId,
        args.weight,
        repository
      );
      return {
        success: true,
      };
    } catch (e) {
      Logger.error(`Error handling finishBatch mutation`, e);
      return {
        success: false,
      };
    }
  };

  const finishRoastingResolver = async () => {
    try {
      await finishRoastingUseCase(repository);
      return {
        success: true,
      };
    } catch (e) {
      Logger.error(`Error handling finishRoasting mutation`, e);
      return {
        success: false,
      };
    }
  };

  return {
    createRoastingResolver,
    selectOrdersRoastingResolver,
    startRoastingResolver,
    finishBatchResolver,
    finishRoastingResolver,
    reportRealYieldResolver,
    getRoastingsResolver: getRoastingsProjection(repository),
  };
};

import { RoastingStatus } from '../../../shared/types/roasting';
import { finishRoastedBatch } from '../entities/roasting';
import { RoastingRepository } from '../interfaces/roasting-repository';

export const finishBatchUseCase = async (
  roastedCoffeeId: number,
  repository: RoastingRepository
) => {
  // Active roasting must exist
  // There is only one active roasting at a time
  // RoastedCoffee must exist
  // RoastedCoffee need to be ordered/planned ??
  // Can not finish more batches than is planned ??

  const query = await repository.find({
    where: {
      status: RoastingStatus.IN_PROGRESS,
    },
  });

  if (query.length === 0) {
    throw new Error(`There is no active roasting in progress`);
  }

  if (query.length > 1) {
    throw new Error(`There is more than one active roasting in progress`);
  }

  const activeRoasting = query[0];

  const updatedRoasting = finishRoastedBatch(activeRoasting, roastedCoffeeId);
  await repository.save(updatedRoasting);
};

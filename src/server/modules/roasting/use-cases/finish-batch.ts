import { FinishBatchProps, RoastingRepository } from './../roasting-contracts';
import { finishRoastedBatch } from '../entities/roasting-entity';

export const finishBatchUseCase = async (
  props: FinishBatchProps,
  context: { roastingRepository: RoastingRepository }
) => {
  // Active roasting must exist
  // There is only one active roasting at a time
  // RoastedCoffee must exist
  // RoastedCoffee need to be ordered/planned ??
  // Can not finish more batches than is planned ??

  const query = await context.roastingRepository.getRoastingsInProgress();

  if (query.length === 0) {
    throw new Error(`There is no active roasting in progress`);
  }

  if (query.length > 1) {
    throw new Error(`There is more than one active roasting in progress`);
  }

  const activeRoasting = query[0];

  const updatedRoasting = finishRoastedBatch(
    activeRoasting,
    props.roastedCoffeeId
  );
  await context.roastingRepository.save(updatedRoasting);
};

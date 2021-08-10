import { RoastingStatus } from '../../../shared/types/roasting';
import { reportRealYield } from '../entities/roasting';
import { RoastingRepository } from '../interfaces/roasting-repository';

export const reportRealYieldUseCase = async (
  roastedCoffeeId: number,
  weight: number,
  repository: RoastingRepository
) => {
  // There must be active roasting
  // There can be just a single active roasting at a time
  // What if real yield is lower than needed??

  const roastingsInProgress = await repository.find({
    where: { status: RoastingStatus.IN_PROGRESS },
  });

  if (roastingsInProgress.length > 1) {
    throw new Error('There is more than one roasting in progress');
  }

  if (roastingsInProgress.length === 0) {
    throw new Error('There is no roasting to update');
  }

  const roastingInProgress = roastingsInProgress[0];
  const updatedRoasting = reportRealYield(
    roastingInProgress,
    roastedCoffeeId,
    weight
  );
  await repository.save(updatedRoasting);
};

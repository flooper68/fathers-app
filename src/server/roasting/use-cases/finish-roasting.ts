import { RoastingRepository } from '../interfaces/roasting-repository';
import { RoastingStatus } from '../../../shared/types/roasting';
import { getFinishedRoasting } from '../entities/roasting';

export const finishRoastingUseCase = async (repository: RoastingRepository) => {
  // There must be active roasting
  // There can be just a single active roasting at a time
  // All batches must be finished and all real yields reported ??

  const roastingsInProgress = await repository.find({
    where: { status: RoastingStatus.IN_PROGRESS },
  });

  if (roastingsInProgress.length > 1) {
    throw new Error('There is more than one roasting in progress');
  }

  if (roastingsInProgress.length === 0) {
    throw new Error('There is no roasting to finish');
  }

  const roastingInProgress = roastingsInProgress[0];
  const updatedRoasting = getFinishedRoasting(roastingInProgress);
  await repository.save(updatedRoasting);
};

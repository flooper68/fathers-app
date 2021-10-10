import { reportRealYield } from '../entities/roasting-entity';
import {
  ReportRealYieldProps,
  RoastingRepository,
} from '../roasting-contracts';

export const reportRealYieldUseCase = async (
  props: ReportRealYieldProps,
  context: { roastingRepository: RoastingRepository }
) => {
  // There must be active roasting
  // There can be just a single active roasting at a time
  // What if real yield is lower than needed??

  const roastingsInProgress = await context.roastingRepository.getRoastingsInProgress();

  if (roastingsInProgress.length > 1) {
    throw new Error('There is more than one roasting in progress');
  }

  if (roastingsInProgress.length === 0) {
    throw new Error('There is no roasting to update');
  }

  const roastingInProgress = roastingsInProgress[0];
  const updatedRoasting = reportRealYield(
    roastingInProgress,
    props.roastedCoffeeId,
    props.weight
  );
  await context.roastingRepository.save(updatedRoasting);
};

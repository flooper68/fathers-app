import {
  RoastingContext,
  ROASTING_MESSAGE_STREAM,
} from './../roasting-contracts';
import { finishRoasting } from '../entities/roasting-entity';

export const finishRoastingUseCase = async (context: RoastingContext) => {
  // There must be active roasting
  // There can be just a single active roasting at a time
  // All batches must be finished and all real yields reported ??

  const roastingsInProgress = await context.roastingRepository.getRoastingsInProgress();

  if (roastingsInProgress.length > 1) {
    throw new Error('There is more than one roasting in progress');
  }

  if (roastingsInProgress.length === 0) {
    throw new Error('There is no roasting to finish');
  }

  const roastingInProgress = roastingsInProgress[0];
  const updatedRoasting = finishRoasting(roastingInProgress);
  await context.roastingRepository.save(updatedRoasting.roasting);
  await Promise.all(
    updatedRoasting.events.map((item) => {
      return context.messageBroker.publishMessage(
        ROASTING_MESSAGE_STREAM,
        item
      );
    })
  );
};

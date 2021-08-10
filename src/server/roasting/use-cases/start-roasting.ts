import moment from 'moment';

import { FindGreenCoffee } from '../interfaces/roasting-repository';
import { getStartedRoasting } from '../entities/roasting';
import { RoastingRepository } from '../interfaces/roasting-repository';
import { RoastingStatus } from '../../../shared/types/roasting';

export const startRoastingUseCase = async (
  repository: RoastingRepository,
  findGreenCoffee: FindGreenCoffee
) => {
  /* 
  - There can be only single roasting planned for the day
  - Roasting can be started only in the same day
  - There can be only single active roasting at the same time
*/

  const today = moment().startOf('day').toISOString();

  const plannedRoastings = await repository.find({
    where: {
      status: RoastingStatus.IN_PLANNING,
      roastingDate: today,
    },
  });

  if (plannedRoastings.length > 1) {
    throw new Error('There is more than one planned roasting');
  }

  if (plannedRoastings.length === 0) {
    throw new Error(`There is no planned roasting for today ${today}`);
  }

  const roastingsInProgress = await repository.find({
    where: {
      status: RoastingStatus.IN_PROGRESS,
    },
  });

  if (roastingsInProgress.length > 0) {
    throw new Error('Can not start roasting, roasting is already in progress');
  }

  const plannedRoasting = plannedRoastings[0];
  const greenCoffee = await findGreenCoffee();

  const startedRoasting = getStartedRoasting(plannedRoasting, greenCoffee);

  await repository.save(startedRoasting);
};

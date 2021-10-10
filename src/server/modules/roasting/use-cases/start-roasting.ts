import moment from 'moment';

import { getStartedRoasting } from '../entities/roasting-entity';
import { RoastingRepository } from '../roasting-contracts';
import { GreenCoffeeRepository } from '../roasting-contracts';

export const startRoastingUseCase = async (context: {
  roastingRepository: RoastingRepository;
  greenCoffeeRepository: GreenCoffeeRepository;
}) => {
  /* 
  - There can be only single roasting planned for the day
  - Roasting can be started only in the same day
  - There can be only single active roasting at the same time
*/

  const today = moment().startOf('day').toISOString();

  const plannedRoastings = await context.roastingRepository.getRoastingsPlannedForToday();

  if (plannedRoastings.length > 1) {
    throw new Error('There is more than one planned roasting');
  }

  if (plannedRoastings.length === 0) {
    throw new Error(`There is no planned roasting for today ${today}`);
  }

  const roastingsInProgress = await context.roastingRepository.getRoastingsInProgress();

  if (roastingsInProgress.length > 0) {
    throw new Error('Can not start roasting, roasting is already in progress');
  }

  const plannedRoasting = plannedRoastings[0];
  const greenCoffee = await context.greenCoffeeRepository.getAll();

  const startedRoasting = getStartedRoasting(plannedRoasting, greenCoffee);

  await context.roastingRepository.save(startedRoasting);
};

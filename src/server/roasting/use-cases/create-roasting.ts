import { createRoasting } from '../entities/roasting';
import { RoastingRepository } from '../interfaces/roasting-repository';

export const createRoastingUseCase = async (
  roastingDate: string,
  repository: RoastingRepository
) => {
  // Can not create roasting in the past ??
  // Can not create 2 roastings in the same day ??

  await repository.create(createRoasting(roastingDate));
};

import { CreateRoastingProps } from './../roasting-contracts';
import { createRoasting } from '../entities/roasting-entity';
import { RoastingRepository } from '../roasting-contracts';

export const createRoastingUseCase = async (
  props: CreateRoastingProps,
  context: {
    roastingRepository: RoastingRepository;
  }
) => {
  // Can not create roasting in the past ??
  // Can not create 2 roastings in the same day ??

  await context.roastingRepository.create(createRoasting(props.roastingDate));
};

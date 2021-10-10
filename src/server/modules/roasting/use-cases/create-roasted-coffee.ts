import { v4 } from 'uuid';

import {
  RoastedCoffeeRepository,
  GreenCoffeeRepository,
  CreateRoastedCoffeeProps,
} from '../roasting-contracts';
import { RoastedCoffeeEntity } from '../entities/roasted-coffee-entity';

export const createRoastedCoffeeUseCase = async (
  props: CreateRoastedCoffeeProps,
  context: {
    roastedCoffeeRepository: RoastedCoffeeRepository;
    greenCoffeeRepository: GreenCoffeeRepository;
  }
) => {
  if (!(await context.greenCoffeeRepository.exists(props.greenCoffeeId))) {
    throw new Error(
      `Entity GreenCoffee id ${props.greenCoffeeId} does not exist`
    );
  }
  const entity = RoastedCoffeeEntity.create({ id: v4(), ...props });
  await context.roastedCoffeeRepository.create(entity);
};

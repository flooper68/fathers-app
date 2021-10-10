import { v4 } from 'uuid';

import { GreenCoffeeEntity } from '../entities/green-coffee-entity';
import {
  CreateGreenCoffeeProps,
  GreenCoffeeRepository,
} from '../roasting-contracts';

export const createGreenCoffeeUseCase = async (
  props: CreateGreenCoffeeProps,
  context: { greenCoffeeRepository: GreenCoffeeRepository }
) => {
  const greenCoffee = GreenCoffeeEntity.create({ id: v4(), ...props });
  await context.greenCoffeeRepository.create(greenCoffee);
};

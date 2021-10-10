import { GreenCoffeeRepository } from './../roasting-contracts';
import {
  RoastedCoffeeRepository,
  UpdateRoastedCoffeeProps,
} from '../roasting-contracts';
import { Logger } from '../../../../shared/logger';

export const updateRoastedCoffeeUseCase = async (
  props: UpdateRoastedCoffeeProps,
  context: {
    roastedCoffeeRepository: RoastedCoffeeRepository;
    greenCoffeeRepository: GreenCoffeeRepository;
  }
) => {
  const { id, ...rest } = props;

  Logger.debug(`Updating roasted coffee`, props);

  const coffee = await context.roastedCoffeeRepository.getOne(id);

  if (!coffee) {
    throw new Error('Entity not found');
  }

  if (
    props.greenCoffeeId &&
    !(await context.greenCoffeeRepository.exists(props.greenCoffeeId))
  ) {
    throw new Error(
      `Entity GreenCoffee id ${props.greenCoffeeId} does not exist`
    );
  }

  coffee.updateProperties(rest);

  Logger.debug(`Saving updated RoastedCoffee Entity`, coffee);
  await context.roastedCoffeeRepository.save(coffee);
};

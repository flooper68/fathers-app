import { UpdateGreenCoffeeProps } from '../roasting-contracts';
import { GreenCoffeeRepository } from '../roasting-contracts';

export const updateGreenCoffeeUseCase = async (
  props: UpdateGreenCoffeeProps,
  context: { greenCoffeeRepository: GreenCoffeeRepository }
) => {
  const { id, ...rest } = props;

  const coffee = await context.greenCoffeeRepository.getOne(id);

  if (!coffee) {
    throw new Error('Entity not found');
  }

  coffee.updateProperties(rest);

  await context.greenCoffeeRepository.save(coffee);
};

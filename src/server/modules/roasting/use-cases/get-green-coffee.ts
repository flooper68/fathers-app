import { GreenCoffeeMapping } from '../mappings/green-coffee-mapping';
import {
  GetGreenCoffeeProps,
  GreenCoffeeRepository,
} from '../roasting-contracts';

export const getGreenCoffeeUseCase = async (
  props: GetGreenCoffeeProps,
  context: {
    greenCoffeeRepository: GreenCoffeeRepository;
  }
) => {
  const greenCoffee = await context.greenCoffeeRepository.getOne(props.id);

  if (!greenCoffee) {
    return;
  }

  return GreenCoffeeMapping.mapEntityToDTO(greenCoffee);
};

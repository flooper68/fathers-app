import { RoastedCoffeeMapping } from '../mappings/roasted-coffee-mapping';
import {
  RoastedCoffeeRepository,
  GetRoastedCoffeeProps,
} from '../roasting-contracts';

export const getRoastedCoffeeUseCase = async (
  props: GetRoastedCoffeeProps,
  context: {
    roastedCoffeeRepository: RoastedCoffeeRepository;
  }
) => {
  const entity = await context.roastedCoffeeRepository.getOne(props.id);

  if (!entity) {
    return;
  }

  return RoastedCoffeeMapping.mapEntityToDTO(entity);
};

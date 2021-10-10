import { RoastedCoffeeMapping } from '../mappings/roasted-coffee-mapping';
import { RoastedCoffeeRepository } from '../roasting-contracts';

export const getAllRoastedCoffeesUseCase = async (context: {
  roastedCoffeeRepository: RoastedCoffeeRepository;
}) => {
  const entities = await context.roastedCoffeeRepository.getAll();
  return entities.map(RoastedCoffeeMapping.mapEntityToDTO);
};

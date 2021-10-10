import { GreenCoffeeMapping } from '../mappings/green-coffee-mapping';
import { GreenCoffeeRepository } from '../roasting-contracts';

export const getAllGreenCoffeesUseCase = async (context: {
  greenCoffeeRepository: GreenCoffeeRepository;
}) => {
  const entities = await context.greenCoffeeRepository.getAll();
  return entities.map(GreenCoffeeMapping.mapEntityToDTO);
};

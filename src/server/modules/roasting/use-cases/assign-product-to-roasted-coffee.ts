import { Logger } from '../../../../shared/logger';
import { RoastingProductEntity } from '../entities/roasting-product-entity';
import {
  RoastingProductRepository,
  RoastedCoffeeRepository,
} from '../roasting-contracts';

interface Props {
  id: number;
  roastedCoffeeId: string;
}

export const assignProductToRoastedCoffeeUseCase = async (
  props: Props,
  context: {
    roastingProductRepository: RoastingProductRepository;
    roastedCoffeeRepository: RoastedCoffeeRepository;
  }
) => {
  Logger.debug('Handling assignProductToRoastedCoffeeUseCase', props);
  let roastingProduct = await context.roastingProductRepository.getOne(
    props.id
  );

  if (!(await context.roastedCoffeeRepository.exists(props.roastedCoffeeId))) {
    throw new Error(`RoastedCoffee id ${props.roastedCoffeeId} does not exist`);
  }

  if (!roastingProduct) {
    Logger.debug('roastingProduct does not exist, creating new one');
    roastingProduct = RoastingProductEntity.create(props);
    await context.roastingProductRepository.create(roastingProduct);
  } else {
    Logger.debug('roastingProduct exists, updateRoastedCoffeeId');
    roastingProduct.updateRoastedCoffeeId(props.roastedCoffeeId);
    await context.roastingProductRepository.save(roastingProduct);
  }
};

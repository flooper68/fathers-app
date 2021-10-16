import { Logger } from '../../../../shared/logger';
import { WarehouseRoastedCoffeeEntity } from '../entities/warehouse-roasted-coffee-entity';
import {
  WarehouseContext,
  AddRoastingLeftoversProps,
} from './../warehouse-contracts';

export const addRoastingLeftoversUseCase = async (
  props: AddRoastingLeftoversProps,
  context: WarehouseContext
) => {
  Logger.debug(`Handling addRoastingLeftover use case started`, props);
  let entity = await context.warehouseRoastedCoffeeRepository.getOne(
    props.roastedCoffeeId
  );

  if (!entity) {
    entity = WarehouseRoastedCoffeeEntity.create({
      id: props.roastedCoffeeId,
      events: [],
    });
  }

  entity.addLeftOvers(props);

  await context.warehouseRoastedCoffeeRepository.save(entity);
};

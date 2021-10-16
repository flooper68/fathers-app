import { Logger } from '../../../../shared/logger';
import { WarehouseRoastedCoffeeEntity } from '../entities/warehouse-roasted-coffee-entity';
import {
  WarehouseContext,
  UseRoastedCoffeeLeftoversProps,
} from '../warehouse-contracts';

export const useRoastingLeftoversUseCase = async (
  props: UseRoastedCoffeeLeftoversProps,
  context: WarehouseContext
) => {
  Logger.debug(`Handling useRoastingLeftover use case started`, props);
  let entity = await context.warehouseRoastedCoffeeRepository.getOne(
    props.roastedCoffeeId
  );

  if (!entity) {
    entity = WarehouseRoastedCoffeeEntity.create({
      id: props.roastedCoffeeId,
      events: [],
    });
  }

  entity.useLeftOvers(props);

  await context.warehouseRoastedCoffeeRepository.save(entity);
};

import { Logger } from '../../../../shared/logger';
import { WarehouseRoastedCoffeeEntity } from '../entities/warehouse-roasted-coffee-entity';
import {
  WarehouseContext,
  AdjustRoastedCoffeeLeftoversProps,
} from '../warehouse-contracts';

export const adjustRoastedCoffeeLeftoversUseCase = async (
  props: AdjustRoastedCoffeeLeftoversProps,
  context: WarehouseContext
) => {
  Logger.debug(`Handling adjustRoastedCoffeeLeftovers use case started`, props);
  let entity = await context.warehouseRoastedCoffeeRepository.getOne(
    props.roastedCoffeeId
  );

  if (!entity) {
    entity = WarehouseRoastedCoffeeEntity.create({
      id: props.roastedCoffeeId,
      events: [],
    });
  }

  entity.adjustLeftOvers(props);

  await context.warehouseRoastedCoffeeRepository.save(entity);
};

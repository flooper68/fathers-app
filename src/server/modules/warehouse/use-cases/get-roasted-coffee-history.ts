import { GetRoastedCoffeeHistoryProps } from './../warehouse-contracts';
import { Logger } from '../../../../shared/logger';
import { WarehouseContext } from '../warehouse-contracts';

export const getRoastedCoffeeHistoryUseCase = async (
  props: GetRoastedCoffeeHistoryProps,
  context: WarehouseContext
) => {
  Logger.debug(
    `Handling getRoastedCoffeeHistoryUseCase use case started`,
    props
  );
  const exists = await context.warehouseRoastedCoffeeRepository.exists(
    props.roastedCoffeeId
  );

  if (!exists) {
    throw new Error(`Entity ${props.roastedCoffeeId} does not exist`);
  }

  return await context.warehouseRoastedCoffeeRepository.getEventsForEntity(
    props.roastedCoffeeId
  );
};

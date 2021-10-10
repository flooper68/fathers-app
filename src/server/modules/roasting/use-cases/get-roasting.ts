import { GetRoastingByOrderProps } from './../roasting-contracts';
import { RoastingRepository } from '../roasting-contracts';
import { Logger } from '../../../../shared/logger';

export const getRoastingByOrderUseCase = async (
  props: GetRoastingByOrderProps,
  context: {
    roastingRepository: RoastingRepository;
  }
) => {
  Logger.debug('Handling getRoastingByOrderUseCase use case');
  const entity = await context.roastingRepository.getRoastingByOrder(
    props.orderId
  );
  return entity;
};

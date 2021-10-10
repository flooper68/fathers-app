import { RoastingProductMapping } from './../mappings/roasting-product-mapping';
import {
  GetRoastingProductProps,
  RoastingProductRepository,
} from '../roasting-contracts';
import { Logger } from '../../../../shared/logger';

export const getRoastingProductUseCase = async (
  props: GetRoastingProductProps,
  context: {
    roastingProductRepository: RoastingProductRepository;
  }
) => {
  Logger.debug(`Handling getRoastingProductUseCase`, props);
  const entity = await context.roastingProductRepository.getOne(props.id);

  if (!entity) {
    return;
  }

  return RoastingProductMapping.mapEntityToDTO(entity);
};

import { RoastingRepository } from './../roasting-contracts';
import { RoastingMapping } from '../mappings/roasting-mapping';
import { Logger } from '../../../../shared/logger';

export const getAllRoastingsUseCase = async (context: {
  roastingRepository: RoastingRepository;
}) => {
  Logger.debug('Handling getAllRoastingsUseCase use case');
  const entities = await context.roastingRepository.getAll();
  return entities.map(RoastingMapping.mapEntityToDTO);
};

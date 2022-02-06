import { RoastingNormalizedState, RoastingState } from './roasting-types';

const normalizeState = (state: RoastingState): RoastingNormalizedState => {
  return {
    uuid: state.uuid,
  };
};

const denormalizeState = (state: RoastingNormalizedState): RoastingState => {
  return {
    uuid: state.uuid,
  };
};

export const RoastingMapping = {
  normalizeState,
  denormalizeState,
};

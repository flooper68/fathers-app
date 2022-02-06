import { RoastingNormalizedState, RoastingState } from './roasting-types';

const normalizeState = (state: RoastingState): RoastingNormalizedState => {
  return state;
};

const denormalizeState = (state: RoastingNormalizedState): RoastingState => {
  return state;
};

export const RoastingMapping = {
  normalizeState,
  denormalizeState,
};

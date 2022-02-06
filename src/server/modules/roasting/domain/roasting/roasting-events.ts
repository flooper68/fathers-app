import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { noop } from 'lodash';

import { RoastingLineItem, RoastingNormalizedState } from './roasting-types';

const reducers = {
  // TODO configure eslint
  RoastingCreated: (
    _state: RoastingNormalizedState,
    _action: PayloadAction<{
      uuid: string;
    }>
  ) => {
    noop();
  },
  OrderAdded: (
    state: RoastingNormalizedState,
    action: PayloadAction<{
      id: number;
      lineItems: RoastingLineItem[];
      timestamp: string;
    }>
  ) => {
    state.orders.push({ id: action.payload.id });
    state.lineItems.push(...action.payload.lineItems);
  },
};

const { actions, reducer } = createSlice({
  name: 'RoastingRoot',
  initialState: {
    uuid: '',
  } as unknown as RoastingNormalizedState,
  reducers,
});

export const RoastingDomainEventCreators = actions;
export type RoastingDomainEvents = {
  [K in keyof typeof reducers]: {
    type: `RoastingRoot/${K}`;
    payload: Parameters<typeof reducers[K]>[1]['payload'];
  };
};

export type RoastingDomainEvent = RoastingDomainEvents[keyof typeof reducers];

export const RoastingDomainReducer = reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { noop } from 'lodash';

import { WarehouseRoastedCoffeeState } from './warehouse-roasted-coffee-types';

const reducers = {
  // TODO configure eslint
  WarehouseRoastedCoffeeCreated: (
    _state: WarehouseRoastedCoffeeState,
    _action: PayloadAction<{
      uuid: string;
    }>
  ) => {
    noop();
  },
  RoastingLeftoversAdded: (
    state: WarehouseRoastedCoffeeState,
    action: PayloadAction<{
      amount: number;
      roastingId: string;
      timestamp: string;
      roastedCoffeeId: string;
    }>
  ) => {
    state.quantityOnHand = state.quantityOnHand + action.payload.amount;
  },
  RoastingLeftoversAdjusted: (
    state: WarehouseRoastedCoffeeState,
    action: PayloadAction<{
      newAmount: number;
      timestamp: string;
      roastedCoffeeId: string;
    }>
  ) => {
    state.quantityOnHand = action.payload.newAmount;
  },
  RoastingLeftoversUsed: (
    state: WarehouseRoastedCoffeeState,
    action: PayloadAction<{
      roastedCoffeeId: string;
      amount: number;
      timestamp: string;
    }>
  ) => {
    state.quantityOnHand = state.quantityOnHand - action.payload.amount;
  },
};

const { actions, reducer } = createSlice({
  name: 'WarehouseRoastedCoffeeRoot',
  initialState: {
    uuid: '',
    quantityOnHand: 0,
  } as unknown as WarehouseRoastedCoffeeState,
  reducers,
});

export const WarehouseRoastedCoffeeDomainEventCreators = actions;
export type WarehouseRoastedCoffeeDomainEvents = {
  [K in keyof typeof reducers]: {
    type: `WarehouseRoastedCoffeeRoot/${K}`;
    payload: Parameters<typeof reducers[K]>[1]['payload'];
  };
};

export type WarehouseRoastedCoffeeDomainEvent =
  WarehouseRoastedCoffeeDomainEvents[keyof typeof reducers];

export const WarehouseRoastedCoffeeDomainReducer = reducer;

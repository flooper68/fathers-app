import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { noop } from 'lodash';

import { RoastingPlan } from './actions/internal/get-roasting-plan';
import {
  RoastingLineItem,
  RoastingNormalizedState,
  RoastingStatus,
} from './roasting-types';

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
  OrderRemoved: (
    state: RoastingNormalizedState,
    action: PayloadAction<{
      id: number;
      timestamp: string;
    }>
  ) => {
    state.lineItems = state.lineItems.filter(
      (item) => item.orderId !== action.payload.id
    );
    state.orders = state.orders.filter((item) => item.id !== action.payload.id);
  },
  RoastingStarted: (
    state: RoastingNormalizedState,
    action: PayloadAction<{
      roastingPlan: RoastingPlan;
      timestamp: string;
    }>
  ) => {
    state.roastingPlan = action.payload.roastingPlan;
    state.status = RoastingStatus.IN_PROGRESS;
  },
  BatchFinished: (
    state: RoastingNormalizedState,
    action: PayloadAction<{
      roastedCoffeeUuid: string;
      timestamp: string;
    }>
  ) => {
    const finishedBatch = state.finishedBatches.find(
      (item) => item.roastedCoffeeUuid === action.payload.roastedCoffeeUuid
    );

    if (finishedBatch) {
      finishedBatch.amount = finishedBatch.amount + 1;
    } else {
      state.finishedBatches.push({
        roastedCoffeeUuid: action.payload.roastedCoffeeUuid,
        amount: 1,
      });
    }
  },
  YieldReported: (
    state: RoastingNormalizedState,
    action: PayloadAction<{
      roastedCoffeeUuid: string;
      weight: number;
      timestamp: string;
    }>
  ) => {
    const reportedYield = state.reportedYields.find(
      (item) => item.roastedCoffeeUuid === action.payload.roastedCoffeeUuid
    );

    if (reportedYield) {
      reportedYield.weight = action.payload.weight;
    } else {
      state.reportedYields.push({
        roastedCoffeeUuid: action.payload.roastedCoffeeUuid,
        weight: action.payload.weight,
      });
    }
  },
  RoastingFinished: (
    state: RoastingNormalizedState,
    _action: PayloadAction<{
      timestamp: string;
    }>
  ) => {
    state.status = RoastingStatus.FINISHED;
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

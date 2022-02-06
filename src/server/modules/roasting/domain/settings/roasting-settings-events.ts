import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { noop } from 'lodash';

import { RoastingSettingsNormalizedState } from './roasting-settings-types';

const reducers = {
  // TODO configure eslint
  RoastingSettingsCreated: (
    _state: RoastingSettingsNormalizedState,
    _action: PayloadAction<{
      uuid: string;
    }>
  ) => {
    noop();
  },
  GreenCoffeeAdded: (
    state: RoastingSettingsNormalizedState,
    action: PayloadAction<{
      uuid: string;
      name: string;
      batchWeight: number;
      roastingLossFactor: number;
      timestamp: string;
    }>
  ) => {
    state.greenCoffees[action.payload.uuid] = {
      uuid: action.payload.uuid,
      name: action.payload.name,
      batchWeight: action.payload.batchWeight,
      roastingLossFactor: action.payload.roastingLossFactor,
    };
  },
  GreenCoffeeUpdated: (
    state: RoastingSettingsNormalizedState,
    action: PayloadAction<{
      uuid: string;
      name: string;
      batchWeight: number;
      roastingLossFactor: number;
      timestamp: string;
    }>
  ) => {
    state.greenCoffees[action.payload.uuid] = {
      uuid: action.payload.uuid,
      name: action.payload.name,
      batchWeight: action.payload.batchWeight,
      roastingLossFactor: action.payload.roastingLossFactor,
    };
  },
  RoastedCoffeeAdded: (
    state: RoastingSettingsNormalizedState,
    action: PayloadAction<{
      uuid: string;
      name: string;
      greenCoffeeUuid: string;
      timestamp: string;
    }>
  ) => {
    state.roastedCoffees[action.payload.uuid] = {
      uuid: action.payload.uuid,
      name: action.payload.name,
      greenCoffeeUuid: action.payload.greenCoffeeUuid,
    };
  },
  RoastedCoffeeUpdated: (
    state: RoastingSettingsNormalizedState,
    action: PayloadAction<{
      uuid: string;
      name: string;
      greenCoffeeUuid: string;
      timestamp: string;
    }>
  ) => {
    state.roastedCoffees[action.payload.uuid] = {
      uuid: action.payload.uuid,
      name: action.payload.name,
      greenCoffeeUuid: action.payload.greenCoffeeUuid,
    };
  },
  ProductVariationAssigned: (
    state: RoastingSettingsNormalizedState,
    action: PayloadAction<{
      id: number;
      weight: number;
      roastedCoffeeUuid: string;
      timestamp: string;
    }>
  ) => {
    state.productVariations[action.payload.id] = {
      id: action.payload.id,
      weight: action.payload.weight,
      roastedCoffeeUuid: action.payload.roastedCoffeeUuid,
    };
  },
};

const { actions, reducer } = createSlice({
  name: 'RoastingSettingsRoot',
  initialState: {
    uuid: '',
    quantityOnHand: 0,
  } as unknown as RoastingSettingsNormalizedState,
  reducers,
});

export const RoastingSettingsDomainEventCreators = actions;
export type RoastingSettingsDomainEvents = {
  [K in keyof typeof reducers]: {
    type: `RoastingSettingsRoot/${K}`;
    payload: Parameters<typeof reducers[K]>[1]['payload'];
  };
};

export type RoastingSettingsDomainEvent =
  RoastingSettingsDomainEvents[keyof typeof reducers];

export const RoastingSettingsDomainReducer = reducer;

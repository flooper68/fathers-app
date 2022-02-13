import { DeepPartial } from '@reduxjs/toolkit';
import { merge } from 'lodash';

import {
  FinishedBatch,
  ReportedYield,
  RoastingLineItem,
  RoastingOrder,
  RoastingState,
  RoastingStatus,
} from './../server/modules/roasting/domain/roasting/roasting-types';
import {
  DEFAULT_ROASTED_COFFEE_UUID,
  getRoastingSettingsFixture,
  getRoastingSettingsTemplate,
} from './roasting-settings';
import { RoastingPlan } from './../server/modules/roasting/domain/roasting/actions/internal/get-roasting-plan';

export const DEFAULT_ROASTING_UUID = 'roasting-uuid';

const getReportedYieldTemplate = (): ReportedYield => ({
  roastedCoffeeUuid: DEFAULT_ROASTED_COFFEE_UUID,
  weight: 1,
});

const getFinishedBatchTemplate = (): FinishedBatch => ({
  roastedCoffeeUuid: DEFAULT_ROASTED_COFFEE_UUID,
  amount: 1,
});

const getRoastingLineItemTemplate = (): RoastingLineItem => ({
  variationId: 1,
  quantity: 2,
  orderId: 1,
});

const getRoastingOrderTemplate = (): RoastingOrder => ({
  id: 1,
});

const getRoastingPlanTemplate = (): RoastingPlan => ({
  roastedCoffees: {},
  greenCoffees: {},
});

const getTemplate = (): RoastingState => ({
  uuid: DEFAULT_ROASTING_UUID,
  roastingDate: 'today',
  status: RoastingStatus.IN_PLANNING,
  settings: getRoastingSettingsTemplate(),
  orders: [],
  lineItems: [],
  finishedBatches: [],
  reportedYields: [],
});

export const getFinishedBatchFixture = (
  partial: DeepPartial<FinishedBatch> = {}
): FinishedBatch => {
  return merge({}, getFinishedBatchTemplate(), partial);
};

export const getRoastingPlanFixture = (
  partial: DeepPartial<RoastingPlan> = {}
): RoastingPlan => {
  return merge({}, getRoastingPlanTemplate(), partial);
};

export const getReportedYieldFixture = (
  partial: DeepPartial<ReportedYield> = {}
): ReportedYield => {
  return merge({}, getReportedYieldTemplate(), partial);
};

export const getRoastingLineItemFixture = (
  partial: DeepPartial<RoastingLineItem> = {}
): RoastingLineItem => {
  return merge({}, getRoastingLineItemTemplate(), partial);
};

export const getRoastingOrderFixture = (
  partial: DeepPartial<RoastingOrder> = {}
): RoastingOrder => {
  return merge({}, getRoastingOrderTemplate(), partial);
};

export const getRoastingFixture = (
  partial: DeepPartial<RoastingState> = {}
): RoastingState => {
  const state = merge({}, getTemplate(), partial);

  state.settings = getRoastingSettingsFixture(partial?.settings);

  if (partial?.roastingPlan) {
    state.roastingPlan = getRoastingPlanFixture(partial?.roastingPlan);
  }

  state.lineItems =
    partial?.lineItems?.map((item) => getRoastingLineItemFixture(item)) || [];

  state.orders =
    partial?.orders?.map((item) => getRoastingOrderFixture(item)) || [];

  state.finishedBatches =
    partial?.finishedBatches?.map((item) => getFinishedBatchFixture(item)) ||
    [];

  state.reportedYields =
    partial?.reportedYields?.map((item) => getReportedYieldFixture(item)) || [];

  return state;
};

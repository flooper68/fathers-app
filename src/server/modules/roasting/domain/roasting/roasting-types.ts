import {
  getRoastingPlan,
  RoastingPlan,
} from './actions/internal/get-roasting-plan';
import { getLineItemRoastingPlan } from './actions/internal/get-line-item-roasting-plan';
import { RoastingSettingsState } from './../settings/roasting-settings-types';
import {
  DomainAction,
  DomainActionContext,
} from '../../../common/aggregate-root';

export enum RoastingStatus {
  FINISHED = 'FINISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_PLANNING = 'IN_PLANNING',
}

export interface RoastingLineItem {
  variationId: number;
  quantity: number;
  orderId: number;
}

export interface RoastingOrder {
  id: number;
}

export interface FinishedBatch {
  roastedCoffeeUuid: string;
  amount: number;
}

export interface ReportedYield {
  roastedCoffeeUuid: string;
  weight: number;
}

export interface RoastingState {
  uuid: string;
  roastingDate: string;
  status: RoastingStatus;
  settings: RoastingSettingsState;
  orders: RoastingOrder[];
  lineItems: RoastingLineItem[];
  finishedBatches: FinishedBatch[];
  reportedYields: ReportedYield[];
  roastingPlan?: RoastingPlan;
}

export type RoastingNormalizedState = RoastingState;

export type RoastingContextExtension = {
  getLineItemRoastingPlan: typeof getLineItemRoastingPlan;
  getRoastingPlan: typeof getRoastingPlan;
};

export type RoastingContext = DomainActionContext<
  RoastingState,
  RoastingContextExtension
>;

export type RoastingDomainAction<P> = DomainAction<P, RoastingContext>;

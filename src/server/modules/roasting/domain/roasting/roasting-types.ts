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

export interface FinishedBatch {
  roastedCoffeeUuid: string;
  amount: number;
}

export interface ReportedYield {
  roastedCoffeeId: string;
  weight: number;
}

export interface RoastingState {
  uuid: string;
  roastingDate: string;
  status: RoastingStatus;
  settings: RoastingSettingsState;
  // orders: TODO type of orders
  // plannedValues
  finishedBatches: FinishedBatch[];
  realYield: ReportedYield[];
}

export type RoastingNormalizedState = RoastingState;

export type RoastingContextExtension = void;

export type RoastingContext = DomainActionContext<
  RoastingState,
  RoastingContextExtension
>;

export type RoastingDomainAction<P> = DomainAction<P, RoastingContext>;

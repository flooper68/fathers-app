import {
  DomainAction,
  DomainActionContext,
} from '../../../common/aggregate-root';

export interface RoastingState {
  uuid: string;
}

export interface RoastingNormalizedState {
  uuid: string;
}

export type RoastingContextExtension = void;

export type RoastingContext = DomainActionContext<
  RoastingState,
  RoastingContextExtension
>;

export type RoastingDomainAction<P> = DomainAction<P, RoastingContext>;

import {
  DomainAction,
  DomainActionContext,
} from '../../../common/aggregate-root';

export interface RoastingProductVariation {
  id: number;
  weight: number;
  roastedCoffeeUuid: string;
}

export interface RoastingGreenCoffee {
  uuid: string;
  name: string;
  batchWeight: number;
  roastingLossFactor: number;
}

export interface RoastingRoastedCoffee {
  uuid: string;
  name: string;
  greenCoffeeUuid: string;
}

export interface RoastingSettingsState {
  uuid: string;
  greenCoffees: RoastingGreenCoffee[];
  roastedCoffees: RoastingRoastedCoffee[];
  productVariations: RoastingProductVariation[];
}

export interface RoastingSettingsNormalizedState {
  uuid: string;
  greenCoffees: Record<string, RoastingGreenCoffee>;
  roastedCoffees: Record<string, RoastingRoastedCoffee>;
  productVariations: Record<string, RoastingProductVariation>;
}

export type RoastingSettingsContextExtension = void;

export type RoastingSettingsContext = DomainActionContext<
  RoastingSettingsState,
  RoastingSettingsContextExtension
>;

export type RoastingSettingsDomainAction<P> = DomainAction<
  P,
  RoastingSettingsContext
>;

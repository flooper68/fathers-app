import { DomainEvent } from '../../common';

export const RoastingLeftOversAdjustedType = 'ROASTING_LEFTOVER_ADJUSTED';

interface Payload {
  newAmount: number;
  timestamp: string;
  roastedCoffeeId: string;
}

export class RoastingLeftoversAdjusted implements DomainEvent {
  readonly type: string = RoastingLeftOversAdjustedType;
  constructor(public readonly payload: Payload) {}
}

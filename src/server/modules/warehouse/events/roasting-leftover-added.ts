import { DomainEvent } from '../../common';

export const RoastingLeftOversAddedType = 'ROASTING_LEFTOVER_ADDED';

interface Payload {
  amount: number;
  roastingId: string;
  timestamp: string;
  roastedCoffeeId: string;
}

export class RoastingLeftoversAdded implements DomainEvent {
  readonly type: string = RoastingLeftOversAddedType;
  constructor(public readonly payload: Payload) {}
}

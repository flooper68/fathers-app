import { DomainEvent } from '../../common';

export const RoastingLeftOversUsedType = 'ROASTING_LEFTOVER_USED';

interface Payload {
  roastedCoffeeId: string;
  amount: number;
  timestamp: string;
}

export class RoastingLeftoversUsed implements DomainEvent {
  readonly type: string = RoastingLeftOversUsedType;
  constructor(public readonly payload: Payload) {}
}

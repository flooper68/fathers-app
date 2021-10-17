import { DomainEvent } from '../../common/contracts';

export const RoastingLeftOversAdjustedType = 'ROASTING_LEFTOVER_ADJUSTED';

interface Payload {
  newAmount: number;
  timestamp: string;
  roastedCoffeeId: string;
}

export class RoastingLeftoversAdjusted implements DomainEvent<Payload> {
  readonly type: string = RoastingLeftOversAdjustedType;
  constructor(public readonly payload: Payload) {}
}

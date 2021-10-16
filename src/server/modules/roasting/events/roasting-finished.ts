import { Roasting } from '../../../../shared/types/roasting';
import { DomainEvent } from '../../common';

export const RoastingFinishedType = 'ROASTING_FINISHED';

type Payload = Roasting;

export class RoastingFinished implements DomainEvent {
  readonly type: string = RoastingFinishedType;
  constructor(public readonly payload: Payload) {}
}

import { Roasting } from '../../../../shared/types/roasting';
import { DomainEvent } from '../../common/contracts';

export const RoastingFinishedType = 'ROASTING_FINISHED';

type Payload = Roasting;

export class RoastingFinished implements DomainEvent<Payload> {
  readonly type: string = RoastingFinishedType;
  constructor(public readonly payload: Payload) {}
}

import {
  AggregateRootStore,
  AggregateRootStoreModel,
  OptimisticTransaction,
} from '../../common/aggreagte-root-store';
import { RoastingDomainEvent } from '../domain/roasting/roasting-events';
import { RoastingState } from '../domain/roasting/roasting-types';
import { RoastingFactory } from './roasting-factory';
import { RoastingModel } from './roasting-model';

export class RoastingRepository {
  private _warehouseStore: AggregateRootStoreModel<
    RoastingState,
    RoastingDomainEvent
  >;

  constructor(
    private readonly store: AggregateRootStore<
      RoastingState,
      RoastingDomainEvent
    >,
    private readonly factory: RoastingFactory,
    private readonly transaction: OptimisticTransaction,
    private readonly model: RoastingModel
  ) {
    this._warehouseStore = this.store.useModel(this.model, 1, 1000, [
      `application-stream`,
    ]);
  }

  async get(uuid: string) {
    const document = await this._warehouseStore.get(uuid, this.transaction);
    return this.factory.hydrate(document.state);
  }

  save(
    state: RoastingState,
    // TODO add event wrapper with correlationUuid and rootUuid
    events: RoastingDomainEvent[]
  ) {
    return this._warehouseStore.save(state, events, this.transaction);
  }
}

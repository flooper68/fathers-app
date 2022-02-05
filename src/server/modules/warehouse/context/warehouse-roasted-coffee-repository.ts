import { WarehouseRoastedCoffeeModel } from './warehouse-roasted-coffee-model';
import { WarehouseRoastedCoffeeState } from './../domain/warehouse-roasted-coffee-types';
import {
  AggregateRootStore,
  AggregateRootStoreModel,
  OptimisticTransaction,
} from './../../common/aggreagte-root-store';
import { WarehouseRoastedCoffeeDomainEvent } from '../domain/warehouse-roasted-coffee-events';
import { WarehouseRoastedCoffeeFactory } from './warehouse-roasted-coffee-factory';

export class WarehouseRoastedCoffeeRepository {
  private _warehouseStore: AggregateRootStoreModel<
    WarehouseRoastedCoffeeState,
    WarehouseRoastedCoffeeDomainEvent
  >;
  constructor(
    private readonly store: AggregateRootStore<
      WarehouseRoastedCoffeeState,
      WarehouseRoastedCoffeeDomainEvent
    >,
    private readonly factory: WarehouseRoastedCoffeeFactory,
    private readonly transaction: OptimisticTransaction,
    private readonly model: WarehouseRoastedCoffeeModel
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
    state: WarehouseRoastedCoffeeState,
    // TODO add event wrapper with correlationUuid and rootUuid
    events: WarehouseRoastedCoffeeDomainEvent[]
  ) {
    return this._warehouseStore.save(state, events, this.transaction);
  }
}

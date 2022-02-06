import { RoastingSettingsModel } from './roasting-settings-model';
import { RoastingSettingsDomainEvent } from './../domain/settings/roasting-settings-events';
import { RoastingSettingsState } from '../domain/settings/roasting-settings-types';
import {
  AggregateRootStore,
  AggregateRootStoreModel,
  OptimisticTransaction,
} from './../../common/aggreagte-root-store';
import { RoastingFactory } from './roasting-factory';

export const DEFAULT_SETTINGS_UUID = `bf737739-94cd-47a5-80d1-af1a94c15c2a`;

export class RoastingSettingsRepository {
  private _warehouseStore: AggregateRootStoreModel<
    RoastingSettingsState,
    RoastingSettingsDomainEvent
  >;

  constructor(
    private readonly store: AggregateRootStore<
      RoastingSettingsState,
      RoastingSettingsDomainEvent
    >,
    private readonly factory: RoastingFactory,
    private readonly transaction: OptimisticTransaction,
    private readonly model: RoastingSettingsModel
  ) {
    this._warehouseStore = this.store.useModel(this.model, 1, 1000, [
      `application-stream`,
    ]);
  }

  async get() {
    const document = await this._warehouseStore.get(
      DEFAULT_SETTINGS_UUID,
      this.transaction
    );
    return this.factory.hydrate(document.state);
  }

  save(
    state: RoastingSettingsState,
    // TODO add event wrapper with correlationUuid and rootUuid
    events: RoastingSettingsDomainEvent[]
  ) {
    return this._warehouseStore.save(state, events, this.transaction);
  }
}

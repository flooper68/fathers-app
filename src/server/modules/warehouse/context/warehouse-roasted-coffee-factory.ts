import { Subject } from 'rxjs';

import { WarehouseRoastedCoffeeDomainEvent } from '../domain/warehouse-roasted-coffee-events';
import { WarehouseRoastedCoffeeRoot } from '../domain/warehouse-roasted-coffee-root';
import { WarehouseRoastedCoffeeState } from '../domain/warehouse-roasted-coffee-types';

export class WarehouseRoastedCoffeeFactory {
  constructor(
    private readonly subject: Subject<WarehouseRoastedCoffeeDomainEvent>,
    private readonly onHydrated: (root: WarehouseRoastedCoffeeRoot) => void
  ) {}

  hydrate(state: WarehouseRoastedCoffeeState) {
    const root = WarehouseRoastedCoffeeRoot.hydrate(state, {
      subject: this.subject,
      contextExtension: undefined,
    });

    this.onHydrated(root);

    return root;
  }

  create(uuid: string) {
    const root = WarehouseRoastedCoffeeRoot.create(
      { uuid },
      {
        subject: this.subject,
        contextExtension: undefined,
      }
    );

    this.onHydrated(root);

    return root;
  }
}

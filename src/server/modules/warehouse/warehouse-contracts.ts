import { MessageBroker } from './../../services/message-broker';
import { RoastingProjection } from './../../projections/roasting-projection';
import { WarehouseRoastedCoffeeEntity } from './entities/warehouse-roasted-coffee-entity';
import { RoastingLeftoversAdded } from './events/roasting-leftover-added';
import { RoastingLeftoversAdjusted } from './events/roasting-leftover-adjusted';
import { RoastingLeftoversUsed } from './events/roasting-leftover-used';

export type WarehouseRoastingEvent =
  | RoastingLeftoversUsed
  | RoastingLeftoversAdded
  | RoastingLeftoversAdjusted;

export interface WarehouseRoastedCoffeeRepository {
  save: (entity: WarehouseRoastedCoffeeEntity) => Promise<void>;
  getOne: (id: string) => Promise<WarehouseRoastedCoffeeEntity | undefined>;
  exists: (id: string) => Promise<boolean>;
  getEventsForEntity: (id: string) => Promise<WarehouseRoastingEvent[]>;
}

export interface WarehouseContext {
  warehouseRoastedCoffeeRepository: WarehouseRoastedCoffeeRepository;
  roastingProjection: RoastingProjection;
  messageBroker: MessageBroker;
}

export interface AddRoastingLeftoversProps {
  roastedCoffeeId: string;
  amount: number;
  roastingId: string;
  timestamp: string;
}

export interface UseRoastedCoffeeLeftoversProps {
  roastedCoffeeId: string;
  amount: number;
  timestamp: string;
}

export interface AdjustRoastedCoffeeLeftoversProps {
  roastedCoffeeId: string;
  newAmount: number;
  timestamp: string;
}

export interface GetRoastedCoffeeHistoryProps {
  roastedCoffeeId: string;
}

export interface WarehouseModule {
  addRoastingLeftovers: (props: AddRoastingLeftoversProps) => Promise<void>;
  useRoastedCoffeeLeftovers: (
    props: UseRoastedCoffeeLeftoversProps
  ) => Promise<void>;
  adjustRoastedCoffeeLeftovers: (
    props: AdjustRoastedCoffeeLeftoversProps
  ) => Promise<void>;
  getRoastedCoffeeHistory: (
    props: GetRoastedCoffeeHistoryProps
  ) => Promise<WarehouseRoastingEvent[]>;
}

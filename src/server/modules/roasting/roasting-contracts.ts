import { RoastingProductEntity } from './entities/roasting-product-entity';
import { RoastedCoffeeEntity } from './entities/roasted-coffee-entity';
import {
  RoastedCoffee,
  RoastingProduct,
} from '../../../shared/types/roasted-coffee';
import { GreenCoffee } from '../../../shared/types/green-coffee';
import { Roasting } from '../../../shared/types/roasting';
import { GreenCoffeeEntity } from './entities/green-coffee-entity';
import { MessageBroker } from '../../services/message-broker';

export interface GreenCoffeeRepository {
  create: (greenCoffee: GreenCoffeeEntity) => Promise<void>;
  save: (greenCoffee: GreenCoffeeEntity) => Promise<void>;
  getOne: (id: string) => Promise<GreenCoffeeEntity | undefined>;
  getAll: () => Promise<GreenCoffeeEntity[]>;
  exists: (id: string) => Promise<boolean>;
}

export interface RoastedCoffeeRepository {
  create: (coffee: RoastedCoffeeEntity) => Promise<void>;
  save: (coffee: RoastedCoffeeEntity) => Promise<void>;
  getOne: (id: string) => Promise<RoastedCoffeeEntity | undefined>;
  getAll: () => Promise<RoastedCoffeeEntity[]>;
  exists: (id: string) => Promise<boolean>;
}

export interface RoastingProductRepository {
  create: (product: RoastingProductEntity) => Promise<void>;
  save: (product: RoastingProductEntity) => Promise<void>;
  getOne: (id: number) => Promise<RoastingProductEntity | undefined>;
}

export interface RoastingRepository {
  getRoastingByOrder: (orderId: number) => Promise<Roasting | undefined>;
  getRoastingsPlannedForToday: () => Promise<Roasting[]>;
  getRoastingsInProgress: () => Promise<Roasting[]>;
  getAll: () => Promise<Roasting[]>;
  getOne: (id: string) => Promise<Roasting | undefined>;
  create: (roasting: Roasting) => Promise<void>;
  save: (roasting: Roasting) => Promise<void>;
}

export interface RoastingContext {
  roastingRepository: RoastingRepository;
  roastingProductRepository: RoastingProductRepository;
  roastedCoffeeRepository: RoastedCoffeeRepository;
  greenCoffeeRepository: GreenCoffeeRepository;
  messageBroker: MessageBroker;
}

export interface AssignProductToRoastedCoffeeProps {
  id: number;
  roastedCoffeeId: string;
}

export interface CreateGreenCoffeeProps {
  name: string;
  batchWeight: number;
  roastingLossFactor: number;
}

export interface UpdateGreenCoffeeProps {
  id: string;
  name?: string;
}

export interface GetGreenCoffeeProps {
  id: string;
}

export interface GetRoastedCoffeeProps {
  id: string;
}

export interface CreateRoastedCoffeeProps {
  name: string;
  greenCoffeeId: string;
}

export interface UpdateRoastedCoffeeProps {
  id: string;
  name?: string;
  greenCoffeeId?: string;
}

export interface GetRoastingProductProps {
  id: number;
}

export interface SelectOrdersRoastingProps {
  roastingId: string;
  orderId: number;
}

export interface GetRoastingByOrderProps {
  orderId: number;
}

export interface ReportRealYieldProps {
  roastedCoffeeId: string;
  weight: number;
}

export interface CreateRoastingProps {
  roastingDate: string;
}

export interface FinishBatchProps {
  roastedCoffeeId: string;
}

export interface RoastingModule {
  //GreenCoffee
  createGreenCoffee: (props: CreateGreenCoffeeProps) => Promise<void>;
  updateGreenCoffee: (props: UpdateGreenCoffeeProps) => Promise<void>;
  getGreenCoffee: (
    props: GetGreenCoffeeProps
  ) => Promise<GreenCoffee | undefined>;
  getAllGreenCoffees: () => Promise<GreenCoffee[]>;

  //RoastedCoffee
  getRoastedCoffee: (
    props: GetRoastedCoffeeProps
  ) => Promise<RoastedCoffee | undefined>;
  getAllRoastedCoffees: () => Promise<RoastedCoffee[]>;
  createRoastedCoffee: (props: CreateRoastedCoffeeProps) => Promise<void>;
  updateRoastedCoffee: (props: UpdateRoastedCoffeeProps) => Promise<void>;

  //RoastingProducts
  getRoastingProduct: (
    props: GetRoastingProductProps
  ) => Promise<RoastingProduct | undefined>;
  assignProductToRoastedCoffee: (
    props: AssignProductToRoastedCoffeeProps
  ) => Promise<void>;

  //Roastings
  getRoastingByOrder: (
    props: GetRoastingByOrderProps
  ) => Promise<Roasting | undefined>;
  getAllRoastings: () => Promise<Roasting[]>;
  createRoasting: (props: CreateRoastingProps) => Promise<void>;
  finishRoasting: () => Promise<void>;
  startRoasting: () => Promise<void>;
  selectOrdersRoasting: (props: SelectOrdersRoastingProps) => Promise<void>;
  reportRealYield: (props: ReportRealYieldProps) => Promise<void>;
  finishBatch: (props: FinishBatchProps) => Promise<void>;
}

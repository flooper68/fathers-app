export enum RoastingStatus {
  FINISHED = 'FINISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  PLANNED = 'PLANNED',
}

export interface RoastingGreenCoffee {
  id: number
  weight: number
  name: string
}

export interface RoastingRoastedCoffee {
  id: number
  weight: number
  name: string
  numberOfBatches: number
  finishedBatches: number
}

export interface Roasting {
  id: string
  schemaVersion: number
  status: RoastingStatus
  greenCoffee: RoastingGreenCoffee[]
  roastedCoffee: RoastingRoastedCoffee[]
  totalWeight: number
  orders: number[]
}

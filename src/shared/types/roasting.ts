export enum RoastingStatus {
  FINISHED = 'FINISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  FULL = 'FULL',
  IN_PLANNING = 'IN_PLANNING',
}

export interface RoastingGreenCoffee {
  id: number
  weight: number
  name: string
  batchWeight: number
  roastingLossFactor: number
}

export interface RoastingRoastedCoffee {
  id: number
  name: string
  numberOfBatches: number
  finishedBatches: number
  weight: number
  realYield: number
}

export interface Roasting {
  id: number
  schemaVersion: number
  status: RoastingStatus
  greenCoffee: RoastingGreenCoffee[]
  roastedCoffee: RoastingRoastedCoffee[]
  totalWeight: number
  orders: number[]
}

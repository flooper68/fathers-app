import { RoastedCoffeeMap, GreenCoffeeMap } from './roasting-settings'
import { RoastingStatus } from '../../shared/types/roasting'
import { RoastingModel } from './../models/roasting'
import { Logger } from '../../shared/logger'

export const getEmptyRoastingObject = () => {
  return {
    greenCoffee: Object.values(GreenCoffeeMap).map((greenCoffe) => ({
      ...greenCoffe,
      weight: 0,
    })),
    roastedCoffee: Object.values(RoastedCoffeeMap).map(
      ({ greenCoffeeId, ...roastedCoffee }) => ({
        ...roastedCoffee,
        weight: 0,
        numberOfBatches: 0,
        finishedBatches: 0,
        realYield: 0,
      })
    ),
    totalWeight: 0,

    orders: [] as number[],
  }
}

export type RoastingObject = ReturnType<typeof getEmptyRoastingObject>

export const mergeRoastingData = (
  memo: RoastingObject,
  roastingData: RoastingObject
): RoastingObject => {
  return {
    totalWeight: memo.totalWeight + roastingData.totalWeight,
    orders: [...memo.orders, ...roastingData.orders],
    greenCoffee: memo.greenCoffee.map((greenCoffee) => {
      const coffee = roastingData.greenCoffee.find(
        (item) => item.id === greenCoffee.id
      )

      if (!coffee) {
        throw new Error(`Invalid state - missing green coffee item for merge`)
      }
      return {
        ...greenCoffee,
        weight: greenCoffee.weight + coffee.weight,
      }
    }),
    roastedCoffee: memo.roastedCoffee.map((roastedCoffee) => {
      const coffee = roastingData.roastedCoffee.find(
        (item) => item.id === roastedCoffee.id
      )

      if (!coffee) {
        throw new Error(`Invalid state - missing roasted coffee item for merge`)
      }
      return {
        ...roastedCoffee,
        weight: roastedCoffee.weight + coffee.weight,
        numberOfBatches: roastedCoffee.numberOfBatches + coffee.numberOfBatches,
      }
    }),
  }
}

export const getNextPlannedRoasting = async () => {
  const roastings = await RoastingModel.find({
    status: RoastingStatus.IN_PLANNING,
  })

  if (roastings.length > 1) {
    throw new Error('There is more than one planned roasting')
  }

  let nextRoasting = roastings[0]

  if (!nextRoasting) {
    Logger.debug(`There is no planned roasting, creating new one`)
    nextRoasting = new RoastingModel(getEmptyRoastingObject())
    await nextRoasting.save()
  }

  return nextRoasting
}

export const closeRoastingPlanning = async () => {
  const roastings = await RoastingModel.find({
    status: RoastingStatus.IN_PLANNING,
  })

  if (roastings.length > 1) {
    throw new Error('There is more than one planned roasting')
  }

  const roastingsInProgress = await RoastingModel.find({
    status: RoastingStatus.IN_PROGRESS,
  })

  if (roastingsInProgress.length > 0) {
    throw new Error(
      'Can not close roasting plannaning, old roasting is still in progress'
    )
  }

  Logger.info(`Closing planning for roasting ${roastings[0].id}`)

  const closedRoasting = roastings[0]
  await closedRoasting.updateOne({ status: RoastingStatus.IN_PROGRESS })

  const nextRoasting = new RoastingModel(getEmptyRoastingObject())
  await nextRoasting.save()

  Logger.info(`Created new roasting in planning ${nextRoasting.id} `)
}

export const finishRoasting = async () => {
  const roastings = await RoastingModel.find({
    status: RoastingStatus.IN_PROGRESS,
  })

  if (roastings.length > 1) {
    throw new Error('There is more than one roasting in progress')
  }

  Logger.info(`Finished roasting ${roastings[0].id}`)
  const finishedRoasting = roastings[0]
  await finishedRoasting.updateOne({ status: RoastingStatus.FINISHED })
}

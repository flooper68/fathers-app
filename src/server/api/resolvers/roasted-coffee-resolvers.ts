import { RoastedCoffeeMap } from '../../domain/roasting-settings'
import { getGreenCoffee } from './green-coffee-resolvers'

export const getRoastedCoffee = async (id: number) => {
  const item = Object.values(RoastedCoffeeMap).find((item) => item.id === id)

  if (!item) {
    return undefined
  }
  return {
    ...item,
    greenCoffee: () => getGreenCoffee(item.greenCoffeeId),
  }
}

export const getRoastedCoffees = async () => {
  return Object.values(RoastedCoffeeMap).map((coffee) => {
    return {
      ...coffee,
      greenCoffee: () => getGreenCoffee(coffee.greenCoffeeId),
    }
  })
}

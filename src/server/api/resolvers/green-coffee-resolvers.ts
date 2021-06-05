import {
  GreenCoffeeMap,
  RoastedCoffeeMap,
} from '../../domain/roasting-settings'

export const getGreenCoffee = async (id: number) => {
  const greenCoffee = Object.values(GreenCoffeeMap).find(
    (item) => item.id === id
  )

  return {
    ...greenCoffee,
    roastedCoffees: () => getGreenCoffeesRoastedCoffees(id),
  }
}

export const getGreenCoffeesRoastedCoffees = async (greenCoffeeId: number) => {
  return Object.values(RoastedCoffeeMap)
    .filter((item) => item.greenCoffeeId === greenCoffeeId)
    .map((coffee) => {
      return {
        ...coffee,
        greenCoffee: () => getGreenCoffee(coffee.greenCoffeeId),
      }
    })
}

export const getGreenCoffees = async () => {
  return Object.values(GreenCoffeeMap).map((coffee) => {
    return {
      ...coffee,
      roastedCoffees: () => getGreenCoffeesRoastedCoffees(coffee.id),
    }
  })
}

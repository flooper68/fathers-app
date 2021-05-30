import { GreenCoffee } from './../../shared/types/green-coffee'
import { RoastedCoffee } from './../../shared/types/roasted-coffee'

export const GreenCoffeeMap: Record<number, GreenCoffee> = {
  [1]: { id: 1, name: 'Kolumbie - La Colombia' },
  [2]: { id: 2, name: 'Peru - El Paraiso' },
  [3]: { id: 3, name: 'Brazílie - PAUBRASIL' },
  [4]: { id: 4, name: 'Kolumbie - Canas Gordas' },
  [5]: { id: 5, name: 'Brazilie - Manga larga' },
  [6]: { id: 6, name: 'Brazilie - Cafeina' },
}

export const BATCH_SIZE = 2

export const RoastedCoffeeMap: Record<number, RoastedCoffee> = {
  [1]: { id: 1, name: 'Kolumbie - La Colombia Filtr', greenCoffeeId: 1 },
  [2]: { id: 2, name: 'Kolumbie - La Colombia Espresso', greenCoffeeId: 1 },
  [3]: { id: 3, name: 'Peru - El Paraiso Filtr', greenCoffeeId: 2 },
  [4]: { id: 4, name: 'Peru - El Paraiso Espresso', greenCoffeeId: 2 },
  [5]: { id: 5, name: 'Brazílie - PAUBRASIL Espresso', greenCoffeeId: 3 },
  [6]: { id: 6, name: 'Kolumbie - Canas Gordas Filtr', greenCoffeeId: 4 },
  [7]: { id: 7, name: 'Kolumbie - Canas Gordas Espresso', greenCoffeeId: 4 },
  [8]: { id: 8, name: 'Brazilie - Manga larga Filtr', greenCoffeeId: 5 },
  [9]: { id: 9, name: 'Brazilie - Manga larga Espresso', greenCoffeeId: 5 },
  [10]: { id: 10, name: 'Brazilie - Cafeina Espresso', greenCoffeeId: 6 },
}

//This will be in Product as attribute
export const RoastedCoffeeProductMap = {
  [13277]: 1, // Kolumbie - La Colombia Filtr, Káva
  [13286]: 2, // Kolumbie - La Colombia Espresso, Káva
  [9318]: 3, // Peru - El Paraiso Filtr, Káva
  [9331]: 4, // Peru - El Paraiso Filtr, Káva
  [4135]: 5, // Brazílie - PAUBRASIL Espresso
  [13234]: 6, //Kolumbie - Canas Gordas Filtr
  [13268]: 7, // Kolumbie - Canas Gordas Espresso
  [12955]: 8, // Brazilie - Manga larga Filtr
  [12930]: 9, // Brazilie - Manga larga Espresso
  [12994]: 10, // Brazilie - Cafeina Espresso
}

import { gql } from '@apollo/client';

export const ProductListQuery = gql`
  query GetProducts {
    products {
      id
      name
      roastedCoffeeId
      roastedCoffeeName
      description
      shortDescription
      dateModified
      categories {
        id
        name
      }
      images {
        id
        src
        name
      }
      variations {
        weight
      }
    }
  }
`;

export interface ProductListItem {
  id: number;
  name: string;
  roastedCoffeeId: string;
  roastedCoffeeName: string;
  description: string;
  shortDescription: string;
  dateModified: string;
  categories: {
    id: number;
    name: string;
  }[];
  images: {
    id: number;
    src: string;
    name: string;
  }[];
  variations: { weight: number }[];
}

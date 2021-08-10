import { gql } from '@apollo/client';

export const ProductListQuery = gql`
  query GetProducts {
    products {
      id
      name
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
      roastedCoffee {
        name
      }
    }
  }
`;

export interface ProductListItem {
  id: number;
  name: string;
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
  roastedCoffee: { name: string };
}

import { Category } from '../../shared/types/category'
import { DocumentWithSchemaVersion } from './general'

export interface WooCommerceCategoryResponse {
  id: number
  name: string
  description: string
}

export interface CategoryDocument extends DocumentWithSchemaVersion, Category {}

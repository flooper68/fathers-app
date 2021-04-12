import { Document } from 'mongoose'

export interface DocumentWithSchemaVersion extends Document {
  id: number
  schemaVersion: number
}

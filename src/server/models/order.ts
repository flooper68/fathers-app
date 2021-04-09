import moongose, { Schema } from 'mongoose'

const orderSchema = new Schema({
  _id: { type: Number },
  number: { type: Number, required: true },
  date_created: { type: Date, required: true },
  date_modified: { type: Date, required: true },
  status: { type: String, required: true },
  currency: { type: String, required: true },
  product: { type: Number, ref: 'Products' },
})

orderSchema.virtual('items', {
  ref: 'LineItem',
  localField: '_id',
  foreignField: 'order',
})

orderSchema.set('toObject', { virtuals: true })
orderSchema.set('toJSON', { virtuals: true })

export const OrderModel = moongose.model('Order', orderSchema)

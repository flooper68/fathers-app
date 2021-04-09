import moongose, { Schema } from 'mongoose'

const lineItemSchema = new Schema({
  _id: { type: Number },
  order: { type: Number, required: true },
  name: { type: String, required: true },
  product_id: { type: Number, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
})

lineItemSchema.virtual('order_item', {
  ref: 'Order',
  localField: 'order',
  foreignField: '_id',
  justOne: false,
})

lineItemSchema.set('toObject', { virtuals: true })
lineItemSchema.set('toJSON', { virtuals: true })

export const LineItemModel = moongose.model('LineItem', lineItemSchema)

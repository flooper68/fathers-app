import moongose, { Schema } from 'mongoose';

import { Order } from '../../../../shared/types/order';
import { DocumentWithSchemaVersion } from '../../../types/general';

export interface OrderDocument
  extends Omit<Order, 'id'>,
    DocumentWithSchemaVersion {}

const orderSchema = new Schema<OrderDocument>({
  id: { type: Number, required: true },
  number: { type: Number, required: true },
  dateCreated: { type: String, required: true },
  dateModified: { type: String, required: true },
  status: { type: String, required: true },
  roastingId: { type: String },
  roasted: { type: Boolean, required: true, default: false },
  lineItems: [
    new Schema({
      id: { type: Number, required: true },
      name: { type: String },
      productName: { type: String },
      productId: { type: Number, required: true },
      variationId: { type: Number, required: true },
      quantity: { type: Number, required: true },
    }),
  ],
});

export const OrderModel = moongose.model<OrderDocument>('Order', orderSchema);

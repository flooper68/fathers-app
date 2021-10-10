import { OrderDocument, OrderModel } from './repository/order-model';

const mapOrderToDTO = (item: OrderDocument) => {
  return {
    id: item.id,
    number: item.number,
    status: item.status,
    dateCreated: item.dateCreated,
    dateModified: item.dateModified,
    lineItems: item.lineItems.map((lineItem) => {
      return {
        id: lineItem.id,
        name: lineItem.name,
        productName: lineItem.productName,
        productId: lineItem.productId,
        variationId: lineItem.variationId,
        quantity: lineItem.quantity,
      };
    }),
  };
};

const getOrder = async (id: number) => {
  const item = await OrderModel.findById(id);
  if (!item) {
    return;
  }
  return mapOrderToDTO(item);
};

const getOrders = async (params: { page: number }) => {
  const page = params.page || 1;
  const PAGE_SIZE = 100;

  const entities = await OrderModel.find()
    .sort({ number: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE);

  const count = await OrderModel.estimatedDocumentCount();

  return {
    page,
    pageCount: Math.ceil(count / PAGE_SIZE),
    rows: entities.map(mapOrderToDTO),
  };
};

const getOrdersByIds = async (ids: number[]) => {
  const orders = await OrderModel.find({ id: { $in: ids } });
  return orders.map(mapOrderToDTO);
};

export const buildSalesModule = () => {
  return { getOrder, getOrders, getOrdersByIds };
};

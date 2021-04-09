import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import { config } from 'dotenv'

import {
  Product,
  WooCommerceProductResponse,
} from './../../shared/types/product'
import { Order, WooCommerceOrderResponse } from './../../shared/types/order'
import {
  Category,
  WooCommerceCategoryResponse,
} from './../../shared/types/category'
import { Logger } from '../../shared/logger'
import moment from 'moment'
import {
  LineItem,
  LineItemWooCommerceResponse,
} from '../../shared/types/line-item'

config()

const ITEMS_PER_PAGE = 100

interface WooCommerceApi {
  get: <Data>(
    url: string
  ) => Promise<{ data: Data; headers: { [key: string]: string } }>
}

const getCounts = (headers: { [key: string]: string }) => {
  const totalCount = headers['x-wp-total']
  const pagesCount = headers['x-wp-totalpages']

  return { totalCount, pagesCount }
}

const mapProduct = (item: WooCommerceProductResponse): Product => ({
  name: item.name,
  id: item.id,
  date_modified: item.date_modified,
})

const mapLineItem = (order: number) => (
  item: LineItemWooCommerceResponse
): LineItem => ({
  id: item.id,
  name: item.name,
  product_id: item.product_id,
  quantity: item.quantity,
  price: item.price,
  total: item.total,
  order,
})

const mapOrder = (item: WooCommerceOrderResponse): Order => ({
  number: item.number,
  id: item.id,
  date_modified: item.date_modified,
  date_created: item.date_created,
  status: item.status,
  currency: item.currency,
  line_items: item.line_items.map(mapLineItem(item.id)),
})

const mapCategory = (item: WooCommerceCategoryResponse): Category => ({
  id: item.id,
  name: item.name,
  description: item.description,
})

const buildGetAllItems = <Entity, EntityWooCommerceResponse>(
  client: WooCommerceApi,
  url: string,
  mappingFunction: (data: EntityWooCommerceResponse) => Entity
) => async () => {
  let allData: Entity[] = []

  Logger.debug('Fetching initial page.')
  const { data, headers } = await client.get<EntityWooCommerceResponse[]>(
    `${url}?page=1&per_page=${ITEMS_PER_PAGE}`
  )
  const { totalCount, pagesCount } = getCounts(headers)
  Logger.debug(`Total pages count ${pagesCount}`)

  allData = [...allData, ...data.map(mappingFunction)]
  let page = 2
  while (page <= parseInt(pagesCount, 10)) {
    Logger.debug(`Fetching page ${page} of ${pagesCount}`)
    const { data } = await client.get<EntityWooCommerceResponse[]>(
      `${url}?page=${page}&per_page=${ITEMS_PER_PAGE}`
    )
    allData = [...allData, ...data.map(mappingFunction)]
    page++
  }

  return { rows: allData, totalCount, pagesCount }
}

const buildGetAllItemsAfterDate = <Entity, EntityWooCommerceResponse>(
  client: WooCommerceApi,
  url: string,
  mappingFunction: (data: EntityWooCommerceResponse) => Entity
) => async (afterDate: string) => {
  let allData: Entity[] = []

  Logger.debug('Fetching initial page.')
  const { data, headers } = await client.get<EntityWooCommerceResponse[]>(
    `${url}?page=1&per_page=${ITEMS_PER_PAGE}&after=${afterDate}`
  )
  const { totalCount, pagesCount } = getCounts(headers)
  Logger.debug(`Total pages count ${pagesCount}`)

  allData = [...allData, ...data.map(mappingFunction)]
  let page = 2
  while (page <= parseInt(pagesCount, 10)) {
    Logger.debug(`Fetching page ${page} of ${pagesCount}`)
    const { data } = await client.get<EntityWooCommerceResponse[]>(
      `${url}?page=${page}&per_page=${ITEMS_PER_PAGE}&after=${afterDate}`
    )
    allData = [...allData, ...data.map(mappingFunction)]
    page++
  }

  return { rows: allData, totalCount, pagesCount }
}

const buildGetItemsPage = <Entity, EntityWooCommerceResponse>(
  client: WooCommerceApi,
  url: string,
  mappingFunction: (data: EntityWooCommerceResponse) => Entity
) => async (page: number) => {
  const { data, headers } = await client.get<EntityWooCommerceResponse[]>(
    `${url}?page=${page}&per_page=${ITEMS_PER_PAGE}`
  )

  const { totalCount, pagesCount } = getCounts(headers)

  return { rows: data.map(mappingFunction), totalCount, pagesCount }
}

const buildGetItem = <Entity, EntityWooCommerceResponse>(
  client: WooCommerceApi,
  url: string,
  mappingFunction: (data: EntityWooCommerceResponse) => Entity
) => async (id: number) => {
  const { data } = await client.get<EntityWooCommerceResponse>(`${url}/${id}`)

  return mappingFunction(data)
}

export const builWooCommerceClient = async () => {
  const client: WooCommerceApi = new WooCommerceRestApi({
    url: process.env.WOOCOMMERCE_URL,
    consumerKey: process.env.WOOCOMMERCE_KEY,
    consumerSecret: process.env.WOOCOMMERCE_SECRET,
    version: 'wc/v3',
  })

  try {
    await client.get('')
    Logger.info(`Connected to WooCommerce ${process.env.WOOCOMMERCE_URL}`)
  } catch (e) {
    Logger.error('Can not connect to woocommerce', e)
    throw new Error('Can not establish WooCommerce connection.')
  }

  return {
    getProduct: buildGetItem(client, 'products', mapProduct),
    getProducts: buildGetItemsPage(client, 'products', mapProduct),
    getAllProducts: buildGetAllItems(client, 'products', mapProduct),
    getOrder: buildGetItem(client, 'orders', mapOrder),
    getOrders: buildGetItemsPage(client, 'orders', mapOrder),
    getAllOrdersAfterDate: buildGetAllItemsAfterDate(
      client,
      'orders',
      mapOrder
    ),
    getAllOrdersFromThisWeek: () =>
      buildGetAllItemsAfterDate(
        client,
        'orders',
        mapOrder
      )(moment().startOf('week').toISOString()),
    getCategory: buildGetItem(client, 'products/categories', mapCategory),
    getAllCategories: buildGetAllItems(
      client,
      'products/categories',
      mapCategory
    ),
  }
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export type WooCommerceClient = ThenArg<
  ReturnType<typeof builWooCommerceClient>
>

import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import { config } from 'dotenv'
import moment from 'moment'
import query from 'query-string'

import { Logger } from '../../shared/logger'
import { WooCommerceOrderResponse } from '../../shared/types/order'
import {
  WooCommerceProductResponse,
  WooCommerceProductVariationResponse,
} from '../../shared/types/product'

config()

const ITEMS_PER_PAGE = 100

interface WooCommerceApi {
  get: <Data>(
    url: string
  ) => Promise<{ data: Data; headers: { [key: string]: string } }>
}

const getCounts = (headers: { [key: string]: string }) => {
  const totalCount = parseInt(headers['x-wp-total'])
  const pagesCount = parseInt(headers['x-wp-totalpages'])

  return { totalCount, pagesCount }
}

const buildGetAllItems = <EntityWooCommerceResponse>(
  client: WooCommerceApi,
  url: string
) => async (queryParams?: Record<string, string>) => {
  let allData: EntityWooCommerceResponse[] = []

  Logger.debug('Fetching initial page.')
  const { data, headers } = await client.get<EntityWooCommerceResponse[]>(
    `${url}?page=1&per_page=${ITEMS_PER_PAGE}&${query.stringify(queryParams)}`
  )
  const { totalCount, pagesCount } = getCounts(headers)
  Logger.debug(`Total pages count ${pagesCount}`)

  allData = [...allData, ...data]
  let page = 2
  while (page <= pagesCount) {
    Logger.debug(`Fetching page ${page} of ${pagesCount}`)
    const { data } = await client.get<EntityWooCommerceResponse[]>(
      `${url}?page=${page}&per_page=${ITEMS_PER_PAGE}&${query.stringify(
        queryParams
      )}`
    )
    allData = [...allData, ...data]
    page++
  }

  return { rows: allData, totalCount, pagesCount }
}

export const buildWooCommerceClient = async () => {
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
    getAllProducts: buildGetAllItems<WooCommerceProductResponse>(
      client,
      'products'
    ),
    getAllProductVariations: (id: number) =>
      buildGetAllItems<WooCommerceProductVariationResponse>(
        client,
        `products/${id}/variations`
      )(),
    getAllOrdersAfterDate: (after?: string) =>
      buildGetAllItems<WooCommerceOrderResponse>(client, 'orders')({ after }),
    getAllOrdersFromThisWeek: () =>
      buildGetAllItems<WooCommerceOrderResponse>(
        client,
        'orders'
      )({ after: moment().startOf('week').toISOString() }),
  }
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export type WooCommerceClient = ThenArg<
  ReturnType<typeof buildWooCommerceClient>
>

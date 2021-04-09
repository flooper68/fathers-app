import React, { useEffect, useState } from 'react'

import { Logger } from '../../shared/logger'
import { useApiClient } from '../api/api-client'

const ProductItem = (props: { id: number; name: string }) => {
  const { id, name } = props

  return (
    <div style={{ minHeight: 40 }}>
      Id: {id} Name: {name}
    </div>
  )
}

export const Products = () => {
  const [rows, setRows] = useState<any[]>([])

  const apiClient = useApiClient()

  useEffect(() => {
    apiClient.getProducts().then((result) => {
      Logger.debug(result.data.products)
      setRows(result.data.products)
    })
  }, [apiClient])

  return (
    <div
      style={{
        padding: 25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        overflow: 'auto',
        height: '100%',
      }}
    >
      <h2>Products</h2>
      {rows.map((row) => (
        <ProductItem key={row.id} id={row.id} name={row.name} />
      ))}
    </div>
  )
}

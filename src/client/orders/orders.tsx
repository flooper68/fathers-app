import React, { useEffect, useState } from 'react'

import { Logger } from '../../shared/logger'
import { useApiClient } from '../api/api-client'

const OrdertItem = (props: { id: number; number: string; status: string }) => {
  const { id, number, status } = props

  return (
    <div style={{ minHeight: 40 }}>
      Id: {id} Number: {number} Status: {status}
    </div>
  )
}

export const Orders = () => {
  const [rows, setRows] = useState<any[]>([])

  const apiClient = useApiClient()

  useEffect(() => {
    apiClient.getOrders().then((result) => {
      Logger.debug(result.data.orders)
      setRows(result.data.orders)
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
      <h2>Categories</h2>
      {rows.map((row) => (
        <OrdertItem
          key={row.id}
          id={row.id}
          number={row.number}
          status={row.status}
        />
      ))}
    </div>
  )
}

import React, { useEffect, useState } from 'react'

import { Logger } from '../../shared/logger'
import { useApiClient } from '../api/api-client'

const CategorytItem = (props: { id: number; name: string }) => {
  const { id, name } = props

  return (
    <div style={{ minHeight: 40 }}>
      Id: {id} Name: {name}
    </div>
  )
}

export const Categories = () => {
  const [rows, setRows] = useState<any[]>([])

  const apiClient = useApiClient()

  useEffect(() => {
    apiClient.getCategories().then((result) => {
      Logger.debug(result.data.categories)
      setRows(result.data.categories)
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
        <CategorytItem key={row.id} id={row.id} name={row.name} />
      ))}
    </div>
  )
}

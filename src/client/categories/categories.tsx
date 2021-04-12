import { Table } from 'antd'
import React, { useEffect, useState } from 'react'

import { Logger } from '../../shared/logger'
import { useApiClient } from '../api/api-client'

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Název',
    dataIndex: 'name',
    key: 'name',
  },
]

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
      <Table
        rowKey="id"
        columns={columns}
        dataSource={rows}
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
        pagination={false}
        sticky={true}
      />
    </div>
  )
}

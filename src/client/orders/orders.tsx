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
    title: 'Číslo',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
]

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

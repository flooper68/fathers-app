import React, { useCallback, useEffect, useState } from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { Switch, Route, useLocation, useHistory } from 'react-router-dom'
import { Button, Dropdown, Layout, Menu, notification, PageHeader } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'

const { Header, Sider, Content } = Layout

import { Navigation } from './navigation'
import { Products } from '../products/products'
import { ApiClientContext, useBuildApiClient } from '../api/api-client'
import { Orders } from '../orders/orders'
import { Roastings } from '../roasting/roasting'
import moment from 'moment'
import { Logger } from '../../shared/logger'

const apolloClient = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})

const titleMap: { [key: string]: string } = {
  '/': 'Pražení',
  '/products': 'Produkty',
  '/orders': 'Objednávky',
}

const subTitleMap: { [key: string]: string } = {
  '/': '',
  '/products': 'Zde vidíte vše o produktech.',
  '/orders': 'Zde vidíte vše o objednávkách.',
}

const notifyOrdersAdded = () => {
  notification.open({
    message: 'Přibyly nové objednávky',
  })
}

const notifySyncError = (message: string) => {
  notification.error({
    message: 'Došlo k chybě při synchronizaci',
    description: message,
    duration: 0,
  })
}

export const Root: React.FunctionComponent = () => {
  const [lastSync, setLastSync] = useState('')
  const [syncInProgress, setSyncInProgress] = useState(false)
  const [productSyncInProgress, setproductSyncInProgress] = useState(false)
  const [lastSyncDataVersion, setLastSyncDataVersion] = useState(0)

  const apiClient = useBuildApiClient(apolloClient)
  const location = useLocation()
  const history = useHistory()

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<LogoutOutlined />}>
        Odhlásit se
      </Menu.Item>
    </Menu>
  )

  const title = titleMap[location.pathname]
  const subTitle = subTitleMap[location.pathname]

  const onBack = useCallback(() => {
    history.push('/')
  }, [history])

  useEffect(() => {
    apiClient.getSyncState().then((state) => {
      setLastSync(moment(state.data.sync.lastOrderSyncTime).format('LLL'))
    })
    let dataVersion = 0
    let errorOccured = false

    setInterval(() => {
      Logger.debug(`Syncing state`)
      apiClient.getSyncState().then((state) => {
        setLastSync(moment(state.data.sync.lastOrderSyncTime).format('LLL'))
        setSyncInProgress(state.data.sync.orderSyncInProgress)
        setproductSyncInProgress(state.data.sync.productSyncInProgress)

        if (state.data.sync.orderSyncDataVersion !== dataVersion) {
          dataVersion = state.data.sync.orderSyncDataVersion
          setLastSyncDataVersion(state.data.sync.orderSyncDataVersion)
          notifyOrdersAdded()
        }

        if (state.data.sync.orderSyncError && !errorOccured) {
          errorOccured = true
          notifySyncError(
            state.data.sync?.orderSyncErrorMessage || 'There is no message'
          )
        }
      })
    }, 5000)
  }, [apiClient])

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <ApiClientContext.Provider value={apiClient}>
        <Layout>
          <Sider theme="light">
            <Navigation />
          </Sider>
          <Layout>
            <Header
              style={{
                background: 'white',
                height: 72,
                padding: '0 25px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <PageHeader
                className="site-page-header"
                style={{ width: 600 }}
                backIcon={location.pathname !== '/' ? undefined : false}
                onBack={onBack}
                title={title}
                subTitle={subTitle}
              />

              <span>
                <span style={{ marginRight: 25 }}>
                  Objednávky synchronizovány: {lastSync}
                </span>
                {syncInProgress && (
                  <span style={{ marginRight: 25 }}>Syncing...</span>
                )}
                <Dropdown overlay={menu} placement="bottomLeft">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<UserOutlined />}
                  />
                </Dropdown>
              </span>
            </Header>
            <Content>
              <Switch>
                <Route path="/products">
                  <Products syncInProgress={productSyncInProgress} />
                </Route>
                <Route path="/Orders">
                  <Orders />
                </Route>
                <Route path="/">
                  <Roastings />
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </ApiClientContext.Provider>
    </div>
  )
}

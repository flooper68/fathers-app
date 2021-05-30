import React, { useCallback } from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { Switch, Route, useLocation, useHistory } from 'react-router-dom'
import { Button, Dropdown, Layout, Menu, PageHeader } from 'antd'

const { Header, Sider, Content } = Layout

import { Navigation } from './navigation'
import { Products } from '../products/products'
import { ApiClientContext, useBuildApiClient } from '../api/api-client'
import { Orders } from '../orders/orders'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import Title from 'antd/lib/typography/Title'

const apolloClient = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
})

const titleMap: { [key: string]: string } = {
  '/': 'Domů',
  '/products': 'Produkty',
  '/categories': 'Kategorie',
  '/orders': 'Objednávky',
}

const subTitleMap: { [key: string]: string } = {
  '/': 'Vítejte zpět',
  '/products': 'Zde vidíte vše o WooCommerce produktech.',
  '/categories': 'Zde vidíte vše o WooCommerce kategoriích.',
  '/orders': 'Zde vidíte vše o WooCommerce objednávkách.',
}

export const Root: React.FunctionComponent = () => {
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

              <Dropdown overlay={menu} placement="bottomLeft">
                <Button type="primary" shape="circle" icon={<UserOutlined />} />
              </Dropdown>
            </Header>
            <Content>
              <Switch>
                <Route path="/products">
                  <Products />
                </Route>
                <Route path="/Orders">
                  <Orders />
                </Route>
                <Route path="/">
                  <Title
                    level={4}
                    style={{
                      height: 72,
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      paddingLeft: 25,
                    }}
                  >
                    Vítejte
                  </Title>
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </ApiClientContext.Provider>
    </div>
  )
}

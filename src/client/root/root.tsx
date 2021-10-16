import React, { useCallback } from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import { Button, Dropdown, Layout, Menu, PageHeader, Spin } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';

import { Navigation } from './navigation';
import { Products } from '../modules/products/products';
import { ApiClientContext, useBuildApiClient } from '../api/api-client';
import { Orders } from '../modules/orders/orders';
import { Roastings } from '../modules/roasting/roasting';
import {
  useAppSync,
  getOrderLastSyncDate,
  getOrderSyncInProgress,
} from './sync';
import { useAppSelector } from '../store';
import { Settings } from '../modules/settings/settings';
import { VersionTag } from './version-tag';
import { Warehouse } from '../modules/warehouse/warehouse';

const { Header, Sider, Content } = Layout;

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
});

const titleMap: { [key: string]: string } = {
  '/': 'Pražení',
  '/products': 'Produkty',
  '/orders': 'Objednávky',
  '/settings': 'Nastavení Káv',
  '/warehouse': 'Sklad',
};

const subTitleMap: { [key: string]: string } = {
  '/': '',
  '/products': 'Zde vidíte vše o produktech.',
  '/orders': 'Zde vidíte vše o objednávkách.',
  '/settings': 'Zde můžete nastavit detaily o pražení.',
  '/warehouse': 'Aktuální hodnoty ve skladu.',
};

export const Root: React.FunctionComponent = () => {
  const orderLastSyncDate = useAppSelector(getOrderLastSyncDate);
  const orderSyncInProgress = useAppSelector(getOrderSyncInProgress);

  const apiClient = useBuildApiClient(apolloClient);
  const location = useLocation();
  const history = useHistory();

  useAppSync(apiClient);

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<LogoutOutlined />}>
        Odhlásit se
      </Menu.Item>
    </Menu>
  );

  const title = titleMap[location.pathname];
  const subTitle = subTitleMap[location.pathname];

  const onBack = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <VersionTag />
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
                  {orderLastSyncDate &&
                    `Poslední sync: ${moment(orderLastSyncDate).format('LLL')}`}
                </span>
                {orderSyncInProgress && (
                  <span style={{ marginRight: 25 }}>
                    <Spin />
                  </span>
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
                <Route path="/settings">
                  <Settings />
                </Route>
                <Route path="/products">
                  <Products />
                </Route>
                <Route path="/Orders">
                  <Orders />
                </Route>
                <Route path="/warehouse">
                  <Warehouse />
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
  );
};

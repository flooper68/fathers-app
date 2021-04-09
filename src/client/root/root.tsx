import React from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { Navigation } from './navigation'
import { Products } from '../products/products'
import { ApiClientContext, useBuildApiClient } from '../api/api-client'
import { Categories } from '../categories/categories'
import { Orders } from '../orders/orders'

const apolloClient = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
})

export const Root: React.FunctionComponent = () => {
  const apiClient = useBuildApiClient(apolloClient)

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <Router>
        <ApiClientContext.Provider value={apiClient}>
          <Navigation />
          <Switch>
            <Route path="/products">
              <Products />
            </Route>
            <Route path="/categories">
              <Categories />
            </Route>
            <Route path="/Orders">
              <Orders />
            </Route>
            <Route path="/">Welcome</Route>
          </Switch>
        </ApiClientContext.Provider>
      </Router>
    </div>
  )
}

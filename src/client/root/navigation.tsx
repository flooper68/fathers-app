import React from 'react'
import { Link } from 'react-router-dom'

const NavigationItem = (props: { url: string; title: string }) => {
  const { url, title } = props

  return (
    <div style={{ height: 50 }}>
      <Link to={url}>{title}</Link>
    </div>
  )
}

export const Navigation = () => {
  return (
    <div
      style={{
        width: 150,
        display: 'flex',
        flexDirection: 'column',
        alignItems: ' center',
        padding: 25,
      }}
    >
      <NavigationItem url="/products" title="Products" />
      <NavigationItem url="/categories" title="Categories" />
      <NavigationItem url="/orders" title="Orders" />
    </div>
  )
}

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import {
  WalletOutlined,
  FolderOutlined,
  UnorderedListOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import Title from 'antd/lib/typography/Title'

const locationKeyMap: Record<string, string> = {
  '/': '1',
  '/products': '2',
  '/categories': '3',
  '/orders': '4',
}

export const Navigation = () => {
  const location = useLocation()

  return (
    <div>
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
        Father´s Coffee
      </Title>
      <Menu
        defaultSelectedKeys={[locationKeyMap[location.pathname]]}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="light"
      >
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="">Domů</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UnorderedListOutlined />}>
          <Link to="products">Produkty</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<FolderOutlined />}>
          <Link to="categories">Kategorie</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<WalletOutlined />}>
          <Link to="orders">Objednávky</Link>
        </Menu.Item>
      </Menu>
    </div>
  )
}

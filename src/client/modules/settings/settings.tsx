import { Button, Tabs } from 'antd';
import React, { useState } from 'react';

import { GreenCoffee } from './green-coffee';
import { RoastedCoffee } from './roasted-coffee';

const { TabPane } = Tabs;

export const Settings = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('1');

  return (
    <div style={{ padding: '8px 25px' }}>
      <Tabs
        defaultActiveKey="1"
        tabBarExtraContent={
          <Button onClick={() => setModalOpened(true)}>Přidat</Button>
        }
        onChange={(key) => setActiveTab(key)}
      >
        <TabPane tab="Zelená káva" key="1">
          <GreenCoffee
            modalOpened={modalOpened && activeTab === '1'}
            onModalClose={() => setModalOpened(false)}
            onOpenModal={() => setModalOpened(true)}
          />
        </TabPane>
        <TabPane tab="Pražená káva" key="2">
          <RoastedCoffee
            modalOpened={modalOpened && activeTab === '2'}
            onModalClose={() => setModalOpened(false)}
            onOpenModal={() => setModalOpened(true)}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

import { notification, Tabs } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { RoastingStatus } from '../../../shared/types/roasting';
import { useApiClient } from '../../api/api-client';
import { RoastingListItem } from '../../api/queries/get-roastings-query';
import { PlannedRoasting } from './planned-roasting';
import { RoastingsList } from './roasting-list';
import { ActiveRoasting } from './active-roasting';
import { ClientLogger } from '../../client-logger';

export const Roastings = () => {
  const [plannedRoasting, setPlannedRoasting] =
    useState<RoastingListItem | null>(null);
  const [currentRoasting, setCurrentRoasting] =
    useState<RoastingListItem | null>(null);
  const [roastings, setRoastings] = useState<RoastingListItem[]>([]);

  const apiClient = useApiClient();

  const getRoastingData = useCallback(async () => {
    try {
      const result = await apiClient.getRoastings();

      const roastingInProgress = result.data.roastings.find(
        (item) => item.status === RoastingStatus.IN_PROGRESS
      );
      const plannedRoasting = result.data.roastings
        .sort((a, b) => a.roastingDate.localeCompare(b.roastingDate))
        .find((item) => item.status === RoastingStatus.IN_PLANNING);

      setRoastings(result.data.roastings);
      setPlannedRoasting(plannedRoasting || null);
      setCurrentRoasting(roastingInProgress || null);
    } catch (e) {
      notification.error({
        message: 'Chyba při načítání dat',
      });
      ClientLogger.error(`Error loading data`, e);
    }
  }, [apiClient]);

  const onFinishRoasting = useCallback(async () => {
    try {
      await apiClient.finishRoasting();
      await getRoastingData();
    } catch (e) {
      notification.error({
        message: 'Nastala chyba při ukládání dat',
      });
      ClientLogger.error(`Error finishing roasting`, e);
    }
  }, [apiClient, getRoastingData]);

  const onFinishBatch = useCallback(
    async (roastedCoffeeId: number) => {
      try {
        await apiClient.finishBatch(roastedCoffeeId);
        await getRoastingData();
        notification.error({
          message: 'Nastala chyba při ukládání dat',
        });
      } catch (e) {
        ClientLogger.error(`Error finishing roasting`, e);
      }
    },
    [apiClient, getRoastingData]
  );

  const onReportRealYield = useCallback(
    async (roastedCoffeeId: number, weight: number) => {
      try {
        await apiClient.reportRealYield(roastedCoffeeId, weight);
        await getRoastingData();
      } catch (e) {
        notification.error({
          message: 'Nastala chyba při ukládání dat',
        });
        ClientLogger.error(`Error reporting real yield roasting`, e);
      }
    },
    [apiClient, getRoastingData]
  );

  const onClosePlanning = useCallback(async () => {
    try {
      await apiClient.startRoasting();
      await getRoastingData();
    } catch (e) {
      notification.error({
        message: 'Nastala chyba při začínání pražení',
      });
      ClientLogger.error(`Error closing planning`, e);
    }
  }, [apiClient, getRoastingData]);

  const onCreateRoasting = useCallback(
    async (date: string) => {
      try {
        await apiClient.createRoasting(date);
        await getRoastingData();
      } catch (e) {
        notification.error({
          message: 'Nastala chyba při vytváření pražení',
        });
        ClientLogger.error(`Error creating planning`, e);
      }
    },
    [apiClient, getRoastingData]
  );

  useEffect(() => {
    try {
      getRoastingData();
    } catch (e) {
      notification.error({
        message: 'Chyba při načítání dat',
      });
      ClientLogger.error(`Error loading warehouse roasted coffee list`, e);
    }
  }, [getRoastingData]);

  return (
    <div
      style={{
        padding: `16px 25px`,
        width: `100%`,
        height: `100%`,
        overflow: 'auto',
      }}
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Aktivní pražení" key="1">
          <ActiveRoasting
            roasting={currentRoasting}
            onClosePlanning={onClosePlanning}
            onFinishRoasting={onFinishRoasting}
            onFinishBatch={onFinishBatch}
            onReportRealYield={onReportRealYield}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Plánované pražení" key="2">
          {plannedRoasting && <PlannedRoasting roasting={plannedRoasting} />}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Seznam" key="3">
          <RoastingsList
            roastings={roastings}
            onCreateRoasting={onCreateRoasting}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

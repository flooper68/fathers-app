import { Tabs } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { Logger } from '../../shared/logger'
import { RoastingStatus } from '../../shared/types/roasting'
import { useApiClient } from '../api/api-client'
import { RoastingListItem } from '../api/graphql-queries'

import { RoastingsList } from './roasting-list'
import { ActiveRoasting, PlannedRoasting } from './roasting-page'

export const Roastings = () => {
  const [
    plannedRoasting,
    setPlannedRoasting,
  ] = useState<RoastingListItem | null>(null)
  const [
    currentRoasting,
    setCurrentRoasting,
  ] = useState<RoastingListItem | null>(null)
  const [roastings, setRoastings] = useState<RoastingListItem[]>([])

  const apiClient = useApiClient()

  const getRoastingData = useCallback(async () => {
    const result = await apiClient.getRoastings()

    const roastingInProgress = result.data.roastings.find(
      (item) => item.status === RoastingStatus.IN_PROGRESS
    )
    const plannedRoasting = result.data.roastings.find(
      (item) => item.status === RoastingStatus.IN_PLANNING
    )
    if (!plannedRoasting) {
      throw new Error(`Invalid state - missing planned roasting`)
    }

    setRoastings(result.data.roastings)
    setPlannedRoasting(plannedRoasting)
    roastingInProgress && setCurrentRoasting(roastingInProgress)
  }, [apiClient])

  const onFinishRoasting = useCallback(async () => {
    try {
      await apiClient.finishRoasting()
      setCurrentRoasting(null)
    } catch (e) {
      Logger.error(`Error finishing roasting`, e)
    }
  }, [apiClient])

  const onClosePlanning = useCallback(async () => {
    try {
      await apiClient.closePlanning()
      await getRoastingData()
    } catch (e) {
      Logger.error(`Error closing planning`, e)
    }
  }, [apiClient, getRoastingData])

  useEffect(() => {
    getRoastingData()
  }, [getRoastingData])

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
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Plánované pražení" key="2">
          {plannedRoasting && <PlannedRoasting roasting={plannedRoasting} />}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Seznam" key="3">
          <RoastingsList roastings={roastings} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

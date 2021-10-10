import { Button, InputNumber } from 'antd';
import moment from 'moment';
import React from 'react';

import { RoastingListItem } from '../../api/queries/get-roastings-query';
import { RoastingOrdersList } from './roasting-order-list';

export const ActiveRoasting = (props: {
  roasting: RoastingListItem | null;
  onClosePlanning: () => void;
  onFinishRoasting: () => void;
  onFinishBatch: (roastedCoffeeId: number) => void;
  onReportRealYield: (roastedCoffeeId: number, weight: number) => void;
}) => {
  const {
    roasting,
    onClosePlanning,
    onFinishRoasting,
    onFinishBatch,
    onReportRealYield,
  } = props;

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      <h2>{moment(roasting?.roastingDate).format('LL')}</h2>
      {!roasting && (
        <Button
          type="primary"
          style={{
            marginBottom: 16,
            alignSelf: 'flex-end',
            position: 'absolute',
            top: -50,
          }}
          onClick={onClosePlanning}
        >
          Začít pražení
        </Button>
      )}
      {roasting && (
        <>
          <Button
            type="primary"
            danger
            style={{
              marginBottom: 16,
              alignSelf: 'flex-end',
              position: 'absolute',
              top: -50,
            }}
            onClick={onFinishRoasting}
          >
            Ukončit pražení
          </Button>
          <div
            style={{
              margin: '0px 4px 16px 0',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              padding: '0 16px',
            }}
          >
            {roasting?.roastedCoffee
              .filter((item) => !!item.numberOfBatches)
              .map((item) => {
                const isFinished =
                  roasting.finishedBatches.find(
                    (batch) => batch.roastedCoffeeId === item.id
                  )?.amount === Math.ceil(item.numberOfBatches);

                return (
                  <div
                    key={item.id}
                    style={{
                      margin: `8px 0`,
                      display: 'flex',
                      alignItems: 'center',
                      height: 35,
                    }}
                  >
                    <span style={{ minWidth: 300 }}>{`${item.name}`}</span>
                    <span style={{ minWidth: 100 }}>{`${item.weight} kg`}</span>

                    <span style={{ minWidth: 50 }}>
                      {`${
                        roasting.finishedBatches.find(
                          (batch) => batch.roastedCoffeeId === item.id
                        )?.amount || 0
                      } / ${Math.ceil(item.numberOfBatches)}`}
                    </span>

                    {!isFinished && (
                      <Button
                        type="primary"
                        style={{ marginLeft: 20 }}
                        onClick={() => onFinishBatch(item.id)}
                      >
                        +
                      </Button>
                    )}

                    {isFinished && (
                      <span style={{ marginLeft: 20 }}>
                        <span>Reálná výtěžnost</span>
                        <InputNumber
                          style={{
                            width: 60,
                            marginLeft: 8,
                            textAlign: 'center',
                          }}
                          step="0.1"
                          onChange={(value) =>
                            onReportRealYield(item.id, value)
                          }
                          defaultValue={
                            roasting.realYield.find(
                              (value) => value.roastedCoffeeId === item.id
                            )?.weight
                          }
                        />
                        <span style={{ marginLeft: 8 }}>kg</span>
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
          <RoastingOrdersList orders={roasting.orders} />
        </>
      )}
    </div>
  );
};

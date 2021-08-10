import moment from 'moment';
import React from 'react';

import { RoastingListItem } from '../api/queries/get-roastings-query';
import { RoastingOrdersList } from './roasting-order-list';

export const PlannedRoasting = (props: { roasting: RoastingListItem }) => {
  const { roasting } = props;

  return (
    <div style={{}}>
      <h2>{moment(roasting.roastingDate).format('LL')}</h2>
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
                  {`0 / ${Math.ceil(item.numberOfBatches)}`}
                </span>
              </div>
            );
          })}
      </div>

      <RoastingOrdersList orders={roasting.orders} />
    </div>
  );
};

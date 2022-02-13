import {
  AllBatchesAlreadyFinished,
  RoastingNotInProgress,
} from '../roasting-errors';
import { RoastingDomainEventCreators } from '../roasting-events';
import { RoastingStatus } from '../roasting-types';
import { buildRoastingTestHelper } from '../../../../../../mocks/roasting-helper';
import { getRoastingPlan } from './internal/get-roasting-plan';
import { getLineItemRoastingPlan } from './internal/get-line-item-roasting-plan';

const greenCoffeeUuid = 'green-coffee-uuid';
const roastedCoffeeUuid = 'roasted-coffee-uuid';

const getSettings = () => ({
  productVariations: [
    {
      id: 1,
      weight: 3,
      roastedCoffeeUuid: roastedCoffeeUuid,
    },
  ],
  roastedCoffees: [
    {
      uuid: roastedCoffeeUuid,
      name: 'Roasted coffee',
      greenCoffeeUuid: greenCoffeeUuid,
    },
    {
      uuid: 'other-roasted-coffee-uuid',
      name: 'Roasted coffee 2',
      greenCoffeeUuid: 'other-coffee-uuid',
    },
  ],
  greenCoffees: [
    {
      uuid: greenCoffeeUuid,
      name: 'Green coffee',
      batchWeight: 10,
      roastingLossFactor: 0.9,
    },
    {
      uuid: 'other-coffee-uuid',
      name: 'Green coffee 2',
      batchWeight: 3,
      roastingLossFactor: 0.1,
    },
  ],
});

const getFixture = () => ({
  status: RoastingStatus.IN_PROGRESS,
  settings: getSettings(),
  lineItems: [
    {
      variationId: 1,
      quantity: 2,
      orderId: 1,
    },
  ],
  orders: [{ id: 1 }],
  roastingPlan: {
    roastedCoffees: {
      [roastedCoffeeUuid]: {
        expectedWeight: 9,
        orderedWeigth: 6,
        batchesToBeRoasted: 2,
      },
    },
    greenCoffees: {
      greenCoffeeUuid: {
        weight: 10,
      },
    },
  },
});

const getProps = () => ({
  roastedCoffeeUuid: roastedCoffeeUuid,
});

const getContext = () => ({
  getRoastingPlan,
  getLineItemRoastingPlan,
});

describe('finishBatchAction', () => {
  it('fails if roasting is in IN_PLANNING status', () => {
    const { entity } = buildRoastingTestHelper(
      {
        ...getFixture(),
        status: RoastingStatus.IN_PLANNING,
        roastingPlan: undefined,
      },
      getContext()
    );

    expect(() => entity.finishBatch(getProps())).toThrow(RoastingNotInProgress);
  });

  it('fails if all batches are already finished', () => {
    const { entity } = buildRoastingTestHelper(
      {
        ...getFixture(),
        finishedBatches: [
          {
            roastedCoffeeUuid,
            amount: 2,
          },
        ],
      },
      getContext()
    );

    expect(() => entity.finishBatch(getProps())).toThrow(
      AllBatchesAlreadyFinished
    );
  });

  it('dispatches one domain event', () => {
    const { entity, getEvents } = buildRoastingTestHelper(
      getFixture(),
      getContext()
    );

    entity.finishBatch(getProps());

    expect(getEvents()).toHaveLength(1);
  });

  it('dispatches BatchFinished event', () => {
    const { entity, getEvents } = buildRoastingTestHelper(
      getFixture(),
      getContext()
    );

    entity.finishBatch(getProps());

    expect(getEvents()[0].type).toBe(
      RoastingDomainEventCreators.BatchFinished.type
    );
  });

  it('dispatches BatchFinished event with correct payload', () => {
    const { entity, getEvents } = buildRoastingTestHelper(
      getFixture(),
      getContext()
    );

    entity.finishBatch(getProps());

    expect(getEvents()[0].payload).toEqual({
      roastedCoffeeUuid: getProps().roastedCoffeeUuid,
      timestamp: expect.any(String),
    });
  });

  it('adds new batch to finished batches if it is first ', () => {
    const { entity } = buildRoastingTestHelper(getFixture(), getContext());

    entity.finishBatch(getProps());

    expect(entity.getState().finishedBatches[0]).toEqual({
      roastedCoffeeUuid: getProps().roastedCoffeeUuid,
      amount: 1,
    });
  });

  it('updates existing finished batch if it exists ', () => {
    const { entity } = buildRoastingTestHelper(
      {
        ...getFixture(),
        lineItems: [
          {
            variationId: 1,
            quantity: 4,
            orderId: 1,
          },
        ],
        finishedBatches: [
          {
            roastedCoffeeUuid,
            amount: 1,
          },
        ],
      },
      getContext()
    );

    entity.finishBatch(getProps());

    expect(entity.getState().finishedBatches[0]).toEqual({
      roastedCoffeeUuid: getProps().roastedCoffeeUuid,
      amount: 2,
    });
  });
});

import {
  BatchesAreNotAllRoasted,
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
  finishedBatches: [
    {
      amount: 1,
    },
  ],
  roastingPlan: {
    roastedCoffees: {
      [roastedCoffeeUuid]: {
        expectedWeight: 9,
        orderedWeigth: 6,
        batchesToBeRoasted: 1,
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
  weight: 10,
});

const getContext = () => ({
  getRoastingPlan,
  getLineItemRoastingPlan,
});

describe('reportRealYieldAction', () => {
  it('fails if roasting is in IN_PLANNING status', () => {
    const { entity } = buildRoastingTestHelper(
      {
        ...getFixture(),
        status: RoastingStatus.IN_PLANNING,
        finishedBatches: [],
        reportedYields: [],
        roastingPlan: undefined,
      },
      getContext()
    );

    expect(() => entity.reportRealYield(getProps())).toThrow(
      RoastingNotInProgress
    );
  });

  it('fails if roasting is in FINISHED status', () => {
    const { entity } = buildRoastingTestHelper(
      {
        ...getFixture(),
        status: RoastingStatus.FINISHED,
        roastingPlan: { greenCoffees: {}, roastedCoffees: {} },
      },
      getContext()
    );

    expect(() => entity.reportRealYield(getProps())).toThrow(
      RoastingNotInProgress
    );
  });

  it('fails if all batches are not roasted', () => {
    const { entity } = buildRoastingTestHelper(
      {
        ...getFixture(),
        finishedBatches: [],
      },
      getContext()
    );

    expect(() => entity.reportRealYield(getProps())).toThrow(
      BatchesAreNotAllRoasted
    );
  });

  it('dispatches one domain event', () => {
    const { entity, getEvents } = buildRoastingTestHelper(
      getFixture(),
      getContext()
    );

    entity.reportRealYield(getProps());

    expect(getEvents()).toHaveLength(1);
  });

  it('dispatches YieldReported event', () => {
    const { entity, getEvents } = buildRoastingTestHelper(
      getFixture(),
      getContext()
    );

    entity.reportRealYield(getProps());

    expect(getEvents()[0].type).toBe(
      RoastingDomainEventCreators.YieldReported.type
    );
  });

  it('dispatches YieldReported event with correct payload', () => {
    const { entity, getEvents } = buildRoastingTestHelper(
      getFixture(),
      getContext()
    );

    entity.reportRealYield(getProps());

    expect(getEvents()[0].payload).toEqual({
      roastedCoffeeUuid: getProps().roastedCoffeeUuid,
      weight: getProps().weight,
      timestamp: expect.any(String),
    });
  });

  it('adds new reported yield if it does not exist ', () => {
    const { entity } = buildRoastingTestHelper(getFixture(), getContext());

    entity.reportRealYield(getProps());

    expect(entity.getState().reportedYields[0]).toEqual({
      roastedCoffeeUuid: getProps().roastedCoffeeUuid,
      weight: getProps().weight,
    });
  });

  it('updates existing reported yield if it exists ', () => {
    const { entity } = buildRoastingTestHelper(
      {
        ...getFixture(),
        reportedYields: [
          {
            roastedCoffeeUuid,
            weight: 5,
          },
        ],
      },
      getContext()
    );

    entity.reportRealYield(getProps());

    expect(entity.getState().reportedYields[0]).toEqual({
      roastedCoffeeUuid: getProps().roastedCoffeeUuid,
      weight: 10,
    });
  });
});

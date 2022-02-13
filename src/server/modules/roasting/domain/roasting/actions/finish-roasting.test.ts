import {
  AllBatchesAreNotFinished,
  AllYieldsAreNotReported,
} from './../roasting-errors';
import { RoastingNotInProgress } from '../roasting-errors';
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
  ],
  greenCoffees: [
    {
      uuid: greenCoffeeUuid,
      name: 'Green coffee',
      batchWeight: 10,
      roastingLossFactor: 0.9,
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
      roastedCoffeeUuid,
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
  reportedYields: [{ roastedCoffeeUuid, weight: 9.5 }],
});

const getContext = () => ({
  getRoastingPlan,
  getLineItemRoastingPlan,
});

describe('finishRoastingAction', () => {
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

    expect(() => entity.finishRoasting()).toThrow(RoastingNotInProgress);
  });

  it('fails if roasting is in FINISHED status', () => {
    const { entity } = buildRoastingTestHelper(
      {
        ...getFixture(),
        status: RoastingStatus.FINISHED,
      },
      getContext()
    );

    expect(() => entity.finishRoasting()).toThrow(RoastingNotInProgress);
  });

  it('fails if all batches are not finished', () => {
    const { entity } = buildRoastingTestHelper(
      {
        ...getFixture(),
        finishedBatches: [],
      },
      getContext()
    );

    expect(() => entity.finishRoasting()).toThrow(AllBatchesAreNotFinished);
  });

  it('fails if all yields are not reported', () => {
    const { entity } = buildRoastingTestHelper(
      {
        ...getFixture(),
        reportedYields: [],
      },
      getContext()
    );

    expect(() => entity.finishRoasting()).toThrow(AllYieldsAreNotReported);
  });

  it('dispatches one domain event', () => {
    const { entity, getEvents } = buildRoastingTestHelper(
      getFixture(),
      getContext()
    );

    entity.finishRoasting();

    expect(getEvents()).toHaveLength(1);
  });

  it('dispatches RoastingFinished event', () => {
    const { entity, getEvents } = buildRoastingTestHelper(
      getFixture(),
      getContext()
    );

    entity.finishRoasting();

    expect(getEvents()[0].type).toBe(
      RoastingDomainEventCreators.RoastingFinished.type
    );
  });

  it('moves roasting to FINISHED status', () => {
    const { entity } = buildRoastingTestHelper(getFixture(), getContext());

    entity.finishRoasting();

    expect(entity.getState().status).toEqual(RoastingStatus.FINISHED);
  });
});

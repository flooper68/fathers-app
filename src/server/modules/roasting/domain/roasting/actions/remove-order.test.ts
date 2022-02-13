import {
  RoastingNotInPlanning,
  RoastingOrderDoesNotExist,
} from '../roasting-errors';
import { RoastingDomainEventCreators } from '../roasting-events';
import { RoastingStatus } from '../roasting-types';
import { buildRoastingTestHelper } from './../../../../../../mocks/roasting-helper';

const getProps = () => ({
  id: 1,
});

const getFixture = () => ({
  status: RoastingStatus.IN_PLANNING,
  orders: [{ id: 1 }],
  lineItems: [
    {
      orderId: 1,
    },
  ],
});

describe('removeOrderAction', () => {
  it('fails if roasting is in IN_PROGRESS status', () => {
    const { entity } = buildRoastingTestHelper({
      ...getFixture(),
      status: RoastingStatus.IN_PROGRESS,
      roastingPlan: { greenCoffees: {}, roastedCoffees: {} },
    });

    expect(() => entity.removeOrder(getProps())).toThrow(RoastingNotInPlanning);
  });

  it('fails if roasting is in FINISHED status', () => {
    const { entity } = buildRoastingTestHelper({
      ...getFixture(),
      status: RoastingStatus.FINISHED,
      roastingPlan: { greenCoffees: {}, roastedCoffees: {} },
    });

    expect(() => entity.removeOrder(getProps())).toThrow(RoastingNotInPlanning);
  });

  it('fails if order does not exist', () => {
    const { entity } = buildRoastingTestHelper({
      ...getFixture(),
      status: RoastingStatus.IN_PLANNING,
      roastingPlan: undefined,
    });

    expect(() => entity.removeOrder({ id: 10 })).toThrow(
      RoastingOrderDoesNotExist
    );
  });

  it('dispatches one domain event', () => {
    const { entity, getEvents } = buildRoastingTestHelper(getFixture());

    entity.removeOrder(getProps());

    expect(getEvents()).toHaveLength(1);
  });

  it('dispatches OrderRemoved event', () => {
    const { entity, getEvents } = buildRoastingTestHelper(getFixture());

    entity.removeOrder(getProps());

    expect(getEvents()[0].type).toBe(
      RoastingDomainEventCreators.OrderRemoved.type
    );
  });

  it('dispatches OrderRemoved event with correct payload', () => {
    const { entity, getEvents } = buildRoastingTestHelper(getFixture());

    entity.removeOrder(getProps());

    expect(getEvents()[0].payload).toEqual({
      id: getProps().id,
      timestamp: expect.any(String),
    });
  });

  it('removes order from orders ', () => {
    const { entity } = buildRoastingTestHelper(getFixture());

    entity.removeOrder(getProps());

    expect(entity.getState().orders.length).toEqual(0);
  });

  it('removes all order line items ', () => {
    const { entity } = buildRoastingTestHelper(getFixture());

    entity.removeOrder(getProps());

    expect(entity.getState().lineItems.length).toEqual(0);
  });
});

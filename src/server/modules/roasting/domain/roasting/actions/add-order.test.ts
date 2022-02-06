import { RoastingNotInPlanning } from '../roasting-errors';
import { RoastingDomainEventCreators } from '../roasting-events';
import { RoastingStatus } from '../roasting-types';
import { buildRoastingTestHelper } from './../../../../../../mocks/roasting-helper';

const getProps = () => ({
  id: 1,
  lineItems: [
    {
      variationId: 1,
      quantity: 10,
      orderId: 1,
    },
  ],
});

describe('addOrderAction', () => {
  it('fails if roasting is in IN_PROGRESS status', () => {
    const { entity } = buildRoastingTestHelper({
      status: RoastingStatus.IN_PROGRESS,
    });

    expect(() => entity.addOrder(getProps())).toThrow(RoastingNotInPlanning);
  });

  it('fails if roasting is in FINISHED status', () => {
    const { entity } = buildRoastingTestHelper({
      status: RoastingStatus.FINISHED,
    });

    expect(() => entity.addOrder(getProps())).toThrow(RoastingNotInPlanning);
  });

  it('dispatches one domain event', () => {
    const { entity, getEvents } = buildRoastingTestHelper();
    entity.addOrder(getProps());
    expect(getEvents()).toHaveLength(1);
  });

  it('dispatches OrderAdded event', () => {
    const { entity, getEvents } = buildRoastingTestHelper();

    entity.addOrder(getProps());

    expect(getEvents()[0].type).toBe(
      RoastingDomainEventCreators.OrderAdded.type
    );
  });

  it('dispatches OrderAdded event with correct payload', () => {
    const { entity, getEvents } = buildRoastingTestHelper();

    entity.addOrder(getProps());

    expect(getEvents()[0].payload).toEqual({
      id: getProps().id,
      lineItems: getProps().lineItems,
      timestamp: expect.any(String),
    });
  });

  it('adds new order to orders ', () => {
    const { entity } = buildRoastingTestHelper();

    entity.addOrder(getProps());

    expect(entity.getState().orders[0]).toEqual({
      id: getProps().id,
    });
  });

  it('adds all lineItems to existing ones ', () => {
    const { entity } = buildRoastingTestHelper();

    entity.addOrder(getProps());

    expect(entity.getState().lineItems[0]).toEqual({
      orderId: getProps().lineItems[0].orderId,
      variationId: getProps().lineItems[0].variationId,
      quantity: getProps().lineItems[0].quantity,
    });
  });
});

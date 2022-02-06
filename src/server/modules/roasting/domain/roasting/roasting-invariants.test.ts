import { getRoastingFixture } from '../../../../../fixtures/roasting';
import { RoastingLineItemDoesNotBelongToOrder } from './roasting-errors';
import { checkRoastingInvariants } from './roasting-invariants';

describe('checkRoastingInvariants', () => {
  it('fails line item does not belong to any order', () => {
    const state = getRoastingFixture({
      lineItems: [
        {
          orderId: 10,
        },
      ],
    });

    expect(() => checkRoastingInvariants(state)).toThrow(
      RoastingLineItemDoesNotBelongToOrder
    );
  });
});

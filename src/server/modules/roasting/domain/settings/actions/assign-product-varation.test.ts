import { RoastedCoffeeDoesNotExist } from './../roasting-settings-errors';
import {
  DEFAULT_ROASTED_COFFEE_UUID,
  DEFAULT_PRODUCT_VARIATION_ID,
} from './../../../../../../fixtures/roasting-settings';
import { buildRoastingSettingsTestHelper } from '../../../../../../mocks/roasting-settings-helper';
import { RoastingSettingsDomainEventCreators } from '../roasting-settings-events';

const getProps = () => ({
  id: DEFAULT_PRODUCT_VARIATION_ID,
  weight: 2,
  roastedCoffeeUuid: DEFAULT_ROASTED_COFFEE_UUID,
});

describe('assignProductVariationAction', () => {
  it('fails if coffee does not exist', () => {
    const { entity } = buildRoastingSettingsTestHelper();

    expect(() => entity.assignProductVariation(getProps())).toThrow(
      RoastedCoffeeDoesNotExist
    );
  });

  it('dispatches one domain event', () => {
    const { entity, getEvents } = buildRoastingSettingsTestHelper({
      greenCoffees: [{}],
      roastedCoffees: [{}],
    });

    entity.assignProductVariation(getProps());

    expect(getEvents()).toHaveLength(1);
  });

  it('dispatches ProductVariationAssigned event', () => {
    const { entity, getEvents } = buildRoastingSettingsTestHelper({
      greenCoffees: [{}],
      roastedCoffees: [{}],
    });

    entity.assignProductVariation(getProps());

    expect(getEvents()[0].type).toBe(
      RoastingSettingsDomainEventCreators.ProductVariationAssigned.type
    );
  });

  it('dispatches ProductVariationAssigned event with correct payload', () => {
    const { entity, getEvents } = buildRoastingSettingsTestHelper({
      greenCoffees: [{}],
      roastedCoffees: [{}],
    });

    entity.assignProductVariation(getProps());

    expect(getEvents()[0].payload).toEqual({
      id: getProps().id,
      weight: getProps().weight,
      roastedCoffeeUuid: getProps().roastedCoffeeUuid,
      timestamp: expect.any(String),
    });
  });

  it('adds new coffee to state', () => {
    const { entity } = buildRoastingSettingsTestHelper({
      greenCoffees: [{}],
      roastedCoffees: [{}],
    });

    entity.assignProductVariation(getProps());

    expect(entity.getState().productVariations[0]).toEqual({
      id: getProps().id,
      weight: getProps().weight,
      roastedCoffeeUuid: getProps().roastedCoffeeUuid,
    });
  });
});

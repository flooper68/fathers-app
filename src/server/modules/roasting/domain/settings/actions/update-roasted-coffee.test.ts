import { RoastedCoffeeDoesNotExist } from './../roasting-settings-errors';
import { GreenCoffeeDoesNotExist } from '../roasting-settings-errors';
import { buildRoastingSettingsTestHelper } from '../../../../../../mocks/roasting-settings-helper';
import { RoastingSettingsDomainEventCreators } from '../roasting-settings-events';

const getProps = () => ({
  uuid: 'uuid',
  name: 'new-green-coffee',
  greenCoffeeUuid: 'green-coffee-uuid',
});

describe('updateRoastedCoffeeAction', () => {
  it('fails if RoastedCoffee does not exist', () => {
    const { entity } = buildRoastingSettingsTestHelper({
      greenCoffees: [{ uuid: getProps().greenCoffeeUuid }],
      roastedCoffees: [],
    });

    expect(() => entity.updateRoastedCoffee(getProps())).toThrow(
      RoastedCoffeeDoesNotExist
    );
  });

  it('fails if GreenCoffee does not exist', () => {
    const { entity } = buildRoastingSettingsTestHelper({
      greenCoffees: [],
      roastedCoffees: [{ uuid: getProps().uuid }],
    });

    expect(() => entity.updateRoastedCoffee(getProps())).toThrow(
      GreenCoffeeDoesNotExist
    );
  });

  it('dispatches one domain event', () => {
    const { entity, getEvents } = buildRoastingSettingsTestHelper({
      greenCoffees: [{ uuid: getProps().greenCoffeeUuid }],
      roastedCoffees: [{ uuid: getProps().uuid }],
    });

    entity.updateRoastedCoffee(getProps());

    expect(getEvents()).toHaveLength(1);
  });

  it('dispatches RoastedCoffeeUpdated event', () => {
    const { entity, getEvents } = buildRoastingSettingsTestHelper({
      greenCoffees: [{ uuid: getProps().greenCoffeeUuid }],
      roastedCoffees: [{ uuid: getProps().uuid }],
    });

    entity.updateRoastedCoffee(getProps());

    expect(getEvents()[0].type).toBe(
      RoastingSettingsDomainEventCreators.RoastedCoffeeUpdated.type
    );
  });

  it('dispatches RoastedCoffeeUpdated event with correct payload', () => {
    const { entity, getEvents } = buildRoastingSettingsTestHelper({
      greenCoffees: [{ uuid: getProps().greenCoffeeUuid }],
      roastedCoffees: [{ uuid: getProps().uuid }],
    });

    entity.updateRoastedCoffee(getProps());

    expect(getEvents()[0].payload).toEqual({
      uuid: getProps().uuid,
      name: getProps().name,
      greenCoffeeUuid: getProps().greenCoffeeUuid,
      timestamp: expect.any(String),
    });
  });

  it('updates the state', () => {
    const { entity } = buildRoastingSettingsTestHelper({
      greenCoffees: [
        { uuid: getProps().greenCoffeeUuid },
        {
          uuid: 'another-green-uuid',
        },
      ],
      roastedCoffees: [
        {
          uuid: getProps().uuid,
          name: 'old-name',
          greenCoffeeUuid: 'another-green-uuid',
        },
      ],
    });

    entity.updateRoastedCoffee(getProps());

    expect(entity.getState().roastedCoffees[0]).toEqual({
      uuid: getProps().uuid,
      name: getProps().name,
      greenCoffeeUuid: getProps().greenCoffeeUuid,
    });
  });
});

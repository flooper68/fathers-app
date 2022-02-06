import {
  RoastedCoffeeAlreadyExists,
  GreenCoffeeDoesNotExist,
} from './../roasting-settings-errors';
import { RoastingSettingsDomainEventCreators } from '../roasting-settings-events';
import { buildRoastingSettingsTestHelper } from '../../../../../../mocks/roasting-settings-helper';

const getProps = () => ({
  uuid: 'uuid',
  name: 'roasted-coffee',
  greenCoffeeUuid: 'green-coffee-uuid',
});

describe('addRoastedCoffeeAction', () => {
  it('fails if coffee already exists', () => {
    const { entity } = buildRoastingSettingsTestHelper({
      greenCoffees: [{ uuid: getProps().greenCoffeeUuid }],
      roastedCoffees: [{ uuid: getProps().uuid }],
    });

    expect(() => entity.addRoastedCoffee(getProps())).toThrow(
      RoastedCoffeeAlreadyExists
    );
  });

  it('fails if GreenCoffee does not exists', () => {
    const { entity } = buildRoastingSettingsTestHelper({
      greenCoffees: [],
      roastedCoffees: [],
    });

    expect(() => entity.addRoastedCoffee(getProps())).toThrow(
      GreenCoffeeDoesNotExist
    );
  });

  it('dispatches one domain event', () => {
    const { entity, getEvents } = buildRoastingSettingsTestHelper({
      greenCoffees: [{ uuid: getProps().greenCoffeeUuid }],
    });

    entity.addRoastedCoffee(getProps());

    expect(getEvents()).toHaveLength(1);
  });

  it('dispatches RoastedCoffeeAdded event', () => {
    const { entity, getEvents } = buildRoastingSettingsTestHelper({
      greenCoffees: [{ uuid: getProps().greenCoffeeUuid }],
    });

    entity.addRoastedCoffee(getProps());

    expect(getEvents()[0].type).toBe(
      RoastingSettingsDomainEventCreators.RoastedCoffeeAdded.type
    );
  });

  it('dispatches RoastedCoffeeAdded event with correct payload', () => {
    const { entity, getEvents } = buildRoastingSettingsTestHelper({
      greenCoffees: [{ uuid: getProps().greenCoffeeUuid }],
    });

    entity.addRoastedCoffee(getProps());

    expect(getEvents()[0].payload).toEqual({
      uuid: getProps().uuid,
      name: getProps().name,
      greenCoffeeUuid: getProps().greenCoffeeUuid,
      timestamp: expect.any(String),
    });
  });

  it('adds new coffee to state ', () => {
    const { entity } = buildRoastingSettingsTestHelper({
      greenCoffees: [{ uuid: getProps().greenCoffeeUuid }],
    });

    entity.addRoastedCoffee(getProps());

    expect(entity.getState().roastedCoffees[0]).toEqual({
      uuid: getProps().uuid,
      name: getProps().name,
      greenCoffeeUuid: getProps().greenCoffeeUuid,
    });
  });
});

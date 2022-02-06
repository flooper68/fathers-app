import { GreenCoffeeAlreadyExists } from '../roasting-settings-errors';
import { RoastingSettingsDomainEventCreators } from '../roasting-settings-events';
import { buildRoastingSettingsTestHelper } from './../../../../../../mocks/roasting-settings-helper';

const getProps = () => ({
  uuid: 'uuid',
  name: 'green-coffee',
  batchWeight: 10,
  roastingLossFactor: 0.9,
});

describe('addGreenCoffeeAction', () => {
  it('fails if coffee already exists', () => {
    const { entity } = buildRoastingSettingsTestHelper({
      greenCoffees: [{ uuid: 'uuid' }],
    });

    expect(() => entity.addGreenCoffee(getProps())).toThrow(
      GreenCoffeeAlreadyExists
    );
  });

  it('dispatches one domain event', () => {
    const { entity, getEvents } = buildRoastingSettingsTestHelper();

    entity.addGreenCoffee(getProps());

    expect(getEvents()).toHaveLength(1);
  });

  it('dispatches GreenCoffeeAdded event', () => {
    const { entity, getEvents } = buildRoastingSettingsTestHelper();

    entity.addGreenCoffee(getProps());

    expect(getEvents()[0].type).toBe(
      RoastingSettingsDomainEventCreators.GreenCoffeeAdded.type
    );
  });

  it('dispatches GreenCoffeeAdded event with correct payload', () => {
    const { entity, getEvents } = buildRoastingSettingsTestHelper();

    entity.addGreenCoffee(getProps());

    expect(getEvents()[0].payload).toEqual({
      uuid: getProps().uuid,
      name: getProps().name,
      batchWeight: getProps().batchWeight,
      roastingLossFactor: getProps().roastingLossFactor,
      timestamp: expect.any(String),
    });
  });

  it('adds new coffee to state ', () => {
    const { entity } = buildRoastingSettingsTestHelper();

    entity.addGreenCoffee(getProps());

    expect(entity.getState().greenCoffees[0]).toEqual({
      uuid: getProps().uuid,
      name: getProps().name,
      batchWeight: getProps().batchWeight,
      roastingLossFactor: getProps().roastingLossFactor,
    });
  });
});

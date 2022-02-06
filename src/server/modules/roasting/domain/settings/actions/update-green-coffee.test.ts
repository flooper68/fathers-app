import { GreenCoffeeDoesNotExist } from '../roasting-settings-errors';
import { buildRoastingSettingsTestHelper } from '../../../../../../mocks/roasting-settings-helper';
import { RoastingSettingsDomainEventCreators } from '../roasting-settings-events';

const getProps = () => ({
  uuid: 'uuid',
  name: 'new-green-coffee',
  batchWeight: 15,
  roastingLossFactor: 0.3,
});

describe('updateGreenCoffeeAction', () => {
  it('fails if coffee does not exist', () => {
    const { entity } = buildRoastingSettingsTestHelper();

    expect(() => entity.updateGreenCoffee(getProps())).toThrow(
      GreenCoffeeDoesNotExist
    );
  });

  it('dispatches one domain event', () => {
    const { entity, getEvents } = buildRoastingSettingsTestHelper({
      greenCoffees: [{ uuid: getProps().uuid }],
    });

    entity.updateGreenCoffee(getProps());

    expect(getEvents()).toHaveLength(1);
  });

  it('dispatches GreenCoffeeUpdated event', () => {
    const { entity, getEvents } = buildRoastingSettingsTestHelper({
      greenCoffees: [{ uuid: getProps().uuid }],
    });

    entity.updateGreenCoffee(getProps());

    expect(getEvents()[0].type).toBe(
      RoastingSettingsDomainEventCreators.GreenCoffeeUpdated.type
    );
  });

  it('dispatches GreenCoffeeUpdated event with correct payload', () => {
    const { entity, getEvents } = buildRoastingSettingsTestHelper({
      greenCoffees: [{ uuid: getProps().uuid }],
    });

    entity.updateGreenCoffee(getProps());

    expect(getEvents()[0].payload).toEqual({
      uuid: getProps().uuid,
      name: getProps().name,
      batchWeight: getProps().batchWeight,
      roastingLossFactor: getProps().roastingLossFactor,
      timestamp: expect.any(String),
    });
  });

  it('adds new coffee to state', () => {
    const { entity } = buildRoastingSettingsTestHelper({
      greenCoffees: [
        {
          uuid: getProps().uuid,
          name: 'old-name',
          roastingLossFactor: 1,
          batchWeight: 10,
        },
      ],
    });

    entity.updateGreenCoffee(getProps());

    expect(entity.getState().greenCoffees[0]).toEqual({
      uuid: getProps().uuid,
      name: getProps().name,
      roastingLossFactor: getProps().roastingLossFactor,
      batchWeight: getProps().batchWeight,
    });
  });
});

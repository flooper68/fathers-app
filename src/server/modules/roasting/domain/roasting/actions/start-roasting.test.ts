import { RoastingPlan } from './internal/get-roasting-plan';
import { RoastingNotInPlanning } from '../roasting-errors';
import { RoastingDomainEventCreators } from '../roasting-events';
import { RoastingStatus } from '../roasting-types';
import { buildRoastingTestHelper } from '../../../../../../mocks/roasting-helper';

const getFixture = () => ({
  status: RoastingStatus.IN_PLANNING,
});

describe('startRoastingAction', () => {
  it('fails if roasting is in IN_PROGRESS status', () => {
    const { entity } = buildRoastingTestHelper({
      ...getFixture(),
      status: RoastingStatus.IN_PROGRESS,
      roastingPlan: { greenCoffees: {}, roastedCoffees: {} },
    });

    expect(() => entity.startRoasting()).toThrow(RoastingNotInPlanning);
  });

  it('fails if roasting is in FINISHED status', () => {
    const { entity } = buildRoastingTestHelper({
      ...getFixture(),
      status: RoastingStatus.FINISHED,
      roastingPlan: { greenCoffees: {}, roastedCoffees: {} },
    });

    expect(() => entity.startRoasting()).toThrow(RoastingNotInPlanning);
  });

  it('dispatches one domain event', () => {
    const plan = {};
    const { entity, getEvents } = buildRoastingTestHelper(getFixture(), {
      getRoastingPlan: jest.fn(() => plan as RoastingPlan),
    });

    entity.startRoasting();

    expect(getEvents()).toHaveLength(1);
  });

  it('dispatches RoastingStarted event', () => {
    const plan = {};
    const { entity, getEvents } = buildRoastingTestHelper(getFixture(), {
      getRoastingPlan: jest.fn(() => plan as RoastingPlan),
    });

    entity.startRoasting();

    expect(getEvents()[0].type).toBe(
      RoastingDomainEventCreators.RoastingStarted.type
    );
  });

  it('dispatches RoastingStarted event with correct payload', () => {
    const plan = {};
    const { entity, getEvents } = buildRoastingTestHelper(getFixture(), {
      getRoastingPlan: jest.fn(() => plan as RoastingPlan),
    });

    entity.startRoasting();

    expect(getEvents()[0].payload).toEqual({
      roastingPlan: plan,
      timestamp: expect.any(String),
    });
  });

  it('moves roasting to IN_PROGRESS status', () => {
    const plan = {};
    const { entity } = buildRoastingTestHelper(getFixture(), {
      getRoastingPlan: jest.fn(() => plan as RoastingPlan),
    });

    entity.startRoasting();

    expect(entity.getState().status).toEqual(RoastingStatus.IN_PROGRESS);
  });

  it('sets new roasting plan', () => {
    const plan = {};

    const { entity } = buildRoastingTestHelper(getFixture(), {
      getRoastingPlan: jest.fn(() => plan as RoastingPlan),
    });

    entity.startRoasting();

    expect(entity.getState().roastingPlan).toEqual(plan);
  });
});

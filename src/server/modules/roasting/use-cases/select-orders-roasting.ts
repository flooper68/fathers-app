import {
  addOrderToRoasting,
  removeOrderFromRoasting,
} from '../entities/roasting-entity';
import {
  RoastingRepository,
  SelectOrdersRoastingProps,
} from '../roasting-contracts';

export const selectOrdersRoastingUseCase = async (
  props: SelectOrdersRoastingProps,
  context: {
    roastingRepository: RoastingRepository;
  }
) => {
  // Roasting must exist
  // Order must exist
  // Roasting must have in planning status ??
  // Order can not be in already finished roasting - can be changed form planned

  const currentRoasting = await context.roastingRepository.getRoastingByOrder(
    props.orderId
  );
  const newRoasting = await context.roastingRepository.getOne(props.roastingId);

  if (!newRoasting) {
    throw new Error(`Roasting does not exist`);
  }

  if (currentRoasting) {
    const updatedCurrentRoasting = removeOrderFromRoasting(
      currentRoasting,
      props.orderId
    );
    await context.roastingRepository.save(updatedCurrentRoasting);
  }

  const updatedNewRoasting = addOrderToRoasting(newRoasting, props.orderId);
  await context.roastingRepository.save(updatedNewRoasting);
};

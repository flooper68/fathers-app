import {
  addOrderToRoasting,
  removeOrderFromRoasting,
} from '../entities/roasting';
import { RoastingRepository } from '../interfaces/roasting-repository';

export const selectOrdersRoastingUseCase = async (
  roastingId: string,
  orderId: number,
  repository: RoastingRepository
) => {
  // Roasting must exist
  // Order must exist
  // Roasting must have in planning status ??
  // Order can not be in already finished roasting - can be changed form planned

  const currentRoasting = await repository.findOrdersRoasting(orderId);
  const rows = await repository.find({ where: { _id: roastingId } });

  const newRoasting = rows[0];

  if (!newRoasting) {
    throw new Error(`Roasting does not exist`);
  }

  if (currentRoasting) {
    const updatedCurrentRoasting = removeOrderFromRoasting(
      currentRoasting,
      orderId
    );
    await repository.save(updatedCurrentRoasting);
  }

  const updatedNewRoasting = addOrderToRoasting(newRoasting, orderId);
  await repository.save(updatedNewRoasting);
};

import { RoastingLeftOversAddedType } from '../../../server/modules/warehouse/events/roasting-leftover-added';
import { RoastingLeftOversAdjustedType } from '../../../server/modules/warehouse/events/roasting-leftover-adjusted';
import { RoastingLeftOversUsedType } from '../../../server/modules/warehouse/events/roasting-leftover-used';

export const TranslateReasonMap: Record<string, string> = {
  [RoastingLeftOversAddedType]: 'Přidány Zbytky',
  [RoastingLeftOversAdjustedType]: 'Zbytky Nastaveny',
  [RoastingLeftOversUsedType]: 'Zbytky Použity',
};

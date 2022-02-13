import moment from 'moment';
import { v4 } from 'uuid';

import { CreateRoastingProps } from '../../server/modules/roasting/features/roasting-feature';

export const createRoastingProps = (): CreateRoastingProps => ({
  roastingDate: moment().format(),
  uuid: v4(),
  correlationUuid: v4(),
});

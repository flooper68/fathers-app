import { Injectable } from '@nestjs/common';

import { CommandProps } from '../../cqrs/decorators/command-handler.decorator';
import { CommandBus } from '../../cqrs/buses/command-bus';
import { QueryBus } from '../../cqrs/buses/query-bus';
import { CreateRoastingCommand } from './roasting-feature/create-roasting';

export interface CreateRoastingProps extends CommandProps {
  uuid: string;
  roastingDate: string;
}

@Injectable()
export class RoastingFeature {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  createRoasting(props: CreateRoastingProps): Promise<void> {
    return this.commandBus.execute(new CreateRoastingCommand(props));
  }
}

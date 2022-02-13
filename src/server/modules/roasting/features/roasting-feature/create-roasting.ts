import { RoastingContext } from './../../context/roasting-context';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '../../../cqrs/decorators/command-handler.decorator';
import { CreateRoastingProps } from '../roasting-feature';

export class CreateRoastingCommand
  implements ICommand<CreateRoastingProps, 'CreateRoasting'>
{
  type = 'CreateRoasting' as const;
  constructor(public readonly payload: CreateRoastingProps) {}
}

@CommandHandler({ command: CreateRoastingCommand })
export class CreateRoastingCommandHandler
  implements ICommandHandler<CreateRoastingCommand>
{
  constructor(private readonly context: RoastingContext) {}

  execute = (command: CreateRoastingCommand): Promise<void> =>
    this.context.handleWork(async ({ repository, factory }) => {
      const settings = await repository.getRoastingSettings();

      factory.create({
        uuid: command.payload.uuid,
        roastingDate: command.payload.roastingDate,
        settings,
      });
    }, command.payload.correlationUuid);
}

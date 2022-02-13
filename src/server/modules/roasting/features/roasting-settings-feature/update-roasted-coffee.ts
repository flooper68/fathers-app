import { RoastingSettingsContext } from '../../context/roasting-settings-context';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '../../../cqrs/decorators/command-handler.decorator';
import { UpdateRoastedCoffeeProps } from '../roasting-settings-feature';

export class UpdateRoastedCoffeeCommand
  implements ICommand<UpdateRoastedCoffeeProps, 'UpdateRoastedCoffee'>
{
  type = 'UpdateRoastedCoffee' as const;
  constructor(public readonly payload: UpdateRoastedCoffeeProps) {}
}

@CommandHandler({ command: UpdateRoastedCoffeeCommand })
export class UpdateRoastedCoffeeCommandHandler
  implements ICommandHandler<UpdateRoastedCoffeeCommand>
{
  constructor(private readonly context: RoastingSettingsContext) {}

  execute = (command: UpdateRoastedCoffeeCommand): Promise<void> =>
    this.context.handleWork(async ({ repository: repository }) => {
      const root = await repository.get();
      root.updateRoastedCoffee(command.payload);
    }, command.payload.correlationUuid);
}

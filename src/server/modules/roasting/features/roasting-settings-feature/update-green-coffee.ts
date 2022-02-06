import { RoastingContext } from '../../context/roasting-context';
import { EntityNotFoundError } from '../../../common/errors';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '../../../cqrs/decorators/command-handler.decorator';
import { UpdateGreenCoffeeProps } from '../roasting-settings-feature';

export class UpdateGreenCoffeeCommand
  implements ICommand<UpdateGreenCoffeeProps, 'UpdateGreenCoffee'>
{
  type = 'UpdateGreenCoffee' as const;
  constructor(public readonly payload: UpdateGreenCoffeeProps) {}
}

@CommandHandler({ command: UpdateGreenCoffeeCommand })
export class UpdateGreenCoffeeCommandHandler
  implements ICommandHandler<UpdateGreenCoffeeCommand>
{
  constructor(private readonly context: RoastingContext) {}

  execute = (command: UpdateGreenCoffeeCommand): Promise<void> =>
    this.context.handleWork(async ({ repository, factory }) => {
      try {
        const root = await repository.get();
        root.updateGreenCoffee(command.payload);
      } catch (e) {
        if (e instanceof EntityNotFoundError) {
          const root = factory.create();
          root.updateGreenCoffee(command.payload);
        } else {
          throw e;
        }
      }
    }, command.payload.correlationUuid);
}

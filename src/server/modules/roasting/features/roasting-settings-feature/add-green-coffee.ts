import { RoastingContext } from '../../context/roasting-context';
import { EntityNotFoundError } from '../../../common/errors';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '../../../cqrs/decorators/command-handler.decorator';
import { AddGreenCoffeeProps } from '../roasting-settings-feature';

export class AddGreenCoffeeCommand
  implements ICommand<AddGreenCoffeeProps, 'AddGreenCoffee'>
{
  type = 'AddGreenCoffee' as const;
  constructor(public readonly payload: AddGreenCoffeeProps) {}
}

@CommandHandler({ command: AddGreenCoffeeCommand })
export class AddGreenCoffeeCommandHandler
  implements ICommandHandler<AddGreenCoffeeCommand>
{
  constructor(private readonly context: RoastingContext) {}

  execute = (command: AddGreenCoffeeCommand): Promise<void> =>
    this.context.handleWork(async ({ repository, factory }) => {
      try {
        const root = await repository.get();
        root.addGreenCoffee(command.payload);
      } catch (e) {
        if (e instanceof EntityNotFoundError) {
          const root = factory.create();
          root.addGreenCoffee(command.payload);
        } else {
          throw e;
        }
      }
    }, command.payload.correlationUuid);
}

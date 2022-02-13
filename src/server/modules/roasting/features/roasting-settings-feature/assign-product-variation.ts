import { AssignProductVariationProps } from './../roasting-settings-feature';
import { RoastingSettingsContext } from '../../context/roasting-settings-context';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '../../../cqrs/decorators/command-handler.decorator';

export class AssignProductVariationCommand
  implements ICommand<AssignProductVariationProps, 'AssignProductVariation'>
{
  type = 'AssignProductVariation' as const;
  constructor(public readonly payload: AssignProductVariationProps) {}
}

@CommandHandler({ command: AssignProductVariationCommand })
export class AssignProductVariationCommandHandler
  implements ICommandHandler<AssignProductVariationCommand>
{
  constructor(private readonly context: RoastingSettingsContext) {}

  execute = (command: AssignProductVariationCommand): Promise<void> =>
    this.context.handleWork(async ({ repository: repository }) => {
      const root = await repository.get();
      root.assignProductVariation(command.payload);
    }, command.payload.correlationUuid);
}

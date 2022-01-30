import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '../cqrs/decorators/command-handler.decorator';
import { HelloWorldContext } from './hello-world-context';

export interface ChangeHelloWorldProps {
  uuid: string;
  correlationUuid: string;
}

export class ChangeHelloWorldCommand
  implements ICommand<ChangeHelloWorldProps, 'ChangeHelloWorld'>
{
  type = 'ChangeHelloWorld' as const;
  constructor(public readonly payload: ChangeHelloWorldProps) {}
}

@CommandHandler({ command: ChangeHelloWorldCommand })
export class ChangeHelloWorldCommandHandler
  implements ICommandHandler<ChangeHelloWorldCommand>
{
  constructor(private readonly context: HelloWorldContext) {}

  execute = (command: ChangeHelloWorldCommand): Promise<void> =>
    this.context.handleWork(async ({ repository }) => {
      const root = await repository.get(command.payload.uuid);
      root.changeCount();
    });
}

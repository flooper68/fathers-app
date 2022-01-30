import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '../cqrs/decorators/command-handler.decorator';
import { HelloWorldContext } from './hello-world-context';

export interface CreateHelloWorldProps {
  uuid: string;
  correlationUuid: string;
}

export class CreateHelloWorldCommand
  implements ICommand<CreateHelloWorldProps, 'CreateHelloWorld'>
{
  type = 'CreateHelloWorld' as const;
  constructor(public readonly payload: CreateHelloWorldProps) {}
}

@CommandHandler({ command: CreateHelloWorldCommand })
export class CreateHelloWorldCommandHandler
  implements ICommandHandler<CreateHelloWorldCommand>
{
  constructor(private readonly context: HelloWorldContext) {}

  execute = (command: CreateHelloWorldCommand): Promise<void> =>
    this.context.handleWork(async ({ factory }) => {
      factory.create(command.payload.uuid);
    });
}

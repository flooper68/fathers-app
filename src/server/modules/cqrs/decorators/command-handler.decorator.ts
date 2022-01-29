import 'reflect-metadata';

export const COMMAND_HANDLER_METADATA = '__commandHandler__';

// TODO do we need any here??
export interface ICommand<Payload = unknown, Type extends string = any> {
  readonly type: Type;
  readonly payload: Payload;
}

//TODO correlationUuid handling needs more love, it is kind of awkward right now
export interface CommandProps {
  readonly correlationUuid: string;
}

export interface ICommandHandler<Command extends ICommand> {
  execute(command: Command): Promise<void>;
}

export interface CommandHandlerMetadata<
  T extends ICommand,
  P extends CommandProps
> {
  command: new (props: P) => T;
  queue?: string | { name: string; resolveResource: (command: T) => string };
}

export const CommandHandler = <T extends ICommand, P extends CommandProps>(
  config: CommandHandlerMetadata<T, P>
): ClassDecorator => {
  return (commandHandler) => {
    const metadata: CommandHandlerMetadata<T, P> = config;
    Reflect.defineMetadata(COMMAND_HANDLER_METADATA, metadata, commandHandler);
  };
};

export const getCommandHandlerMetadata = <
  C extends ICommand,
  T extends ICommandHandler<C>,
  P extends CommandProps
>(
  commandHandler: new (props: CommandProps) => T
): CommandHandlerMetadata<C, P> => {
  return Reflect.getMetadata(COMMAND_HANDLER_METADATA, commandHandler);
};

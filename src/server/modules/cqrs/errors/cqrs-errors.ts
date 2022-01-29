export class CommandHandlerExistsException extends Error {
  constructor(commandName: string) {
    super(`The command handler ${commandName} already exists!`);
  }
}

export class CommandHandlerNotFoundException extends Error {
  constructor(commandName: string) {
    super(
      `The command handler for the "${commandName}" command was not found!`
    );
  }
}

export class InvalidCommandHandlerException extends Error {
  constructor() {
    super(
      `Invalid command handler exception (missing @CommandHandler() decorator?)`
    );
  }
}

export class InvalidEventsHandlerException extends Error {
  constructor() {
    super(
      `Invalid event handler exception (missing @EventsHandler() decorator?)`
    );
  }
}

export class InvalidQueryHandlerException extends Error {
  constructor() {
    super(
      `Invalid query handler exception (missing @QuerydHandler() decorator?)`
    );
  }
}

export class InvalidSagaException extends Error {
  constructor() {
    super(
      `Invalid saga exception. Each saga should return an Observable object`
    );
  }
}

export class QueryHandlerExistsException extends Error {
  constructor(name: string) {
    super(`The query handler ${name} already exists!`);
  }
}

export class QueryHandlerNotFoundException extends Error {
  constructor(queryName: string) {
    super(`The query handler for the "${queryName}" command was not found!`);
  }
}

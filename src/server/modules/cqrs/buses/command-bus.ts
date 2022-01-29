import { Injectable } from '@nestjs/common';
import {
  ICommand,
  ICommandHandler,
} from '../decorators/command-handler.decorator';

@Injectable()
export abstract class CommandBus {
  abstract execute(command: ICommand<unknown, any>): Promise<void>;

  abstract register<T extends ICommandHandler<any>>(
    handlers: (new (payload: unknown) => T)[] | undefined
  ): void;
}

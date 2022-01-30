import { Injectable } from '@nestjs/common';

import {
  GetHelloWorldProps,
  GetHelloWorldQuery,
  GetHelloWorldResult,
} from './get-hello-world';
import {
  ChangeHelloWorldProps,
  ChangeHelloWorldCommand,
} from './change-hello-world';
import {
  CreateHelloWorldProps,
  CreateHelloWorldCommand,
} from './create-hello-world';
import { CommandBus } from '../cqrs/buses/command-bus';
import { QueryBus } from '../cqrs/buses/query-bus';

@Injectable()
export class HelloWorldFeature {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  getHelloWorld = (props: GetHelloWorldProps): Promise<GetHelloWorldResult> =>
    this.queryBus.execute(new GetHelloWorldQuery(props));
  createHelloWorld = (props: CreateHelloWorldProps): Promise<void> =>
    this.commandBus.execute(new CreateHelloWorldCommand(props));
  changeHelloWorld = (props: ChangeHelloWorldProps): Promise<void> =>
    this.commandBus.execute(new ChangeHelloWorldCommand(props));
}

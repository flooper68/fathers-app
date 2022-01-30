import { CreateHelloWorldCommandHandler } from './create-hello-world';
import { GetHelloWorldQueryHandler } from './get-hello-world';
import { DynamicModule, Module } from '@nestjs/common';
import { HelloWorldContext } from './hello-world-context';
import { HelloWorldFeature } from './hello-world-feature';
import { ChangeHelloWorldCommandHandler } from './change-hello-world';

@Module({})
export class HelloWorldModule {
  static configure = (ContextModule: DynamicModule): DynamicModule => {
    return {
      module: HelloWorldModule,
      imports: [ContextModule],
      providers: [
        HelloWorldContext,

        HelloWorldFeature,
        GetHelloWorldQueryHandler,
        CreateHelloWorldCommandHandler,
        ChangeHelloWorldCommandHandler,
      ],
      exports: [HelloWorldFeature],
    };
  };
}

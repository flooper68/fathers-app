import { Module, DynamicModule } from '@nestjs/common';

@Module({})
export class InstanceManagementModule {
  static configure = (ContextModule: DynamicModule): DynamicModule => {
    return {
      module: InstanceManagementModule,
      imports: [ContextModule],
      providers: [],
      exports: [],
    };
  };
}

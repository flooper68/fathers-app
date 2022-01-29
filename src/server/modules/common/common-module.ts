import { DynamicModule, Module } from '@nestjs/common';

import { ApplicationConfigService } from './application-config';
import { ApplicationConfigToken } from './di-tokens';

@Module({})
export class CommonModule {
  static configure = <T extends () => unknown>(config: {
    getApplicationConfig: T;
  }): DynamicModule => {
    const contextConfigProvider = {
      provide: ApplicationConfigToken,
      useValue: config.getApplicationConfig,
    };

    return {
      module: CommonModule,
      providers: [ApplicationConfigService, contextConfigProvider],
      exports: [ApplicationConfigService],
    };
  };
}

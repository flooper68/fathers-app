import { Inject, Injectable } from '@nestjs/common';

import { ApplicationConfigToken } from './di-tokens';

@Injectable()
export class ApplicationConfigService<Config = never> {
  private readonly _config: Config;

  constructor(
    @Inject(ApplicationConfigToken)
    getApplicationConfig: () => Config
  ) {
    this._config = getApplicationConfig();
  }

  getConfig() {
    return this._config;
  }
}

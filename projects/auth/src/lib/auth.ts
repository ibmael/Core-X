import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { API_URL } from './tokens/api-url.token';

export interface AuthConfig {
  apiUrl: string;
}

export function provideAuth(config: AuthConfig): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: API_URL, useValue: config.apiUrl }]);
}

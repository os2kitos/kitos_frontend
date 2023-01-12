import { environment } from 'src/environments/environment';
import { ConfigurationParameters as ConfigurationParametersV1, Configuration as ConfigurationV1 } from './v1';
import { ConfigurationParameters as ConfigurationParametersV2, Configuration as ConfigurationV2 } from './v2';

export function apiConfigV1Factory(): ConfigurationV1 {
  const params: ConfigurationParametersV1 = {
    basePath: environment.basePath,
  };
  return new ConfigurationV1(params);
}

export function apiConfigV2Factory(): ConfigurationV2 {
  const params: ConfigurationParametersV2 = {
    basePath: environment.basePath,
  };
  return new ConfigurationV2(params);
}

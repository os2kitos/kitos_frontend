import { environment } from 'src/environments/environment';
import { Configuration as ConfigurationV1, ConfigurationParameters as ConfigurationParametersV1 } from './v1';
import { Configuration as ConfigurationV2, ConfigurationParameters as ConfigurationParametersV2 } from './v2';

export function apiConfigV1Factory(): ConfigurationV1 {
  const params: ConfigurationParametersV1 = {
    basePath: environment.apiBasePath,
  };
  return new ConfigurationV1(params);
}

export function apiConfigV2Factory(): ConfigurationV2 {
  const params: ConfigurationParametersV2 = {
    basePath: environment.apiBasePath,
  };
  return new ConfigurationV2(params);
}

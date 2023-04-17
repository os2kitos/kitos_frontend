import { Environment } from 'src/app/shared/models/environment';

export const environment: Environment = {
  env: 'development',
  apiBasePath: window.location.origin,
  siteBasePath: window.location.origin,
};

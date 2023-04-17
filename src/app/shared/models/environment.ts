export interface Environment {
  env: 'localhost' | 'development' | 'e2e' | 'production';
  apiBasePath: string;
  siteBasePath: string;
}

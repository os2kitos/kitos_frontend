export enum AppPath {
  root = '',
  wildcard = '**',

  organization = 'organization',

  itSystems = 'it-systems',
  itSystemUsages = 'it-system-usages',
  itSystemUsagesDetails = 'it-system-usages/:uuid',
  itSystemCatalog = 'it-system-catalog',
  itSystemCatalogDetails = 'it-system-catalog/:uuid',

  frontpage = 'frontpage',
  contracts = 'contracts',

  itContracts = 'it-contracts',
  itInterfaces = 'it-interfaces',
  itInterfacesDetails = 'it-interfaces/:uuid',
  hierarchy = 'hierarchy',

  dataProcessing = 'data-processing',
  gdpr = 'gdpr',

  notifications = 'notifications',

  profile = 'profile',

  globalAdmin = 'global-admin',
  helpTexts = 'help-texts',

  roles = 'roles',

  kle = 'kle',
  relations = 'system-relations',
  externalReferences = 'external-references',
  archiving = 'archiving',
}

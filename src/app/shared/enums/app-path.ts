export enum AppPath {
  root = '',
  wildcard = '**',
  uuid = ':uuid',

  organization = 'organization',
  organizations = 'organizations',

  itSystems = 'it-systems',
  itSystemUsages = 'it-system-usages',
  itSystemUsagesDetails = 'it-system-usages/:uuid',
  itSystemCatalog = 'it-system-catalog',
  itSystemCatalogDetails = 'it-system-catalog/:uuid',

  frontpage = 'frontpage',
  passwordReset = 'reset-password',
  contracts = 'contracts',

  itContracts = 'it-contracts',
  itContractDetails = 'it-contracts/:uuid',
  itInterfaces = 'it-interfaces',
  itInterfacesDetails = 'it-interfaces/:uuid',
  hierarchy = 'hierarchy',

  dataProcessing = 'data-processing',
  agreementDeadlines = 'agreement-deadlines',
  economy = 'economy',
  gdpr = 'gdpr',

  notifications = 'notifications',

  profile = 'profile',

  globalAdmin = 'global-admin',
  localAdmin = 'local-admin',
  localAdmins = 'local-admins',
  globalAdmins = 'global-admins',
  information = 'information',
  import = 'import',
  helpTexts = 'help-texts',
  localAdminSystemUsages = 'system',
  other = 'other',

  roles = 'roles',

  kle = 'kle',
  relations = 'system-relations',
  externalReferences = 'external-references',
  archiving = 'archiving',
  oversight = 'oversight',

  structure = 'structure',
  structureDetails = 'structure/:uuid',
  users = 'users',
  masterData = 'master-data',
}

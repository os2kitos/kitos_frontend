import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { APIV1AdviceUserRelationINTERNALService } from './api/v1AdviceUserRelationINTERNAL.service';
import { APIV1AuthorizeService } from './api/v1Authorize.service';
import { APIV1BrokenExternalReferencesReportINTERNALService } from './api/v1BrokenExternalReferencesReportINTERNAL.service';
import { APIV1ContactpersonService } from './api/v1Contactperson.service';
import { APIV1DataProcessingRegistrationService } from './api/v1DataProcessingRegistration.service';
import { APIV1DataProcessingRegistrationValidationINTERNALService } from './api/v1DataProcessingRegistrationValidationINTERNAL.service';
import { APIV1DataProtectionAdvisorService } from './api/v1DataProtectionAdvisor.service';
import { APIV1DataResponsibleService } from './api/v1DataResponsible.service';
import { APIV1DataRowService } from './api/v1DataRow.service';
import { APIV1EconomyStreamService } from './api/v1EconomyStream.service';
import { APIV1ExcelINTERNALService } from './api/v1ExcelINTERNAL.service';
import { APIV1ExhibitService } from './api/v1Exhibit.service';
import { APIV1GdprExportReportINTERNALService } from './api/v1GdprExportReportINTERNAL.service';
import { APIV1GlobalAdminINTERNALService } from './api/v1GlobalAdminINTERNAL.service';
import { APIV1HealthCheckINTERNALService } from './api/v1HealthCheckINTERNAL.service';
import { APIV1ItContractService } from './api/v1ItContract.service';
import { APIV1ItContractItSystemUsageService } from './api/v1ItContractItSystemUsage.service';
import { APIV1ItContractRightService } from './api/v1ItContractRight.service';
import { APIV1ItInterfaceService } from './api/v1ItInterface.service';
import { APIV1ItSystemService } from './api/v1ItSystem.service';
import { APIV1ItSystemUsageService } from './api/v1ItSystemUsage.service';
import { APIV1ItSystemUsageDataSensitivityLevelINTERNALService } from './api/v1ItSystemUsageDataSensitivityLevelINTERNAL.service';
import { APIV1ItSystemUsageMigrationINTERNALService } from './api/v1ItSystemUsageMigrationINTERNAL.service';
import { APIV1ItSystemUsageOptionsINTERNALService } from './api/v1ItSystemUsageOptionsINTERNAL.service';
import { APIV1ItSystemUsageOrgUnitUsageService } from './api/v1ItSystemUsageOrgUnitUsage.service';
import { APIV1ItSystemUsageRightsService } from './api/v1ItSystemUsageRights.service';
import { APIV1ItSystemUsageValidationINTERNALService } from './api/v1ItSystemUsageValidationINTERNAL.service';
import { APIV1KLEINTERNALService } from './api/v1KLEINTERNAL.service';
import { APIV1KendoOrganizationalConfigurationINTERNALService } from './api/v1KendoOrganizationalConfigurationINTERNAL.service';
import { APIV1ODATAAdviceINTERNALService } from './api/v1ODATAAdviceINTERNAL.service';
import { APIV1ODATAAdviceSentINTERNALService } from './api/v1ODATAAdviceSentINTERNAL.service';
import { APIV1ODATAAgreementElementTypesINTERNALService } from './api/v1ODATAAgreementElementTypesINTERNAL.service';
import { APIV1ODATAArchiveLocationsINTERNALService } from './api/v1ODATAArchiveLocationsINTERNAL.service';
import { APIV1ODATAArchivePeriodsService } from './api/v1ODATAArchivePeriods.service';
import { APIV1ODATAArchiveTestLocationsINTERNALService } from './api/v1ODATAArchiveTestLocationsINTERNAL.service';
import { APIV1ODATAArchiveTypesINTERNALService } from './api/v1ODATAArchiveTypesINTERNAL.service';
import { APIV1ODATAAttachedOptionsService } from './api/v1ODATAAttachedOptions.service';
import { APIV1ODATAAttachedOptionsRegisterTypesINTERNALService } from './api/v1ODATAAttachedOptionsRegisterTypesINTERNAL.service';
import { APIV1ODATAAttachedOptionsSensitivePersonalDataINTERNALService } from './api/v1ODATAAttachedOptionsSensitivePersonalDataINTERNAL.service';
import { APIV1ODATABusinessTypesINTERNALService } from './api/v1ODATABusinessTypesINTERNAL.service';
import { APIV1ODATAConfigsINTERNALService } from './api/v1ODATAConfigsINTERNAL.service';
import { APIV1ODATACriticalityTypesINTERNALService } from './api/v1ODATACriticalityTypesINTERNAL.service';
import { APIV1ODATADataProcessingBasisForTransferOptionsINTERNALService } from './api/v1ODATADataProcessingBasisForTransferOptionsINTERNAL.service';
import { APIV1ODATADataProcessingCountryOptionsINTERNALService } from './api/v1ODATADataProcessingCountryOptionsINTERNAL.service';
import { APIV1ODATADataProcessingDataResponsibleOptionsINTERNALService } from './api/v1ODATADataProcessingDataResponsibleOptionsINTERNAL.service';
import { APIV1ODATADataProcessingOversightOptionsINTERNALService } from './api/v1ODATADataProcessingOversightOptionsINTERNAL.service';
import { APIV1ODATADataProcessingRegistrationReadModelsINTERNALService } from './api/v1ODATADataProcessingRegistrationReadModelsINTERNAL.service';
import { APIV1ODATADataProcessingRegistrationRightsService } from './api/v1ODATADataProcessingRegistrationRights.service';
import { APIV1ODATADataProcessingRegistrationRolesINTERNALService } from './api/v1ODATADataProcessingRegistrationRolesINTERNAL.service';
import { APIV1ODATADataTypesINTERNALService } from './api/v1ODATADataTypesINTERNAL.service';
import { APIV1ODATAFrequencyTypesINTERNALService } from './api/v1ODATAFrequencyTypesINTERNAL.service';
import { APIV1ODATAHelpTextsINTERNALService } from './api/v1ODATAHelpTextsINTERNAL.service';
import { APIV1ODATAInterfaceTypesINTERNALService } from './api/v1ODATAInterfaceTypesINTERNAL.service';
import { APIV1ODATAItContractAgreementElementTypesService } from './api/v1ODATAItContractAgreementElementTypes.service';
import { APIV1ODATAItContractItSystemUsagesService } from './api/v1ODATAItContractItSystemUsages.service';
import { APIV1ODATAItContractOverviewReadModelsINTERNALService } from './api/v1ODATAItContractOverviewReadModelsINTERNAL.service';
import { APIV1ODATAItContractRightsService } from './api/v1ODATAItContractRights.service';
import { APIV1ODATAItContractRolesINTERNALService } from './api/v1ODATAItContractRolesINTERNAL.service';
import { APIV1ODATAItContractTemplateTypesINTERNALService } from './api/v1ODATAItContractTemplateTypesINTERNAL.service';
import { APIV1ODATAItContractTypesINTERNALService } from './api/v1ODATAItContractTypesINTERNAL.service';
import { APIV1ODATAItContractsService } from './api/v1ODATAItContracts.service';
import { APIV1ODATAItInterfaceExhibitsService } from './api/v1ODATAItInterfaceExhibits.service';
import { APIV1ODATAItInterfacesService } from './api/v1ODATAItInterfaces.service';
import { APIV1ODATAItSystemCategoriesINTERNALService } from './api/v1ODATAItSystemCategoriesINTERNAL.service';
import { APIV1ODATAItSystemRightsService } from './api/v1ODATAItSystemRights.service';
import { APIV1ODATAItSystemRolesINTERNALService } from './api/v1ODATAItSystemRolesINTERNAL.service';
import { APIV1ODATAItSystemUsageOverviewReadModelsINTERNALService } from './api/v1ODATAItSystemUsageOverviewReadModelsINTERNAL.service';
import { APIV1ODATAItSystemUsagesService } from './api/v1ODATAItSystemUsages.service';
import { APIV1ODATAItSystemsService } from './api/v1ODATAItSystems.service';
import { APIV1ODATALocalAgreementElementTypesINTERNALService } from './api/v1ODATALocalAgreementElementTypesINTERNAL.service';
import { APIV1ODATALocalArchiveLocationsINTERNALService } from './api/v1ODATALocalArchiveLocationsINTERNAL.service';
import { APIV1ODATALocalArchiveTestLocationsINTERNALService } from './api/v1ODATALocalArchiveTestLocationsINTERNAL.service';
import { APIV1ODATALocalArchiveTypesINTERNALService } from './api/v1ODATALocalArchiveTypesINTERNAL.service';
import { APIV1ODATALocalBusinessTypesINTERNALService } from './api/v1ODATALocalBusinessTypesINTERNAL.service';
import { APIV1ODATALocalCriticalityTypesINTERNALService } from './api/v1ODATALocalCriticalityTypesINTERNAL.service';
import { APIV1ODATALocalDataProcessingBasisForTransferOptionsService } from './api/v1ODATALocalDataProcessingBasisForTransferOptions.service';
import { APIV1ODATALocalDataProcessingCountryOptionsService } from './api/v1ODATALocalDataProcessingCountryOptions.service';
import { APIV1ODATALocalDataProcessingDataResponsibleOptionsService } from './api/v1ODATALocalDataProcessingDataResponsibleOptions.service';
import { APIV1ODATALocalDataProcessingOversightOptionsService } from './api/v1ODATALocalDataProcessingOversightOptions.service';
import { APIV1ODATALocalDataProcessingRegistrationRolesService } from './api/v1ODATALocalDataProcessingRegistrationRoles.service';
import { APIV1ODATALocalDataTypesINTERNALService } from './api/v1ODATALocalDataTypesINTERNAL.service';
import { APIV1ODATALocalFrequencyTypesINTERNALService } from './api/v1ODATALocalFrequencyTypesINTERNAL.service';
import { APIV1ODATALocalInterfaceTypesINTERNALService } from './api/v1ODATALocalInterfaceTypesINTERNAL.service';
import { APIV1ODATALocalItContractRolesINTERNALService } from './api/v1ODATALocalItContractRolesINTERNAL.service';
import { APIV1ODATALocalItContractTemplateTypesINTERNALService } from './api/v1ODATALocalItContractTemplateTypesINTERNAL.service';
import { APIV1ODATALocalItContractTypesINTERNALService } from './api/v1ODATALocalItContractTypesINTERNAL.service';
import { APIV1ODATALocalItSystemCategoriesINTERNALService } from './api/v1ODATALocalItSystemCategoriesINTERNAL.service';
import { APIV1ODATALocalItSystemRolesService } from './api/v1ODATALocalItSystemRoles.service';
import { APIV1ODATALocalOptionExtendTypesINTERNALService } from './api/v1ODATALocalOptionExtendTypesINTERNAL.service';
import { APIV1ODATALocalOrganizationUnitRolesINTERNALService } from './api/v1ODATALocalOrganizationUnitRolesINTERNAL.service';
import { APIV1ODATALocalPaymentFrequencyTypesINTERNALService } from './api/v1ODATALocalPaymentFrequencyTypesINTERNAL.service';
import { APIV1ODATALocalPaymentModelTypesINTERNALService } from './api/v1ODATALocalPaymentModelTypesINTERNAL.service';
import { APIV1ODATALocalPriceRegulationTypesINTERNALService } from './api/v1ODATALocalPriceRegulationTypesINTERNAL.service';
import { APIV1ODATALocalProcurementStrategyTypesINTERNALService } from './api/v1ODATALocalProcurementStrategyTypesINTERNAL.service';
import { APIV1ODATALocalPurchaseFormTypesINTERNALService } from './api/v1ODATALocalPurchaseFormTypesINTERNAL.service';
import { APIV1ODATALocalRegisterTypesINTERNALService } from './api/v1ODATALocalRegisterTypesINTERNAL.service';
import { APIV1ODATALocalSensitiveDataTypesINTERNALService } from './api/v1ODATALocalSensitiveDataTypesINTERNAL.service';
import { APIV1ODATALocalSensitivePersonalDataTypesINTERNALService } from './api/v1ODATALocalSensitivePersonalDataTypesINTERNAL.service';
import { APIV1ODATALocalTerminationDeadlineTypesINTERNALService } from './api/v1ODATALocalTerminationDeadlineTypesINTERNAL.service';
import { APIV1ODATAOptionExtendTypesINTERNALService } from './api/v1ODATAOptionExtendTypesINTERNAL.service';
import { APIV1ODATAOrganizationRightsINTERNALService } from './api/v1ODATAOrganizationRightsINTERNAL.service';
import { APIV1ODATAOrganizationUnitRightsINTERNALService } from './api/v1ODATAOrganizationUnitRightsINTERNAL.service';
import { APIV1ODATAOrganizationUnitRolesINTERNALService } from './api/v1ODATAOrganizationUnitRolesINTERNAL.service';
import { APIV1ODATAOrganizationUnitsINTERNALService } from './api/v1ODATAOrganizationUnitsINTERNAL.service';
import { APIV1ODATAOrganizationsINTERNALService } from './api/v1ODATAOrganizationsINTERNAL.service';
import { APIV1ODATAPaymentFrequencyTypesINTERNALService } from './api/v1ODATAPaymentFrequencyTypesINTERNAL.service';
import { APIV1ODATAPaymentModelTypesINTERNALService } from './api/v1ODATAPaymentModelTypesINTERNAL.service';
import { APIV1ODATAPriceRegulationTypesINTERNALService } from './api/v1ODATAPriceRegulationTypesINTERNAL.service';
import { APIV1ODATAProcurementStrategyTypesINTERNALService } from './api/v1ODATAProcurementStrategyTypesINTERNAL.service';
import { APIV1ODATAPurchaseFormTypesINTERNALService } from './api/v1ODATAPurchaseFormTypesINTERNAL.service';
import { APIV1ODATARegisterTypesINTERNALService } from './api/v1ODATARegisterTypesINTERNAL.service';
import { APIV1ODATASSOService } from './api/v1ODATASSO.service';
import { APIV1ODATASensitiveDataTypesINTERNALService } from './api/v1ODATASensitiveDataTypesINTERNAL.service';
import { APIV1ODATASensitivePersonalDataTypesINTERNALService } from './api/v1ODATASensitivePersonalDataTypesINTERNAL.service';
import { APIV1ODATATerminationDeadlineTypesINTERNALService } from './api/v1ODATATerminationDeadlineTypesINTERNAL.service';
import { APIV1ODATAUsersINTERNALService } from './api/v1ODATAUsersINTERNAL.service';
import { APIV1OrganizationINTERNALService } from './api/v1OrganizationINTERNAL.service';
import { APIV1OrganizationLifeCycleINTERNALService } from './api/v1OrganizationLifeCycleINTERNAL.service';
import { APIV1OrganizationPermissionsINTERNALService } from './api/v1OrganizationPermissionsINTERNAL.service';
import { APIV1OrganizationRightINTERNALService } from './api/v1OrganizationRightINTERNAL.service';
import { APIV1OrganizationUnitINTERNALService } from './api/v1OrganizationUnitINTERNAL.service';
import { APIV1OrganizationUnitLifeCycleINTERNALService } from './api/v1OrganizationUnitLifeCycleINTERNAL.service';
import { APIV1OrganizationUnitPermissionsINTERNALService } from './api/v1OrganizationUnitPermissionsINTERNAL.service';
import { APIV1OrganizationUnitRegistrationINTERNALService } from './api/v1OrganizationUnitRegistrationINTERNAL.service';
import { APIV1OrganizationUnitRightINTERNALService } from './api/v1OrganizationUnitRightINTERNAL.service';
import { APIV1PasswordResetRequestService } from './api/v1PasswordResetRequest.service';
import { APIV1ReferenceService } from './api/v1Reference.service';
import { APIV1StsOrganizationSynchronizationINTERNALService } from './api/v1StsOrganizationSynchronizationINTERNAL.service';
import { APIV1SystemRelationService } from './api/v1SystemRelation.service';
import { APIV1TaskRefService } from './api/v1TaskRef.service';
import { APIV1TextINTERNALService } from './api/v1TextINTERNAL.service';
import { APIV1UIModuleCustomizationINTERNALService } from './api/v1UIModuleCustomizationINTERNAL.service';
import { APIV1UserAdministrationPermissionsService } from './api/v1UserAdministrationPermissions.service';
import { APIV1UserDeletionService } from './api/v1UserDeletion.service';
import { APIV1UserINTERNALService } from './api/v1UserINTERNAL.service';
import { APIV1UserNotificationINTERNALService } from './api/v1UserNotificationINTERNAL.service';
import { APIV1UserRolesManagementINTERNALService } from './api/v1UserRolesManagementINTERNAL.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}

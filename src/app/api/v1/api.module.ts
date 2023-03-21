import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { APIV1AdviceUserRelationINTERNALService } from './api/v1AdviceUserRelationINTERNAL.service';
import { APIV1AuthorizeINTERNALService } from './api/v1AuthorizeINTERNAL.service';
import { APIV1BrokenExternalReferencesReportINTERNALService } from './api/v1BrokenExternalReferencesReportINTERNAL.service';
import { APIV1ContactpersonINTERNALService } from './api/v1ContactpersonINTERNAL.service';
import { APIV1DataProcessingRegistrationINTERNALService } from './api/v1DataProcessingRegistrationINTERNAL.service';
import { APIV1DataProcessingRegistrationValidationINTERNALService } from './api/v1DataProcessingRegistrationValidationINTERNAL.service';
import { APIV1DataProtectionAdvisorINTERNALService } from './api/v1DataProtectionAdvisorINTERNAL.service';
import { APIV1DataResponsibleINTERNALService } from './api/v1DataResponsibleINTERNAL.service';
import { APIV1DataRowINTERNALService } from './api/v1DataRowINTERNAL.service';
import { APIV1EconomyStreamINTERNALService } from './api/v1EconomyStreamINTERNAL.service';
import { APIV1ExcelINTERNALService } from './api/v1ExcelINTERNAL.service';
import { APIV1ExhibitINTERNALService } from './api/v1ExhibitINTERNAL.service';
import { APIV1GdprExportReportINTERNALService } from './api/v1GdprExportReportINTERNAL.service';
import { APIV1GlobalAdminINTERNALService } from './api/v1GlobalAdminINTERNAL.service';
import { APIV1HealthCheckINTERNALService } from './api/v1HealthCheckINTERNAL.service';
import { APIV1ItContractINTERNALService } from './api/v1ItContractINTERNAL.service';
import { APIV1ItContractItSystemUsageINTERNALService } from './api/v1ItContractItSystemUsageINTERNAL.service';
import { APIV1ItContractRightINTERNALService } from './api/v1ItContractRightINTERNAL.service';
import { APIV1ItInterfaceINTERNALService } from './api/v1ItInterfaceINTERNAL.service';
import { APIV1ItSystemINTERNALService } from './api/v1ItSystemINTERNAL.service';
import { APIV1ItSystemUsageDataSensitivityLevelINTERNALService } from './api/v1ItSystemUsageDataSensitivityLevelINTERNAL.service';
import { APIV1ItSystemUsageINTERNALService } from './api/v1ItSystemUsageINTERNAL.service';
import { APIV1ItSystemUsageOptionsINTERNALService } from './api/v1ItSystemUsageOptionsINTERNAL.service';
import { APIV1ItSystemUsageOrgUnitUsageINTERNALService } from './api/v1ItSystemUsageOrgUnitUsageINTERNAL.service';
import { APIV1ItSystemUsageRightsINTERNALService } from './api/v1ItSystemUsageRightsINTERNAL.service';
import { APIV1ItSystemUsageValidationINTERNALService } from './api/v1ItSystemUsageValidationINTERNAL.service';
import { APIV1KLEINTERNALService } from './api/v1KLEINTERNAL.service';
import { APIV1KendoOrganizationalConfigurationINTERNALService } from './api/v1KendoOrganizationalConfigurationINTERNAL.service';
import { APIV1ODATAAdviceINTERNALService } from './api/v1ODATAAdviceINTERNAL.service';
import { APIV1ODATAAdviceSentINTERNALService } from './api/v1ODATAAdviceSentINTERNAL.service';
import { APIV1ODATAAgreementElementTypesINTERNALService } from './api/v1ODATAAgreementElementTypesINTERNAL.service';
import { APIV1ODATAArchiveLocationsINTERNALService } from './api/v1ODATAArchiveLocationsINTERNAL.service';
import { APIV1ODATAArchivePeriodsINTERNALService } from './api/v1ODATAArchivePeriodsINTERNAL.service';
import { APIV1ODATAArchiveTestLocationsINTERNALService } from './api/v1ODATAArchiveTestLocationsINTERNAL.service';
import { APIV1ODATAArchiveTypesINTERNALService } from './api/v1ODATAArchiveTypesINTERNAL.service';
import { APIV1ODATAAttachedOptionsINTERNALService } from './api/v1ODATAAttachedOptionsINTERNAL.service';
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
import { APIV1ODATADataProcessingRegistrationRightsINTERNALService } from './api/v1ODATADataProcessingRegistrationRightsINTERNAL.service';
import { APIV1ODATADataProcessingRegistrationRolesINTERNALService } from './api/v1ODATADataProcessingRegistrationRolesINTERNAL.service';
import { APIV1ODATADataTypesINTERNALService } from './api/v1ODATADataTypesINTERNAL.service';
import { APIV1ODATAFrequencyTypesINTERNALService } from './api/v1ODATAFrequencyTypesINTERNAL.service';
import { APIV1ODATAHelpTextsINTERNALService } from './api/v1ODATAHelpTextsINTERNAL.service';
import { APIV1ODATAInterfaceTypesINTERNALService } from './api/v1ODATAInterfaceTypesINTERNAL.service';
import { APIV1ODATAItContractAgreementElementTypesINTERNALService } from './api/v1ODATAItContractAgreementElementTypesINTERNAL.service';
import { APIV1ODATAItContractItSystemUsagesINTERNALService } from './api/v1ODATAItContractItSystemUsagesINTERNAL.service';
import { APIV1ODATAItContractOverviewReadModelsINTERNALService } from './api/v1ODATAItContractOverviewReadModelsINTERNAL.service';
import { APIV1ODATAItContractRightsINTERNALService } from './api/v1ODATAItContractRightsINTERNAL.service';
import { APIV1ODATAItContractRolesINTERNALService } from './api/v1ODATAItContractRolesINTERNAL.service';
import { APIV1ODATAItContractTemplateTypesINTERNALService } from './api/v1ODATAItContractTemplateTypesINTERNAL.service';
import { APIV1ODATAItContractTypesINTERNALService } from './api/v1ODATAItContractTypesINTERNAL.service';
import { APIV1ODATAItContractsINTERNALService } from './api/v1ODATAItContractsINTERNAL.service';
import { APIV1ODATAItInterfaceExhibitsINTERNALService } from './api/v1ODATAItInterfaceExhibitsINTERNAL.service';
import { APIV1ODATAItInterfacesINTERNALService } from './api/v1ODATAItInterfacesINTERNAL.service';
import { APIV1ODATAItSystemCategoriesINTERNALService } from './api/v1ODATAItSystemCategoriesINTERNAL.service';
import { APIV1ODATAItSystemRightsINTERNALService } from './api/v1ODATAItSystemRightsINTERNAL.service';
import { APIV1ODATAItSystemRolesINTERNALService } from './api/v1ODATAItSystemRolesINTERNAL.service';
import { APIV1ODATAItSystemUsageOverviewReadModelsINTERNALService } from './api/v1ODATAItSystemUsageOverviewReadModelsINTERNAL.service';
import { APIV1ODATAItSystemUsagesINTERNALService } from './api/v1ODATAItSystemUsagesINTERNAL.service';
import { APIV1ODATAItSystemsINTERNALService } from './api/v1ODATAItSystemsINTERNAL.service';
import { APIV1ODATALocalAgreementElementTypesINTERNALService } from './api/v1ODATALocalAgreementElementTypesINTERNAL.service';
import { APIV1ODATALocalArchiveLocationsINTERNALService } from './api/v1ODATALocalArchiveLocationsINTERNAL.service';
import { APIV1ODATALocalArchiveTestLocationsINTERNALService } from './api/v1ODATALocalArchiveTestLocationsINTERNAL.service';
import { APIV1ODATALocalArchiveTypesINTERNALService } from './api/v1ODATALocalArchiveTypesINTERNAL.service';
import { APIV1ODATALocalBusinessTypesINTERNALService } from './api/v1ODATALocalBusinessTypesINTERNAL.service';
import { APIV1ODATALocalCriticalityTypesINTERNALService } from './api/v1ODATALocalCriticalityTypesINTERNAL.service';
import { APIV1ODATALocalDataProcessingBasisForTransferOptionsINTERNALService } from './api/v1ODATALocalDataProcessingBasisForTransferOptionsINTERNAL.service';
import { APIV1ODATALocalDataProcessingCountryOptionsINTERNALService } from './api/v1ODATALocalDataProcessingCountryOptionsINTERNAL.service';
import { APIV1ODATALocalDataProcessingDataResponsibleOptionsINTERNALService } from './api/v1ODATALocalDataProcessingDataResponsibleOptionsINTERNAL.service';
import { APIV1ODATALocalDataProcessingOversightOptionsINTERNALService } from './api/v1ODATALocalDataProcessingOversightOptionsINTERNAL.service';
import { APIV1ODATALocalDataProcessingRegistrationRolesINTERNALService } from './api/v1ODATALocalDataProcessingRegistrationRolesINTERNAL.service';
import { APIV1ODATALocalDataTypesINTERNALService } from './api/v1ODATALocalDataTypesINTERNAL.service';
import { APIV1ODATALocalFrequencyTypesINTERNALService } from './api/v1ODATALocalFrequencyTypesINTERNAL.service';
import { APIV1ODATALocalInterfaceTypesINTERNALService } from './api/v1ODATALocalInterfaceTypesINTERNAL.service';
import { APIV1ODATALocalItContractRolesINTERNALService } from './api/v1ODATALocalItContractRolesINTERNAL.service';
import { APIV1ODATALocalItContractTemplateTypesINTERNALService } from './api/v1ODATALocalItContractTemplateTypesINTERNAL.service';
import { APIV1ODATALocalItContractTypesINTERNALService } from './api/v1ODATALocalItContractTypesINTERNAL.service';
import { APIV1ODATALocalItSystemCategoriesINTERNALService } from './api/v1ODATALocalItSystemCategoriesINTERNAL.service';
import { APIV1ODATALocalItSystemRolesINTERNALService } from './api/v1ODATALocalItSystemRolesINTERNAL.service';
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
import { APIV1ODATASSOINTERNALService } from './api/v1ODATASSOINTERNAL.service';
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
import { APIV1PasswordResetRequestINTERNALService } from './api/v1PasswordResetRequestINTERNAL.service';
import { APIV1ReferenceINTERNALService } from './api/v1ReferenceINTERNAL.service';
import { APIV1StsOrganizationSynchronizationINTERNALService } from './api/v1StsOrganizationSynchronizationINTERNAL.service';
import { APIV1SystemRelationINTERNALService } from './api/v1SystemRelationINTERNAL.service';
import { APIV1TaskRefINTERNALService } from './api/v1TaskRefINTERNAL.service';
import { APIV1TextINTERNALService } from './api/v1TextINTERNAL.service';
import { APIV1TokenAuthenticationService } from './api/v1TokenAuthentication.service';
import { APIV1UIModuleCustomizationINTERNALService } from './api/v1UIModuleCustomizationINTERNAL.service';
import { APIV1UserAdministrationPermissionsINTERNALService } from './api/v1UserAdministrationPermissionsINTERNAL.service';
import { APIV1UserDeletionINTERNALService } from './api/v1UserDeletionINTERNAL.service';
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

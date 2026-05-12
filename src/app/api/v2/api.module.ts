import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { AlertsV2Service } from './api/alertsV2.service';
import { BrokenExternalReferencesReportInternalV2Service } from './api/brokenExternalReferencesReportInternalV2.service';
import { DataProcessingRegistrationBasisForTransferTypeV2Service } from './api/dataProcessingRegistrationBasisForTransferTypeV2.service';
import { DataProcessingRegistrationCountryTypeV2Service } from './api/dataProcessingRegistrationCountryTypeV2.service';
import { DataProcessingRegistrationDataResponsibleTypeV2Service } from './api/dataProcessingRegistrationDataResponsibleTypeV2.service';
import { DataProcessingRegistrationInternalV2Service } from './api/dataProcessingRegistrationInternalV2.service';
import { DataProcessingRegistrationOversightDatesV2Service } from './api/dataProcessingRegistrationOversightDatesV2.service';
import { DataProcessingRegistrationOversightTypeV2Service } from './api/dataProcessingRegistrationOversightTypeV2.service';
import { DataProcessingRegistrationRoleTypeV2Service } from './api/dataProcessingRegistrationRoleTypeV2.service';
import { DataProcessingRegistrationV2Service } from './api/dataProcessingRegistrationV2.service';
import { DeltaFeedV2Service } from './api/deltaFeedV2.service';
import { DprGlobalDataProcessingBasisForTransferOptionsInternalV2Service } from './api/dprGlobalDataProcessingBasisForTransferOptionsInternalV2.service';
import { DprGlobalDataProcessingCountryOptionsInternalV2Service } from './api/dprGlobalDataProcessingCountryOptionsInternalV2.service';
import { DprGlobalDataProcessingDataResponsibleOptionsInternalV2Service } from './api/dprGlobalDataProcessingDataResponsibleOptionsInternalV2.service';
import { DprGlobalDataProcessingOversightOptionsInternalV2Service } from './api/dprGlobalDataProcessingOversightOptionsInternalV2.service';
import { DprGlobalRoleOptionTypesInternalV2Service } from './api/dprGlobalRoleOptionTypesInternalV2.service';
import { DprLocalBasisForTransferTypesInternalV2Service } from './api/dprLocalBasisForTransferTypesInternalV2.service';
import { DprLocalCountryOptionTypesInternalV2Service } from './api/dprLocalCountryOptionTypesInternalV2.service';
import { DprLocalDataResponsibleTypesInternalV2Service } from './api/dprLocalDataResponsibleTypesInternalV2.service';
import { DprLocalOversightOptionTypesInternalV2Service } from './api/dprLocalOversightOptionTypesInternalV2.service';
import { DprLocalRoleOptionTypesInternalV2Service } from './api/dprLocalRoleOptionTypesInternalV2.service';
import { ExternalReferencesInternalV2Service } from './api/externalReferencesInternalV2.service';
import { GdprExportReportInternalV2Service } from './api/gdprExportReportInternalV2.service';
import { GlobalUserInternalV2Service } from './api/globalUserInternalV2.service';
import { GridLocalItContractRolesV2Service } from './api/gridLocalItContractRolesV2.service';
import { HelpTextsInternalV2Service } from './api/helpTextsInternalV2.service';
import { ItContractAgreementElementTypeV2Service } from './api/itContractAgreementElementTypeV2.service';
import { ItContractAgreementExtensionOptionTypeV2Service } from './api/itContractAgreementExtensionOptionTypeV2.service';
import { ItContractContractTemplateTypeV2Service } from './api/itContractContractTemplateTypeV2.service';
import { ItContractContractTypeV2Service } from './api/itContractContractTypeV2.service';
import { ItContractCriticalityTypeV2Service } from './api/itContractCriticalityTypeV2.service';
import { ItContractGlobalAgreementElementTypesInternalV2Service } from './api/itContractGlobalAgreementElementTypesInternalV2.service';
import { ItContractGlobalCriticalityTypesInternalV2Service } from './api/itContractGlobalCriticalityTypesInternalV2.service';
import { ItContractGlobalItContractRoleTypesInternalV2Service } from './api/itContractGlobalItContractRoleTypesInternalV2.service';
import { ItContractGlobalItContractTemplateTypesInternalV2Service } from './api/itContractGlobalItContractTemplateTypesInternalV2.service';
import { ItContractGlobalItContractTypesInternalV2Service } from './api/itContractGlobalItContractTypesInternalV2.service';
import { ItContractGlobalOptionExtendTypesInternalV2Service } from './api/itContractGlobalOptionExtendTypesInternalV2.service';
import { ItContractGlobalPaymentFrequencyTypesInternalV2Service } from './api/itContractGlobalPaymentFrequencyTypesInternalV2.service';
import { ItContractGlobalPaymentModelTypesInternalV2Service } from './api/itContractGlobalPaymentModelTypesInternalV2.service';
import { ItContractGlobalPriceRegulationTypesInternalV2Service } from './api/itContractGlobalPriceRegulationTypesInternalV2.service';
import { ItContractGlobalProcurementStrategyTypesInternalV2Service } from './api/itContractGlobalProcurementStrategyTypesInternalV2.service';
import { ItContractGlobalPurchaseFormTypesInternalV2Service } from './api/itContractGlobalPurchaseFormTypesInternalV2.service';
import { ItContractGlobalTerminationDeadlineTypesInternalV2Service } from './api/itContractGlobalTerminationDeadlineTypesInternalV2.service';
import { ItContractInternalV2Service } from './api/itContractInternalV2.service';
import { ItContractLocalAgreementElementTypesInternalV2Service } from './api/itContractLocalAgreementElementTypesInternalV2.service';
import { ItContractLocalContractTypesInternalV2Service } from './api/itContractLocalContractTypesInternalV2.service';
import { ItContractLocalCriticalityTypesInternalV2Service } from './api/itContractLocalCriticalityTypesInternalV2.service';
import { ItContractLocalOptionExtendTypesInternalV2Service } from './api/itContractLocalOptionExtendTypesInternalV2.service';
import { ItContractLocalPaymentFrequencyTypesInternalV2Service } from './api/itContractLocalPaymentFrequencyTypesInternalV2.service';
import { ItContractLocalPaymentModelTypesInternalV2Service } from './api/itContractLocalPaymentModelTypesInternalV2.service';
import { ItContractLocalPriceRegulationTypesInternalV2Service } from './api/itContractLocalPriceRegulationTypesInternalV2.service';
import { ItContractLocalProcurementStrategyTypesInternalV2Service } from './api/itContractLocalProcurementStrategyTypesInternalV2.service';
import { ItContractLocalPurchaseFormTypesInternalV2Service } from './api/itContractLocalPurchaseFormTypesInternalV2.service';
import { ItContractLocalRoleOptionTypesInternalV2Service } from './api/itContractLocalRoleOptionTypesInternalV2.service';
import { ItContractLocalTemplateTypesInternalV2Service } from './api/itContractLocalTemplateTypesInternalV2.service';
import { ItContractLocalTerminationDeadlineTypesInternalV2Service } from './api/itContractLocalTerminationDeadlineTypesInternalV2.service';
import { ItContractNoticePeriodMonthTypeV2Service } from './api/itContractNoticePeriodMonthTypeV2.service';
import { ItContractPaymentFrequencyTypeV2Service } from './api/itContractPaymentFrequencyTypeV2.service';
import { ItContractPaymentModelTypeV2Service } from './api/itContractPaymentModelTypeV2.service';
import { ItContractPriceRegulationTypeV2Service } from './api/itContractPriceRegulationTypeV2.service';
import { ItContractProcurementStrategyV2Service } from './api/itContractProcurementStrategyV2.service';
import { ItContractPurchaseTypeV2Service } from './api/itContractPurchaseTypeV2.service';
import { ItContractRoleTypeV2Service } from './api/itContractRoleTypeV2.service';
import { ItContractV2Service } from './api/itContractV2.service';
import { ItInterfaceInterfaceDataTypeV2Service } from './api/itInterfaceInterfaceDataTypeV2.service';
import { ItInterfaceInterfaceTypeV2Service } from './api/itInterfaceInterfaceTypeV2.service';
import { ItInterfaceV2Service } from './api/itInterfaceV2.service';
import { ItSystemBusinessTypeV2Service } from './api/itSystemBusinessTypeV2.service';
import { ItSystemDBSV2Service } from './api/itSystemDBSV2.service';
import { ItSystemGlobalArchiveLocationsInternalV2Service } from './api/itSystemGlobalArchiveLocationsInternalV2.service';
import { ItSystemGlobalArchiveTestLocationsInternalV2Service } from './api/itSystemGlobalArchiveTestLocationsInternalV2.service';
import { ItSystemGlobalArchiveTypesInternalV2Service } from './api/itSystemGlobalArchiveTypesInternalV2.service';
import { ItSystemGlobalBusinessTypesInternalV2Service } from './api/itSystemGlobalBusinessTypesInternalV2.service';
import { ItSystemGlobalDataTypesInternalV2Service } from './api/itSystemGlobalDataTypesInternalV2.service';
import { ItSystemGlobalFrequencyTypesInternalV2Service } from './api/itSystemGlobalFrequencyTypesInternalV2.service';
import { ItSystemGlobalInterfaceTypesInternalV2Service } from './api/itSystemGlobalInterfaceTypesInternalV2.service';
import { ItSystemGlobalItSystemCategoriesInternalV2Service } from './api/itSystemGlobalItSystemCategoriesInternalV2.service';
import { ItSystemGlobalRegisterTypesInternalV2Service } from './api/itSystemGlobalRegisterTypesInternalV2.service';
import { ItSystemGlobalRoleOptionTypesInternalV2Service } from './api/itSystemGlobalRoleOptionTypesInternalV2.service';
import { ItSystemGlobalSensitivePersonalDataTypesInternalV2Service } from './api/itSystemGlobalSensitivePersonalDataTypesInternalV2.service';
import { ItSystemGlobalSystemUsageCriticalityLevelTypesInternalV2Service } from './api/itSystemGlobalSystemUsageCriticalityLevelTypesInternalV2.service';
import { ItSystemGlobalTechnicalSystemTypesInternalV2Service } from './api/itSystemGlobalTechnicalSystemTypesInternalV2.service';
import { ItSystemInternalV2Service } from './api/itSystemInternalV2.service';
import { ItSystemLocalArchiveLocationTypesInternalV2Service } from './api/itSystemLocalArchiveLocationTypesInternalV2.service';
import { ItSystemLocalArchiveTestLocationTypesInternalV2Service } from './api/itSystemLocalArchiveTestLocationTypesInternalV2.service';
import { ItSystemLocalArchiveTypesInternalV2Service } from './api/itSystemLocalArchiveTypesInternalV2.service';
import { ItSystemLocalBusinessTypesInternalV2Service } from './api/itSystemLocalBusinessTypesInternalV2.service';
import { ItSystemLocalDataTypesInternalV2Service } from './api/itSystemLocalDataTypesInternalV2.service';
import { ItSystemLocalFrequencyTypesInternalV2Service } from './api/itSystemLocalFrequencyTypesInternalV2.service';
import { ItSystemLocalInterfaceTypesInternalV2Service } from './api/itSystemLocalInterfaceTypesInternalV2.service';
import { ItSystemLocalItSystemCategoriesTypesInternalV2Service } from './api/itSystemLocalItSystemCategoriesTypesInternalV2.service';
import { ItSystemLocalRegisterTypesInternalV2Service } from './api/itSystemLocalRegisterTypesInternalV2.service';
import { ItSystemLocalRoleOptionTypesInternalV2Service } from './api/itSystemLocalRoleOptionTypesInternalV2.service';
import { ItSystemLocalSensitivePersonalDataTypesInternalV2Service } from './api/itSystemLocalSensitivePersonalDataTypesInternalV2.service';
import { ItSystemLocalSystemUsageCriticalityLevelTypesInternalV2Service } from './api/itSystemLocalSystemUsageCriticalityLevelTypesInternalV2.service';
import { ItSystemLocalTechnicalSystemTypesInternalV2Service } from './api/itSystemLocalTechnicalSystemTypesInternalV2.service';
import { ItSystemUsageArchiveLocationTypeV2Service } from './api/itSystemUsageArchiveLocationTypeV2.service';
import { ItSystemUsageArchiveTestLocationTypeV2Service } from './api/itSystemUsageArchiveTestLocationTypeV2.service';
import { ItSystemUsageArchiveTypeV2Service } from './api/itSystemUsageArchiveTypeV2.service';
import { ItSystemUsageCriticalityLevelTypeV2Service } from './api/itSystemUsageCriticalityLevelTypeV2.service';
import { ItSystemUsageDataClassificationTypeV2Service } from './api/itSystemUsageDataClassificationTypeV2.service';
import { ItSystemUsageInternalV2Service } from './api/itSystemUsageInternalV2.service';
import { ItSystemUsageMigrationV2Service } from './api/itSystemUsageMigrationV2.service';
import { ItSystemUsageRegisteredDataCategoryTypeV2Service } from './api/itSystemUsageRegisteredDataCategoryTypeV2.service';
import { ItSystemUsageRelationFrequencyTypeV2Service } from './api/itSystemUsageRelationFrequencyTypeV2.service';
import { ItSystemUsageRoleTypeV2Service } from './api/itSystemUsageRoleTypeV2.service';
import { ItSystemUsageSensitivePersonalDataTypeV2Service } from './api/itSystemUsageSensitivePersonalDataTypeV2.service';
import { ItSystemUsageTechnicalSystemTypeV2Service } from './api/itSystemUsageTechnicalSystemTypeV2.service';
import { ItSystemUsageV2Service } from './api/itSystemUsageV2.service';
import { ItSystemV2Service } from './api/itSystemV2.service';
import { KLEInternalV2Service } from './api/kLEInternalV2.service';
import { KleOptionV2Service } from './api/kleOptionV2.service';
import { NotificationV2Service } from './api/notificationV2.service';
import { OrganizationGlobalCountryCodesInternalV2Service } from './api/organizationGlobalCountryCodesInternalV2.service';
import { OrganizationGridInternalV2Service } from './api/organizationGridInternalV2.service';
import { OrganizationSupplierInternalV2Service } from './api/organizationSupplierInternalV2.service';
import { OrganizationUnitGlobalRoleOptionTypesInternalV2Service } from './api/organizationUnitGlobalRoleOptionTypesInternalV2.service';
import { OrganizationUnitLocalRoleOptionTypesInternalV2Service } from './api/organizationUnitLocalRoleOptionTypesInternalV2.service';
import { OrganizationUnitRegistrationInternalV2Service } from './api/organizationUnitRegistrationInternalV2.service';
import { OrganizationUnitRoleTypeV2Service } from './api/organizationUnitRoleTypeV2.service';
import { OrganizationUnitsInternalV2Service } from './api/organizationUnitsInternalV2.service';
import { OrganizationV2Service } from './api/organizationV2.service';
import { OrganizationsInternalV2Service } from './api/organizationsInternalV2.service';
import { PasswordResetInternalV2Service } from './api/passwordResetInternalV2.service';
import { PublicMessagesV2Service } from './api/publicMessagesV2.service';
import { StsOrganizationSynchronizationInternalV2Service } from './api/stsOrganizationSynchronizationInternalV2.service';
import { TokenV2Service } from './api/tokenV2.service';
import { UsersInternalV2Service } from './api/usersInternalV2.service';

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

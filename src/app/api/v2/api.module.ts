import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { APIV2DataProcessingRegistrationService } from './api/v2DataProcessingRegistration.service';
import { APIV2DataProcessingRegistrationBasisForTransferTypeService } from './api/v2DataProcessingRegistrationBasisForTransferType.service';
import { APIV2DataProcessingRegistrationCountryTypeService } from './api/v2DataProcessingRegistrationCountryType.service';
import { APIV2DataProcessingRegistrationDataResponsibleTypeService } from './api/v2DataProcessingRegistrationDataResponsibleType.service';
import { APIV2DataProcessingRegistrationOversightTypeService } from './api/v2DataProcessingRegistrationOversightType.service';
import { APIV2DataProcessingRegistrationRoleTypeService } from './api/v2DataProcessingRegistrationRoleType.service';
import { APIV2DeltaFeedService } from './api/v2DeltaFeed.service';
import { APIV2ItContractService } from './api/v2ItContract.service';
import { APIV2ItContractAgreementElementTypeService } from './api/v2ItContractAgreementElementType.service';
import { APIV2ItContractAgreementExtensionOptionTypeService } from './api/v2ItContractAgreementExtensionOptionType.service';
import { APIV2ItContractContractTemplateTypeService } from './api/v2ItContractContractTemplateType.service';
import { APIV2ItContractContractTypeService } from './api/v2ItContractContractType.service';
import { APIV2ItContractCriticalityTypeService } from './api/v2ItContractCriticalityType.service';
import { APIV2ItContractNoticePeriodMonthTypeService } from './api/v2ItContractNoticePeriodMonthType.service';
import { APIV2ItContractPaymentFrequencyTypeService } from './api/v2ItContractPaymentFrequencyType.service';
import { APIV2ItContractPaymentModelTypeService } from './api/v2ItContractPaymentModelType.service';
import { APIV2ItContractPriceRegulationTypeService } from './api/v2ItContractPriceRegulationType.service';
import { APIV2ItContractProcurementStrategyService } from './api/v2ItContractProcurementStrategy.service';
import { APIV2ItContractPurchaseTypeService } from './api/v2ItContractPurchaseType.service';
import { APIV2ItContractRoleTypeService } from './api/v2ItContractRoleType.service';
import { APIV2ItInterfaceService } from './api/v2ItInterface.service';
import { APIV2ItSystemService } from './api/v2ItSystem.service';
import { APIV2ItSystemBusinessTypeService } from './api/v2ItSystemBusinessType.service';
import { APIV2ItSystemUsageService } from './api/v2ItSystemUsage.service';
import { APIV2ItSystemUsageArchiveLocationTypeService } from './api/v2ItSystemUsageArchiveLocationType.service';
import { APIV2ItSystemUsageArchiveTestLocationTypeService } from './api/v2ItSystemUsageArchiveTestLocationType.service';
import { APIV2ItSystemUsageArchiveTypeService } from './api/v2ItSystemUsageArchiveType.service';
import { APIV2ItSystemUsageDataClassificationTypeService } from './api/v2ItSystemUsageDataClassificationType.service';
import { APIV2ItSystemUsageRegisteredDataCategoryTypeService } from './api/v2ItSystemUsageRegisteredDataCategoryType.service';
import { APIV2ItSystemUsageRelationFrequencyTypeService } from './api/v2ItSystemUsageRelationFrequencyType.service';
import { APIV2ItSystemUsageRoleTypeService } from './api/v2ItSystemUsageRoleType.service';
import { APIV2ItSystemUsageSensitivePersonalDataTypeService } from './api/v2ItSystemUsageSensitivePersonalDataType.service';
import { APIV2KleOptionService } from './api/v2KleOption.service';
import { APIV2OrganizationService } from './api/v2Organization.service';
import { APIV2PublicMessagesINTERNALService } from './api/v2PublicMessagesINTERNAL.service';

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

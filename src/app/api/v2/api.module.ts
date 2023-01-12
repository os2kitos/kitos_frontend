import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { APIV2DataProcessingRegistrationService } from './api/aPIV2DataProcessingRegistration.service';
import { APIV2DataProcessingRegistrationBasisForTransferTypeService } from './api/aPIV2DataProcessingRegistrationBasisForTransferType.service';
import { APIV2DataProcessingRegistrationCountryTypeService } from './api/aPIV2DataProcessingRegistrationCountryType.service';
import { APIV2DataProcessingRegistrationDataResponsibleTypeService } from './api/aPIV2DataProcessingRegistrationDataResponsibleType.service';
import { APIV2DataProcessingRegistrationOversightTypeService } from './api/aPIV2DataProcessingRegistrationOversightType.service';
import { APIV2DataProcessingRegistrationRoleTypeService } from './api/aPIV2DataProcessingRegistrationRoleType.service';
import { APIV2DeltaFeedService } from './api/aPIV2DeltaFeed.service';
import { APIV2ItContractService } from './api/aPIV2ItContract.service';
import { APIV2ItContractAgreementElementTypeService } from './api/aPIV2ItContractAgreementElementType.service';
import { APIV2ItContractAgreementExtensionOptionTypeService } from './api/aPIV2ItContractAgreementExtensionOptionType.service';
import { APIV2ItContractContractTemplateTypeService } from './api/aPIV2ItContractContractTemplateType.service';
import { APIV2ItContractContractTypeService } from './api/aPIV2ItContractContractType.service';
import { APIV2ItContractCriticalityTypeService } from './api/aPIV2ItContractCriticalityType.service';
import { APIV2ItContractNoticePeriodMonthTypeService } from './api/aPIV2ItContractNoticePeriodMonthType.service';
import { APIV2ItContractPaymentFrequencyTypeService } from './api/aPIV2ItContractPaymentFrequencyType.service';
import { APIV2ItContractPaymentModelTypeService } from './api/aPIV2ItContractPaymentModelType.service';
import { APIV2ItContractPriceRegulationTypeService } from './api/aPIV2ItContractPriceRegulationType.service';
import { APIV2ItContractProcurementStrategyService } from './api/aPIV2ItContractProcurementStrategy.service';
import { APIV2ItContractPurchaseTypeService } from './api/aPIV2ItContractPurchaseType.service';
import { APIV2ItContractRoleTypeService } from './api/aPIV2ItContractRoleType.service';
import { APIV2ItInterfaceService } from './api/aPIV2ItInterface.service';
import { APIV2ItSystemService } from './api/aPIV2ItSystem.service';
import { APIV2ItSystemBusinessTypeService } from './api/aPIV2ItSystemBusinessType.service';
import { APIV2ItSystemUsageService } from './api/aPIV2ItSystemUsage.service';
import { APIV2ItSystemUsageArchiveLocationTypeService } from './api/aPIV2ItSystemUsageArchiveLocationType.service';
import { APIV2ItSystemUsageArchiveTestLocationTypeService } from './api/aPIV2ItSystemUsageArchiveTestLocationType.service';
import { APIV2ItSystemUsageArchiveTypeService } from './api/aPIV2ItSystemUsageArchiveType.service';
import { APIV2ItSystemUsageDataClassificationTypeService } from './api/aPIV2ItSystemUsageDataClassificationType.service';
import { APIV2ItSystemUsageRegisteredDataCategoryTypeService } from './api/aPIV2ItSystemUsageRegisteredDataCategoryType.service';
import { APIV2ItSystemUsageRelationFrequencyTypeService } from './api/aPIV2ItSystemUsageRelationFrequencyType.service';
import { APIV2ItSystemUsageRoleTypeService } from './api/aPIV2ItSystemUsageRoleType.service';
import { APIV2ItSystemUsageSensitivePersonalDataTypeService } from './api/aPIV2ItSystemUsageSensitivePersonalDataType.service';
import { APIV2KleOptionService } from './api/aPIV2KleOption.service';
import { APIV2OrganizationService } from './api/aPIV2Organization.service';

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

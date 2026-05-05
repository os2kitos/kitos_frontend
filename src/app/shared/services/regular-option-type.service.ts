import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  APIRegularOptionResponseDTO,
  DataProcessingRegistrationBasisForTransferTypeV2Service,
  DataProcessingRegistrationCountryTypeV2Service,
  DataProcessingRegistrationDataResponsibleTypeV2Service,
  DataProcessingRegistrationOversightTypeV2Service,
  ItContractAgreementElementTypeV2Service,
  ItContractAgreementExtensionOptionTypeV2Service,
  ItContractContractTemplateTypeV2Service,
  ItContractContractTypeV2Service,
  ItContractCriticalityTypeV2Service,
  ItContractNoticePeriodMonthTypeV2Service,
  ItContractPaymentFrequencyTypeV2Service,
  ItContractPaymentModelTypeV2Service,
  ItContractPriceRegulationTypeV2Service,
  ItContractProcurementStrategyV2Service,
  ItContractPurchaseTypeV2Service,
  ItInterfaceInterfaceDataTypeV2Service,
  ItInterfaceInterfaceTypeV2Service,
  ItSystemBusinessTypeV2Service,
  ItSystemUsageArchiveLocationTypeV2Service,
  ItSystemUsageArchiveTestLocationTypeV2Service,
  ItSystemUsageArchiveTypeV2Service,
  ItSystemUsageCriticalityLevelTypeV2Service,
  ItSystemUsageDataClassificationTypeV2Service,
  ItSystemUsageRegisteredDataCategoryTypeV2Service,
  ItSystemUsageRelationFrequencyTypeV2Service,
  ItSystemUsageRoleTypeV2Service,
  ItSystemUsageSensitivePersonalDataTypeV2Service,
} from 'src/app/api/v2';
import { RegularOptionType } from '../models/options/regular-option-types.model';

@Injectable({
  providedIn: 'root',
})
export class RegularOptionTypeService {
  constructor(
    @Inject(ItSystemBusinessTypeV2Service)
    private readonly businessTypesService: ItSystemBusinessTypeV2Service,
    @Inject(ItContractContractTypeV2Service)
    private readonly contractTypesService: ItContractContractTypeV2Service,
    @Inject(ItInterfaceInterfaceTypeV2Service)
    private readonly interfaceTypesService: ItInterfaceInterfaceTypeV2Service,
    @Inject(ItSystemUsageDataClassificationTypeV2Service)
    private readonly dataClassificationTypesService: ItSystemUsageDataClassificationTypeV2Service,
    @Inject(ItSystemUsageRelationFrequencyTypeV2Service)
    private readonly relationFrequencyTypesService: ItSystemUsageRelationFrequencyTypeV2Service,
    @Inject(ItSystemUsageSensitivePersonalDataTypeV2Service)
    private readonly sensitivePersonalDataTypesService: ItSystemUsageSensitivePersonalDataTypeV2Service,
    @Inject(ItSystemUsageArchiveTypeV2Service)
    private readonly itSystemUsageArchiveTypesService: ItSystemUsageArchiveTypeV2Service,
    @Inject(ItSystemUsageArchiveLocationTypeV2Service)
    private readonly itSystemUsageArchiveLocationTypesService: ItSystemUsageArchiveLocationTypeV2Service,
    @Inject(ItSystemUsageArchiveTestLocationTypeV2Service)
    private readonly itSystemUsageArchiveLocationTestTypesService: ItSystemUsageArchiveTestLocationTypeV2Service,
    @Inject(ItSystemUsageRegisteredDataCategoryTypeV2Service)
    private readonly itSystemUsageRegisteredDataCategoryTypeService: ItSystemUsageRegisteredDataCategoryTypeV2Service,
    @Inject(ItSystemUsageCriticalityLevelTypeV2Service)
    private readonly itSystemUsageCriticalityLevelService: ItSystemUsageCriticalityLevelTypeV2Service,
    @Inject(ItSystemUsageRoleTypeV2Service)
    private readonly itSystemUsageRoleTypeService: ItSystemUsageRoleTypeV2Service,
    @Inject(ItInterfaceInterfaceDataTypeV2Service)
    private readonly itInterfaceDataTypesService: ItInterfaceInterfaceDataTypeV2Service,
    @Inject(ItContractContractTemplateTypeV2Service)
    private readonly contractTemplateService: ItContractContractTemplateTypeV2Service,
    @Inject(ItContractCriticalityTypeV2Service)
    private readonly contractCriticalityService: ItContractCriticalityTypeV2Service,
    @Inject(ItContractProcurementStrategyV2Service)
    private readonly contractProcurementStrategyService: ItContractProcurementStrategyV2Service,
    @Inject(ItContractPurchaseTypeV2Service)
    private readonly contractPurchaseFormService: ItContractPurchaseTypeV2Service,
    @Inject(ItContractAgreementElementTypeV2Service)
    private readonly contractAgreementElementsService: ItContractAgreementElementTypeV2Service,
    @Inject(ItContractAgreementExtensionOptionTypeV2Service)
    private readonly contractExtendTypesService: ItContractAgreementExtensionOptionTypeV2Service,
    @Inject(ItContractNoticePeriodMonthTypeV2Service)
    private readonly contractTerminationPeriodTypesService: ItContractNoticePeriodMonthTypeV2Service,
    @Inject(ItContractPaymentFrequencyTypeV2Service)
    private readonly contractPaymentFrequencyTypesService: ItContractPaymentFrequencyTypeV2Service,
    @Inject(ItContractPaymentModelTypeV2Service)
    private readonly contractPaymentModelTypesService: ItContractPaymentModelTypeV2Service,
    @Inject(ItContractPriceRegulationTypeV2Service)
    private readonly contractPriceRegulationTypesService: ItContractPriceRegulationTypeV2Service,
    @Inject(DataProcessingRegistrationDataResponsibleTypeV2Service)
    private readonly dataProcessingDataResponsibleTypesService: DataProcessingRegistrationDataResponsibleTypeV2Service,
    @Inject(DataProcessingRegistrationBasisForTransferTypeV2Service)
    private readonly dataProcessingBasisForTransferTypesService: DataProcessingRegistrationBasisForTransferTypeV2Service,
    @Inject(DataProcessingRegistrationCountryTypeV2Service)
    private readonly dataProcessingCountryTypesService: DataProcessingRegistrationCountryTypeV2Service,
    @Inject(DataProcessingRegistrationOversightTypeV2Service)
    private readonly dataProcessingOversightOptionsService: DataProcessingRegistrationOversightTypeV2Service,
  ) {}

  private resolveLocalOptionsEndpoint(
    optionType: RegularOptionType,
  ): (organizationUuid: string) => Observable<Array<APIRegularOptionResponseDTO>> {
    switch (optionType) {
      case 'it-system_business-type':
        return (organizationUuid) =>
          this.businessTypesService.getSingleItSystemBusinessTypeV2GetBusinessTypes({
            organizationUuid: organizationUuid,
          });
      case 'it-contract_contract-type':
        return (organizationUuid) =>
          this.contractTypesService.getSingleItContractContractTypeV2Get({ organizationUuid: organizationUuid });
      case 'it-interface_interface-type':
        return (organizationUuid) =>
          this.interfaceTypesService.getSingleItInterfaceInterfaceTypeV2Get({ organizationUuid: organizationUuid });
      case 'it-system_usage-data-classification-type':
        return (organizationUuid) =>
          this.dataClassificationTypesService.getSingleItSystemUsageDataClassificationTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it-system_usage-relation-frequency-type':
        return (organizationUuid) =>
          this.relationFrequencyTypesService.getSingleItSystemUsageRelationFrequencyTypeV2Get({ organizationUuid });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (organizationUuid) =>
          this.sensitivePersonalDataTypesService.getSingleItSystemUsageSensitivePersonalDataTypeV2Get({
            organizationUuid,
          });
      case 'it-system_usage-archive-type':
        return (organizationUuid) =>
          this.itSystemUsageArchiveTypesService.getSingleItSystemUsageArchiveTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it-system_usage-archive-location-type':
        return (organizationUuid) =>
          this.itSystemUsageArchiveLocationTypesService.getSingleItSystemUsageArchiveLocationTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it-system_usage-archive-location-test-type':
        return (organizationUuid) =>
          this.itSystemUsageArchiveLocationTestTypesService.getSingleItSystemUsageArchiveTestLocationTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (organizationUuid) =>
          this.itSystemUsageRegisteredDataCategoryTypeService.getSingleItSystemUsageRegisteredDataCategoryTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it-system-usage_system-usage-criticality-level':
        return (organizationUuid) =>
          this.itSystemUsageCriticalityLevelService.getSingleItSystemUsageCriticalityLevelTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it-system-usage-roles':
        return (organizationUuid) =>
          this.itSystemUsageRoleTypeService.getSingleItSystemUsageRoleTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it-interface_data-type':
        return (organizationUuid) =>
          this.itInterfaceDataTypesService.getSingleItInterfaceInterfaceDataTypeV2Get({
            organizationUuid,
          });
      case 'it-contract_contract-template-type':
        return (organizationUuid) =>
          this.contractTemplateService.getSingleItContractContractTemplateTypeV2Get({
            organizationUuid,
          });
      case 'it-contract_criticality-type':
        return (organizationUuid) =>
          this.contractCriticalityService.getSingleItContractCriticalityTypeV2Get({
            organizationUuid,
          });
      case 'it-contract_procurement-strategy-type':
        return (organizationUuid) =>
          this.contractProcurementStrategyService.getSingleItContractProcurementStrategyV2Get({
            organizationUuid,
          });
      case 'it-contract_purchase-form-type':
        return (organizationUuid) =>
          this.contractPurchaseFormService.getSingleItContractPurchaseTypeV2Get({
            organizationUuid,
          });
      case 'it-contract-agreement-element-types':
        return (organizationUuid) =>
          this.contractAgreementElementsService.getSingleItContractAgreementElementTypeV2Get({
            organizationUuid,
          });
      case 'it-contract-extend-types':
        return (organizationUuid) =>
          this.contractExtendTypesService.getSingleItContractAgreementExtensionOptionTypeV2Get({
            organizationUuid,
          });
      case 'it-contract-termination-period-types':
        return (organizationUuid) =>
          this.contractTerminationPeriodTypesService.getSingleItContractNoticePeriodMonthTypeV2Get({
            organizationUuid,
          });
      case 'it-contract-payment-frequency-types':
        return (organizationUuid) =>
          this.contractPaymentFrequencyTypesService.getSingleItContractPaymentFrequencyTypeV2Get({ organizationUuid });
      case 'it-contract-payment-model-types':
        return (organizationUuid) =>
          this.contractPaymentModelTypesService.getSingleItContractPaymentModelTypeV2Get({ organizationUuid });
      case 'it-contract-price-regulation-types':
        return (organizationUuid) =>
          this.contractPriceRegulationTypesService.getSingleItContractPriceRegulationTypeV2Get({ organizationUuid });
      case 'data-processing-basis-for-transfer-types':
        return (organizationUuid) =>
          this.dataProcessingBasisForTransferTypesService.getSingleDataProcessingRegistrationBasisForTransferTypeV2Get({
            organizationUuid,
          });
      case 'data-processing-data-responsible-types':
        return (organizationUuid) =>
          this.dataProcessingDataResponsibleTypesService.getSingleDataProcessingRegistrationDataResponsibleTypeV2Get({
            organizationUuid,
          });
      case 'data-processing-country-types':
        return (organizationUuid) =>
          this.dataProcessingCountryTypesService.getSingleDataProcessingRegistrationCountryTypeV2Get({
            organizationUuid,
          });
      case 'data-processing-oversight-option-types':
        return (organizationUuid) =>
          this.dataProcessingOversightOptionsService.getSingleDataProcessingRegistrationOversightTypeV2Get({
            organizationUuid,
          });
    }
  }

  /**
   * Returns options available within the provided organization
   * @param organizationUuid uuid of the organization
   * @param optionType type of regular option
   * @returns
   */
  public getAvailableOptions(
    organizationUuid: string,
    optionType: RegularOptionType,
  ): Observable<Array<APIRegularOptionResponseDTO>> {
    return this.resolveLocalOptionsEndpoint(optionType)(organizationUuid);
  }
}

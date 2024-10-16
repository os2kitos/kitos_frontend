import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  APIRegularOptionResponseDTO,
  APIV2DataProcessingRegistrationBasisForTransferTypeService,
  APIV2DataProcessingRegistrationCountryTypeService,
  APIV2DataProcessingRegistrationDataResponsibleTypeService,
  APIV2DataProcessingRegistrationOversightTypeService,
  APIV2ItContractAgreementElementTypeService,
  APIV2ItContractAgreementExtensionOptionTypeService,
  APIV2ItContractContractTemplateTypeService,
  APIV2ItContractContractTypeService,
  APIV2ItContractCriticalityTypeService,
  APIV2ItContractNoticePeriodMonthTypeService,
  APIV2ItContractPaymentFrequencyTypeService,
  APIV2ItContractPaymentModelTypeService,
  APIV2ItContractPriceRegulationTypeService,
  APIV2ItContractProcurementStrategyService,
  APIV2ItContractPurchaseTypeService,
  APIV2ItInterfaceInterfaceDataTypeService,
  APIV2ItInterfaceInterfaceTypeService,
  APIV2ItSystemBusinessTypeService,
  APIV2ItSystemUsageArchiveLocationTypeService,
  APIV2ItSystemUsageArchiveTestLocationTypeService,
  APIV2ItSystemUsageArchiveTypeService,
  APIV2ItSystemUsageDataClassificationTypeService,
  APIV2ItSystemUsageRegisteredDataCategoryTypeService,
  APIV2ItSystemUsageRelationFrequencyTypeService,
  APIV2ItSystemUsageRoleTypeService,
  APIV2ItSystemUsageSensitivePersonalDataTypeService,
} from 'src/app/api/v2';
import { RegularOptionType } from '../models/options/regular-option-types.model';

@Injectable({
  providedIn: 'root',
})
export class RegularOptionTypeService {
  constructor(
    private readonly businessTypesService: APIV2ItSystemBusinessTypeService,
    private readonly contractTypesService: APIV2ItContractContractTypeService,
    private readonly interfaceTypesService: APIV2ItInterfaceInterfaceTypeService,
    private readonly dataClassificationTypesService: APIV2ItSystemUsageDataClassificationTypeService,
    private readonly relationFrequencyTypesService: APIV2ItSystemUsageRelationFrequencyTypeService,
    private readonly sensitivePersonalDataTypesService: APIV2ItSystemUsageSensitivePersonalDataTypeService,
    private readonly itSystemUsageArchiveTypesService: APIV2ItSystemUsageArchiveTypeService,
    private readonly itSystemUsageArchiveLocationTypesService: APIV2ItSystemUsageArchiveLocationTypeService,
    private readonly itSystemUsageArchiveLocationTestTypesService: APIV2ItSystemUsageArchiveTestLocationTypeService,
    private readonly itSystemUsageRegisteredDataCategoryTypeService: APIV2ItSystemUsageRegisteredDataCategoryTypeService,
    private readonly itSystemUsageRoleTypeService: APIV2ItSystemUsageRoleTypeService,
    private readonly itInterfaceDataTypesService: APIV2ItInterfaceInterfaceDataTypeService,
    private readonly contractTemplateService: APIV2ItContractContractTemplateTypeService,
    private readonly contractCriticalityService: APIV2ItContractCriticalityTypeService,
    private readonly contractProcurementStrategyService: APIV2ItContractProcurementStrategyService,
    private readonly contractPurchaseFormService: APIV2ItContractPurchaseTypeService,
    private readonly contractAgreementElementsService: APIV2ItContractAgreementElementTypeService,
    private readonly contractExtendTypesService: APIV2ItContractAgreementExtensionOptionTypeService,
    private readonly contractTerminationPeriodTypesService: APIV2ItContractNoticePeriodMonthTypeService,
    private readonly contractPaymentFrequencyTypesService: APIV2ItContractPaymentFrequencyTypeService,
    private readonly contractPaymentModelTypesService: APIV2ItContractPaymentModelTypeService,
    private readonly contractPriceRegulationTypesService: APIV2ItContractPriceRegulationTypeService,
    private readonly dataProcessingDataResponsibleTypesService: APIV2DataProcessingRegistrationDataResponsibleTypeService,
    private readonly dataProcessingBasisForTransferTypesService: APIV2DataProcessingRegistrationBasisForTransferTypeService,
    private readonly dataProcessingCountryTypesService: APIV2DataProcessingRegistrationCountryTypeService,
    private readonly dataProcessingOversightOptionsService: APIV2DataProcessingRegistrationOversightTypeService
  ) {}

  private resolveLocalOptionsEndpoint(
    optionType: RegularOptionType
  ): (organizationUuid: string) => Observable<Array<APIRegularOptionResponseDTO>> {
    switch (optionType) {
      case 'it-system_business-type':
        return (organizationUuid) =>
          this.businessTypesService.getManyItSystemBusinessTypeV2GetBusinessTypes({
            organizationUuid: organizationUuid,
          });
      case 'it-contract_contract-type':
        return (organizationUuid) =>
          this.contractTypesService.getManyItContractContractTypeV2Get({ organizationUuid: organizationUuid });
      case 'it-interface_interface-type':
        return (organizationUuid) =>
          this.interfaceTypesService.getManyItInterfaceInterfaceTypeV2Get({ organizationUuid: organizationUuid });
      case 'it-system_usage-data-classification-type':
        return (organizationUuid) =>
          this.dataClassificationTypesService.getManyItSystemUsageDataClassificationTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it-system_usage-relation-frequency-type':
        return (organizationUuid) =>
          this.relationFrequencyTypesService.getManyItSystemUsageRelationFrequencyTypeV2Get({ organizationUuid });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (organizationUuid) =>
          this.sensitivePersonalDataTypesService.getManyItSystemUsageSensitivePersonalDataTypeV2Get({
            organizationUuid,
          });
      case 'it-system_usage-archive-type':
        return (organizationUuid) =>
          this.itSystemUsageArchiveTypesService.getManyItSystemUsageArchiveTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it-system_usage-archive-location-type':
        return (organizationUuid) =>
          this.itSystemUsageArchiveLocationTypesService.getManyItSystemUsageArchiveLocationTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it-system_usage-archive-location-test-type':
        return (organizationUuid) =>
          this.itSystemUsageArchiveLocationTestTypesService.getManyItSystemUsageArchiveTestLocationTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (organizationUuid) =>
          this.itSystemUsageRegisteredDataCategoryTypeService.getManyItSystemUsageRegisteredDataCategoryTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it-system-usage-roles':
        return (organizationUuid) =>
          this.itSystemUsageRoleTypeService.getManyItSystemUsageRoleTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it-interface_data-type':
        return (organizationUuid) =>
          this.itInterfaceDataTypesService.getManyItInterfaceInterfaceDataTypeV2Get({
            organizationUuid,
          });
      case 'it-contract_contract-template-type':
        return (organizationUuid) =>
          this.contractTemplateService.getManyItContractContractTemplateTypeV2Get({
            organizationUuid,
          });
      case 'it-contract_criticality-type':
        return (organizationUuid) =>
          this.contractCriticalityService.getManyItContractCriticalityTypeV2Get({
            organizationUuid,
          });
      case 'it-contract_procurement-strategy-type':
        return (organizationUuid) =>
          this.contractProcurementStrategyService.getManyItContractProcurementStrategyV2Get({
            organizationUuid,
          });
      case 'it-contract_purchase-form-type':
        return (organizationUuid) =>
          this.contractPurchaseFormService.getManyItContractPurchaseTypeV2Get({
            organizationUuid,
          });
      case 'it-contract-agreement-element-types':
        return (organizationUuid) =>
          this.contractAgreementElementsService.getManyItContractAgreementElementTypeV2Get({
            organizationUuid,
          });
      case 'it-contract-extend-types':
        return (organizationUuid) =>
          this.contractExtendTypesService.getManyItContractAgreementExtensionOptionTypeV2Get({
            organizationUuid,
          });
      case 'it-contract-termination-period-types':
        return (organizationUuid) =>
          this.contractTerminationPeriodTypesService.getManyItContractNoticePeriodMonthTypeV2Get({
            organizationUuid,
          });
      case 'it-contract-payment-frequency-types':
        return (organizationUuid) =>
          this.contractPaymentFrequencyTypesService.getManyItContractPaymentFrequencyTypeV2Get({ organizationUuid });
      case 'it-contract-payment-model-types':
        return (organizationUuid) =>
          this.contractPaymentModelTypesService.getManyItContractPaymentModelTypeV2Get({ organizationUuid });
      case 'it-contract-price-regulation-types':
        return (organizationUuid) =>
          this.contractPriceRegulationTypesService.getManyItContractPriceRegulationTypeV2Get({ organizationUuid });
      case 'data-processing-basis-for-transfer-types':
        return (organizationUuid) =>
          this.dataProcessingBasisForTransferTypesService.getManyDataProcessingRegistrationBasisForTransferTypeV2Get({
            organizationUuid,
          });
      case 'data-processing-data-responsible-types':
        return (organizationUuid) =>
          this.dataProcessingDataResponsibleTypesService.getManyDataProcessingRegistrationDataResponsibleTypeV2Get({
            organizationUuid,
          });
      case 'data-processing-country-types':
        return (organizationUuid) =>
          this.dataProcessingCountryTypesService.getManyDataProcessingRegistrationCountryTypeV2Get({
            organizationUuid,
          });
      case 'data-processing-oversight-option-types':
        return (organizationUuid) =>
          this.dataProcessingOversightOptionsService.getManyDataProcessingRegistrationOversightTypeV2Get({
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
    optionType: RegularOptionType
  ): Observable<Array<APIRegularOptionResponseDTO>> {
    return this.resolveLocalOptionsEndpoint(optionType)(organizationUuid);
  }
}

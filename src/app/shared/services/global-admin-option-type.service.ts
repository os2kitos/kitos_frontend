import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  APIGlobalRegularOptionUpdateRequestDTO,
  APIGlobalRoleOptionCreateRequestDTO,
  APIGlobalRoleOptionResponseDTO,
  APIGlobalRoleOptionUpdateRequestDTO,
  APIV2DprGlobalDataProcessingBasisForTransferOptionsInternalINTERNALService,
  APIV2DprGlobalDataProcessingCountryOptionsInternalINTERNALService,
  APIV2DprGlobalDataProcessingDataResponsibleOptionsInternalINTERNALService,
  APIV2DprGlobalDataProcessingOversightOptionsInternalINTERNALService,
  APIV2DprGlobalRoleOptionTypesInternalINTERNALService,
  APIV2ItContractGlobalAgreementElementTypesInternalINTERNALService,
  APIV2ItContractGlobalCriticalityTypesInternalINTERNALService,
  APIV2ItContractGlobalItContractRoleTypesInternalINTERNALService,
  APIV2ItContractGlobalItContractTemplateTypesInternalINTERNALService,
  APIV2ItContractGlobalItContractTypesInternalINTERNALService,
  APIV2ItContractGlobalOptionExtendTypesInternalINTERNALService,
  APIV2ItContractGlobalPaymentFrequencyTypesInternalINTERNALService,
  APIV2ItContractGlobalPaymentModelTypesInternalINTERNALService,
  APIV2ItContractGlobalPriceRegulationTypesInternalINTERNALService,
  APIV2ItContractGlobalProcurementStrategyTypesInternalINTERNALService,
  APIV2ItContractGlobalPurchaseFormTypesInternalINTERNALService,
  APIV2ItContractGlobalTerminationDeadlineTypesInternalINTERNALService,
  APIV2ItSystemGlobalBusinessTypesInternalINTERNALService,
  APIV2ItSystemGlobalItSystemCategoriesInternalINTERNALService,
  APIV2ItSystemGlobalRoleOptionTypesInternalINTERNALService,
  APIV2ItSystemGlobalSensitivePersonalDataTypesInternalINTERNALService,
} from 'src/app/api/v2';
import { APIV2ItSystemGlobalArchiveLocationsInternalINTERNALService } from 'src/app/api/v2/api/v2ItSystemGlobalArchiveLocationsInternalINTERNAL.service';
import { APIV2ItSystemGlobalArchiveTestLocationsInternalINTERNALService } from 'src/app/api/v2/api/v2ItSystemGlobalArchiveTestLocationsInternalINTERNAL.service';
import { APIV2ItSystemGlobalArchiveTypesInternalINTERNALService } from 'src/app/api/v2/api/v2ItSystemGlobalArchiveTypesInternalINTERNAL.service';
import { APIV2ItSystemGlobalDataTypesInternalINTERNALService } from 'src/app/api/v2/api/v2ItSystemGlobalDataTypesInternalINTERNAL.service';
import { APIV2ItSystemGlobalFrequencyTypesInternalINTERNALService } from 'src/app/api/v2/api/v2ItSystemGlobalFrequencyTypesInternalINTERNAL.service';
import { APIV2ItSystemGlobalInterfaceTypesInternalINTERNALService } from 'src/app/api/v2/api/v2ItSystemGlobalInterfaceTypesInternalINTERNAL.service';
import { APIV2ItSystemGlobalRegisterTypesInternalINTERNALService } from 'src/app/api/v2/api/v2ItSystemGlobalRegisterTypesInternalINTERNAL.service';
import { GlobalAdminOptionType } from '../models/options/global-admin-option-type.model';

@Injectable({
  providedIn: 'root',
})
export class GlobalAdminOptionTypeService {
  constructor(
    //IT system regular types
    @Inject(APIV2ItSystemGlobalBusinessTypesInternalINTERNALService)
    private businessTypeService: APIV2ItSystemGlobalBusinessTypesInternalINTERNALService,
    @Inject(APIV2ItSystemGlobalArchiveTypesInternalINTERNALService)
    private archiveTypeService: APIV2ItSystemGlobalArchiveTypesInternalINTERNALService,
    @Inject(APIV2ItSystemGlobalArchiveLocationsInternalINTERNALService)
    private archiveLocationService: APIV2ItSystemGlobalArchiveLocationsInternalINTERNALService,
    @Inject(APIV2ItSystemGlobalArchiveTestLocationsInternalINTERNALService)
    private archiveTestLocationService: APIV2ItSystemGlobalArchiveTestLocationsInternalINTERNALService,
    @Inject(APIV2ItSystemGlobalDataTypesInternalINTERNALService)
    private dataTypeService: APIV2ItSystemGlobalDataTypesInternalINTERNALService,
    @Inject(APIV2ItSystemGlobalFrequencyTypesInternalINTERNALService)
    private frequencyTypeService: APIV2ItSystemGlobalFrequencyTypesInternalINTERNALService,
    @Inject(APIV2ItSystemGlobalInterfaceTypesInternalINTERNALService)
    private interfaceTypeService: APIV2ItSystemGlobalInterfaceTypesInternalINTERNALService,
    @Inject(APIV2ItSystemGlobalSensitivePersonalDataTypesInternalINTERNALService)
    private sensitivePersonalDataTypeService: APIV2ItSystemGlobalSensitivePersonalDataTypesInternalINTERNALService,
    @Inject(APIV2ItSystemGlobalItSystemCategoriesInternalINTERNALService)
    private itSystemCategoryService: APIV2ItSystemGlobalItSystemCategoriesInternalINTERNALService,
    @Inject(APIV2ItSystemGlobalRegisterTypesInternalINTERNALService)
    private registerTypeService: APIV2ItSystemGlobalRegisterTypesInternalINTERNALService,

    //IT Contract regular types
    @Inject(APIV2ItContractGlobalItContractTypesInternalINTERNALService)
    private contractTypeService: APIV2ItContractGlobalItContractTypesInternalINTERNALService,
    @Inject(APIV2ItContractGlobalItContractTemplateTypesInternalINTERNALService)
    private templateTypeService: APIV2ItContractGlobalItContractTemplateTypesInternalINTERNALService,
    @Inject(APIV2ItContractGlobalPurchaseFormTypesInternalINTERNALService)
    private purchaseFormTypeService: APIV2ItContractGlobalPurchaseFormTypesInternalINTERNALService,
    @Inject(APIV2ItContractGlobalPaymentModelTypesInternalINTERNALService)
    private paymentModelTypeService: APIV2ItContractGlobalPaymentModelTypesInternalINTERNALService,
    @Inject(APIV2ItContractGlobalAgreementElementTypesInternalINTERNALService)
    private agreementElementTypeService: APIV2ItContractGlobalAgreementElementTypesInternalINTERNALService,
    @Inject(APIV2ItContractGlobalOptionExtendTypesInternalINTERNALService)
    private optionExtendTypeService: APIV2ItContractGlobalOptionExtendTypesInternalINTERNALService,
    @Inject(APIV2ItContractGlobalPaymentFrequencyTypesInternalINTERNALService)
    private paymentFrequencyTypeService: APIV2ItContractGlobalPaymentFrequencyTypesInternalINTERNALService,
    @Inject(APIV2ItContractGlobalPriceRegulationTypesInternalINTERNALService)
    private priceRegulationTypeService: APIV2ItContractGlobalPriceRegulationTypesInternalINTERNALService,
    @Inject(APIV2ItContractGlobalProcurementStrategyTypesInternalINTERNALService)
    private procurementStrategyTypeService: APIV2ItContractGlobalProcurementStrategyTypesInternalINTERNALService,
    @Inject(APIV2ItContractGlobalTerminationDeadlineTypesInternalINTERNALService)
    private terminationDeadlineTypeService: APIV2ItContractGlobalTerminationDeadlineTypesInternalINTERNALService,
    @Inject(APIV2ItContractGlobalCriticalityTypesInternalINTERNALService)
    private criticalityTypeService: APIV2ItContractGlobalCriticalityTypesInternalINTERNALService,

    //Data processing regular option type services
    @Inject(APIV2DprGlobalDataProcessingBasisForTransferOptionsInternalINTERNALService)
    private basisForTransferService: APIV2DprGlobalDataProcessingBasisForTransferOptionsInternalINTERNALService,
    @Inject(APIV2DprGlobalDataProcessingOversightOptionsInternalINTERNALService)
    private oversightOptionService: APIV2DprGlobalDataProcessingOversightOptionsInternalINTERNALService,
    @Inject(APIV2DprGlobalDataProcessingDataResponsibleOptionsInternalINTERNALService)
    private dataResponsibleService: APIV2DprGlobalDataProcessingDataResponsibleOptionsInternalINTERNALService,
    @Inject(APIV2DprGlobalDataProcessingCountryOptionsInternalINTERNALService)
    private countryService: APIV2DprGlobalDataProcessingCountryOptionsInternalINTERNALService,

    //Role types
    @Inject(APIV2ItSystemGlobalRoleOptionTypesInternalINTERNALService)
    private itSystemRoleService: APIV2ItSystemGlobalRoleOptionTypesInternalINTERNALService,
    @Inject(APIV2ItContractGlobalItContractRoleTypesInternalINTERNALService)
    private itContractRoleService: APIV2ItContractGlobalItContractRoleTypesInternalINTERNALService,
    @Inject(APIV2DprGlobalRoleOptionTypesInternalINTERNALService)
    private dprRoleService: APIV2DprGlobalRoleOptionTypesInternalINTERNALService
  ) {}

  public getGlobalOptions(optionType: GlobalAdminOptionType): Observable<Array<APIGlobalRoleOptionResponseDTO>> {
    return this.resolveGetGlobalOptionsEndpoint(optionType)();
  }

  public createGlobalOption(
    optionType: GlobalAdminOptionType,
    request: APIGlobalRoleOptionCreateRequestDTO
  ): Observable<APIGlobalRoleOptionResponseDTO> {
    return this.resolveCreateGlobalOptionEndpoint(optionType)(request);
  }

  public patchGlobalOption(
    optionType: GlobalAdminOptionType,
    optionUuid: string,
    request: APIGlobalRoleOptionUpdateRequestDTO
  ) {
    return this.resolvePatchGlobalOptionEndpoint(optionType)(optionUuid, request);
  }

  private resolveGetGlobalOptionsEndpoint(
    optionType: GlobalAdminOptionType
  ): () => Observable<Array<APIGlobalRoleOptionResponseDTO>> {
    switch (optionType) {
      //It system regular types
      case 'it-system_business-type':
        return () => this.businessTypeService.getManyItSystemGlobalBusinessTypesInternalV2GetBusinessTypes();
      case 'it-system_usage-archive-type':
        return () => this.archiveTypeService.getManyItSystemGlobalArchiveTypesInternalV2GetGlobalArchiveTypes();
      case 'it-system_usage-archive-location-type':
        return () => this.archiveLocationService.getManyItSystemGlobalArchiveLocationsInternalV2GetArchiveLocations();
      case 'it-system_usage-archive-location-test-type':
        return () =>
          this.archiveTestLocationService.getManyItSystemGlobalArchiveTestLocationsInternalV2GetGlobalArchiveTestLocations();
      case 'it-interface_data-type':
        return () => this.dataTypeService.getManyItSystemGlobalDataTypesInternalV2GetGlobalDataTypes();
      case 'it-system_usage-relation-frequency-type':
        return () => this.frequencyTypeService.getManyItSystemGlobalFrequencyTypesInternalV2GetGlobalFrequencyTypes();
      case 'it-interface_interface-type':
        return () => this.interfaceTypeService.getManyItSystemGlobalInterfaceTypesInternalV2GetGlobalInterfaceTypes();
      case 'it_system_usage-gdpr-sensitive-data-type':
        return () =>
          this.sensitivePersonalDataTypeService.getManyItSystemGlobalSensitivePersonalDataTypesInternalV2GetGlobalSensitivePersonalDatas();
      case 'it-system_usage-data-classification-type':
        return () =>
          this.itSystemCategoryService.getManyItSystemGlobalItSystemCategoriesInternalV2GetGlobalItSystemCategoriess();
      case 'it_system_usage-gdpr-registered-data-category-type':
        return () => this.registerTypeService.getManyItSystemGlobalRegisterTypesInternalV2GetGlobalRegisterTypes();

      //It Contract regular types
      case 'it-contract_contract-type':
        return () =>
          this.contractTypeService.getManyItContractGlobalItContractTypesInternalV2GetGlobalItContractTypes();

      case 'it-contract_contract-template-type':
        return () =>
          this.templateTypeService.getManyItContractGlobalItContractTemplateTypesInternalV2GetGlobalItContractTemplateTypes();

      case 'it-contract_purchase-form-type':
        return () =>
          this.purchaseFormTypeService.getManyItContractGlobalPurchaseFormTypesInternalV2GetGlobalPurchaseFormTypes();

      case 'it-contract-payment-model-types':
        return () =>
          this.paymentModelTypeService.getManyItContractGlobalPaymentModelTypesInternalV2GetGlobalPaymentModelTypes();

      case 'it-contract-agreement-element-types':
        return () =>
          this.agreementElementTypeService.getManyItContractGlobalAgreementElementTypesInternalV2GetGlobalAgreementElementTypes();

      case 'it-contract-extend-types':
        return () =>
          this.optionExtendTypeService.getManyItContractGlobalOptionExtendTypesInternalV2GetGlobalOptionExtendTypes();

      case 'it-contract-payment-frequency-types':
        return () =>
          this.paymentFrequencyTypeService.getManyItContractGlobalPaymentFrequencyTypesInternalV2GetGlobalPaymentFreqencyTypes();

      case 'it-contract-price-regulation-types':
        return () =>
          this.priceRegulationTypeService.getManyItContractGlobalPriceRegulationTypesInternalV2GetGlobalPriceRegulationTypes();

      case 'it-contract_procurement-strategy-type':
        return () =>
          this.procurementStrategyTypeService.getManyItContractGlobalProcurementStrategyTypesInternalV2GetGlobalProcurementStrategyTypes();

      case 'it-contract-termination-period-types':
        return () =>
          this.terminationDeadlineTypeService.getManyItContractGlobalTerminationDeadlineTypesInternalV2GetGlobalTerminationDeadlineTypes();

      case 'it-contract_criticality-type':
        return () =>
          this.criticalityTypeService.getManyItContractGlobalCriticalityTypesInternalV2GetGlobalCriticalityTypes();

      //Data processing regular types
      case 'data-processing-basis-for-transfer-types':
        return () =>
          this.basisForTransferService.getManyDprGlobalDataProcessingBasisForTransferOptionsInternalV2GetGlobalDataProcessingBasisForTransferOptions();
      case 'data-processing-oversight-option-types':
        return () =>
          this.oversightOptionService.getManyDprGlobalDataProcessingOversightOptionsInternalV2GetGlobalDataProcessingOversightOptions();
      case 'data-processing-data-responsible-types':
        return () =>
          this.dataResponsibleService.getManyDprGlobalDataProcessingDataResponsibleOptionsInternalV2GetGlobalDataProcessingDataResponsibleOptions();
      case 'data-processing-country-types':
        return () =>
          this.countryService.getManyDprGlobalDataProcessingCountryOptionsInternalV2GetGlobalDataProcessingCountryOptions();

      //Role types
      case 'it-system-usage':
        return () => this.itSystemRoleService.getManyItSystemGlobalRoleOptionTypesInternalV2GetItSystemRoles();
      case 'it-contract':
        return () =>
          this.itContractRoleService.getManyItContractGlobalItContractRoleTypesInternalV2GetGlobalItContractRoleTypes();
      case 'data-processing':
        return () => this.dprRoleService.getManyDprGlobalRoleOptionTypesInternalV2GetDprRoles();
      default:
        throw new Error(`Get operation is not supported for ${optionType}`);
    }
  }

  private resolvePatchGlobalOptionEndpoint(optionType: GlobalAdminOptionType) {
    switch (optionType) {
      //It system regular types
      case 'it-system_business-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.businessTypeService.patchSingleItSystemGlobalBusinessTypesInternalV2PatchGlobalBusinessType({
            optionUuid,
            dto,
          });
      case 'it-system_usage-archive-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.archiveTypeService.patchSingleItSystemGlobalArchiveTypesInternalV2PatchGlobalArchiveType({
            optionUuid,
            dto,
          });
      case 'it-system_usage-archive-location-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.archiveLocationService.patchSingleItSystemGlobalArchiveLocationsInternalV2PatchGlobalArchiveLocation({
            optionUuid,
            dto,
          });
      case 'it-system_usage-archive-location-test-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.archiveTestLocationService.patchSingleItSystemGlobalArchiveTestLocationsInternalV2PatchGlobalArchiveTestLocation(
            {
              optionUuid,
              dto,
            }
          );
      case 'it-interface_data-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.dataTypeService.patchSingleItSystemGlobalDataTypesInternalV2PatchGlobalDataType({
            optionUuid,
            dto,
          });
      case 'it-system_usage-relation-frequency-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.frequencyTypeService.patchSingleItSystemGlobalFrequencyTypesInternalV2PatchGlobalFrequencyType({
            optionUuid,
            dto,
          });
      case 'it-interface_interface-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.interfaceTypeService.patchSingleItSystemGlobalInterfaceTypesInternalV2PatchGlobalInterfaceType({
            optionUuid,
            dto,
          });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.sensitivePersonalDataTypeService.patchSingleItSystemGlobalSensitivePersonalDataTypesInternalV2PatchGlobalSensitivePersonalData(
            {
              optionUuid,
              dto,
            }
          );
      case 'it-system_usage-data-classification-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.itSystemCategoryService.patchSingleItSystemGlobalItSystemCategoriesInternalV2PatchGlobalItSystemCategories(
            {
              optionUuid,
              dto,
            }
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.registerTypeService.patchSingleItSystemGlobalRegisterTypesInternalV2PatchGlobalRegisterType({
            optionUuid,
            dto,
          });

      //IT contract regular types
      case 'it-contract_contract-type':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.contractTypeService.patchSingleItContractGlobalItContractTypesInternalV2PatchGlobalItContractType({
            optionUuid,
            dto: request,
          });

      case 'it-contract_contract-template-type':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.templateTypeService.patchSingleItContractGlobalItContractTemplateTypesInternalV2PatchGlobalItContractTemplateType(
            {
              optionUuid,
              dto: request,
            }
          );

      case 'it-contract_purchase-form-type':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.purchaseFormTypeService.patchSingleItContractGlobalPurchaseFormTypesInternalV2PatchGlobalPurchaseFormType(
            {
              optionUuid,
              dto: request,
            }
          );

      case 'it-contract-payment-model-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.paymentModelTypeService.patchSingleItContractGlobalPaymentModelTypesInternalV2PatchGlobalPaymentModelType(
            {
              optionUuid,
              dto: request,
            }
          );

      case 'it-contract-agreement-element-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.agreementElementTypeService.patchSingleItContractGlobalAgreementElementTypesInternalV2PatchGlobalAgreementElementType(
            {
              optionUuid,
              dto: request,
            }
          );

      case 'it-contract-extend-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.optionExtendTypeService.patchSingleItContractGlobalOptionExtendTypesInternalV2PatchGlobalOptionExtendType(
            {
              optionUuid,
              dto: request,
            }
          );

      case 'it-contract-payment-frequency-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.paymentFrequencyTypeService.patchSingleItContractGlobalPaymentFrequencyTypesInternalV2PatchGlobalPaymentFreqencyType(
            {
              optionUuid,
              dto: request,
            }
          );

      case 'it-contract-price-regulation-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.priceRegulationTypeService.patchSingleItContractGlobalPriceRegulationTypesInternalV2PatchGlobalPriceRegulationType(
            {
              optionUuid,
              dto: request,
            }
          );

      case 'it-contract_procurement-strategy-type':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.procurementStrategyTypeService.patchSingleItContractGlobalProcurementStrategyTypesInternalV2PatchGlobalProcurementStrategyType(
            {
              optionUuid,
              dto: request,
            }
          );

      case 'it-contract-termination-period-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.terminationDeadlineTypeService.patchSingleItContractGlobalTerminationDeadlineTypesInternalV2PatchGlobalTerminationDeadlineType(
            {
              optionUuid,
              dto: request,
            }
          );

      case 'it-contract_criticality-type':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.criticalityTypeService.patchSingleItContractGlobalCriticalityTypesInternalV2PatchGlobalCriticalityType({
            optionUuid,
            dto: request,
          });


      // Data processing regular option types
      case 'data-processing-basis-for-transfer-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.basisForTransferService.patchSingleDprGlobalDataProcessingBasisForTransferOptionsInternalV2PatchGlobalDataProcessingBasisForTransferOption({
            optionUuid,
            dto: request,
          });

      case 'data-processing-oversight-option-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.oversightOptionService.patchSingleDprGlobalDataProcessingOversightOptionsInternalV2PatchGlobalDataProcessingOversightOption({
            optionUuid,
            dto: request,
          });

      case 'data-processing-data-responsible-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.dataResponsibleService.patchSingleDprGlobalDataProcessingDataResponsibleOptionsInternalV2PatchGlobalDataProcessingDataResponsibleOption({
            optionUuid,
            dto: request,
          });

      case 'data-processing-country-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.countryService.patchSingleDprGlobalDataProcessingCountryOptionsInternalV2PatchGlobalDataProcessingCountryOption({
            optionUuid,
            dto: request,
          });

      //Role types
      case 'it-system-usage':
        return (optionUuid: string, dto: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.itSystemRoleService.patchSingleItSystemGlobalRoleOptionTypesInternalV2PatchGlobalBItSystemRole({
            optionUuid,
            dto,
          });
      case 'it-contract':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.itContractRoleService.patchSingleItContractGlobalItContractRoleTypesInternalV2PatchGlobalItContractRoleType(
            {
              optionUuid,
              dto,
            }
          );
      case 'data-processing':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.dprRoleService.patchSingleDprGlobalRoleOptionTypesInternalV2PatchDprRole({
            optionUuid,
            dto,
          });
      default:
        throw new Error(`Patch operation is not supported for ${optionType}`);
    }
  }

  private resolveCreateGlobalOptionEndpoint(optionType: GlobalAdminOptionType) {
    switch (optionType) {
      //It system regular types
      case 'it-system_business-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.businessTypeService.postSingleItSystemGlobalBusinessTypesInternalV2CreateBusinessType({
            dto: request,
          });
      case 'it-system_usage-archive-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.archiveTypeService.postSingleItSystemGlobalArchiveTypesInternalV2CreateGlobalArchiveType({
            dto: request,
          });
      case 'it-system_usage-archive-location-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.archiveLocationService.postSingleItSystemGlobalArchiveLocationsInternalV2CreateArchiveLocation({
            dto: request,
          });
      case 'it-system_usage-archive-location-test-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.archiveTestLocationService.postSingleItSystemGlobalArchiveTestLocationsInternalV2CreateGlobalArchiveTestLocation(
            {
              dto: request,
            }
          );
      case 'it-interface_data-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.dataTypeService.postSingleItSystemGlobalDataTypesInternalV2CreateGlobalDataType({
            dto: request,
          });
      case 'it-system_usage-relation-frequency-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.frequencyTypeService.postSingleItSystemGlobalFrequencyTypesInternalV2CreateGlobalFrequencyType({
            dto: request,
          });
      case 'it-interface_interface-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.interfaceTypeService.postSingleItSystemGlobalInterfaceTypesInternalV2CreateGlobalInterfaceType({
            dto: request,
          });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.sensitivePersonalDataTypeService.postSingleItSystemGlobalSensitivePersonalDataTypesInternalV2CreateGlobalSensitivePersonalData(
            {
              dto: request,
            }
          );
      case 'it-system_usage-data-classification-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.itSystemCategoryService.postSingleItSystemGlobalItSystemCategoriesInternalV2CreateGlobalItSystemCategories(
            {
              dto: request,
            }
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.registerTypeService.postSingleItSystemGlobalRegisterTypesInternalV2CreateGlobalRegisterType({
            dto: request,
          });

      //IT contract regular types
      case 'it-contract_contract-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.contractTypeService.postSingleItContractGlobalItContractTypesInternalV2CreateGlobalItContractType({
            dto: request,
          });

      case 'it-contract_contract-template-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.templateTypeService.postSingleItContractGlobalItContractTemplateTypesInternalV2CreateGlobalItContractTemplateType(
            {
              dto: request,
            }
          );

      case 'it-contract_purchase-form-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.purchaseFormTypeService.postSingleItContractGlobalPurchaseFormTypesInternalV2CreateGlobalPurchaseFormType(
            {
              dto: request,
            }
          );

      case 'it-contract-payment-model-types':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.paymentModelTypeService.postSingleItContractGlobalPaymentModelTypesInternalV2CreateGlobalPaymentModelType(
            {
              dto: request,
            }
          );

      case 'it-contract-agreement-element-types':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.agreementElementTypeService.postSingleItContractGlobalAgreementElementTypesInternalV2CreateGlobalAgreementElementType(
            {
              dto: request,
            }
          );

      case 'it-contract-extend-types':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.optionExtendTypeService.postSingleItContractGlobalOptionExtendTypesInternalV2CreateGlobalOptionExtendType(
            {
              dto: request,
            }
          );

      case 'it-contract-payment-frequency-types':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.paymentFrequencyTypeService.postSingleItContractGlobalPaymentFrequencyTypesInternalV2CreateGlobalPaymentFreqencyType(
            {
              dto: request,
            }
          );

      case 'it-contract-price-regulation-types':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.priceRegulationTypeService.postSingleItContractGlobalPriceRegulationTypesInternalV2CreateGlobalPriceRegulationType(
            {
              dto: request,
            }
          );

      case 'it-contract_procurement-strategy-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.procurementStrategyTypeService.postSingleItContractGlobalProcurementStrategyTypesInternalV2CreateGlobalProcurementStrategyType(
            {
              dto: request,
            }
          );

      case 'it-contract-termination-period-types':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.terminationDeadlineTypeService.postSingleItContractGlobalTerminationDeadlineTypesInternalV2CreateGlobalTerminationDeadlineType(
            {
              dto: request,
            }
          );

      case 'it-contract_criticality-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.criticalityTypeService.postSingleItContractGlobalCriticalityTypesInternalV2CreateGlobalCriticalityType({
            dto: request,
          });

      // Data processing regular option types
      case 'data-processing-basis-for-transfer-types':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.basisForTransferService.postSingleDprGlobalDataProcessingBasisForTransferOptionsInternalV2CreateGlobalDataProcessingBasisForTransferOption({
            dto: dto,
          });

      case 'data-processing-oversight-option-types':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.oversightOptionService.postSingleDprGlobalDataProcessingOversightOptionsInternalV2CreateGlobalDataProcessingOversightOption({
            dto: dto,
          });

      case 'data-processing-data-responsible-types':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.dataResponsibleService.postSingleDprGlobalDataProcessingDataResponsibleOptionsInternalV2CreateGlobalDataProcessingDataResponsibleOption({
            dto: dto,
          });

      case 'data-processing-country-types':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.countryService.postSingleDprGlobalDataProcessingCountryOptionsInternalV2CreateGlobalDataProcessingCountryOption({
            dto: dto,
          });

      //Role types
      case 'it-system-usage':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.itSystemRoleService.postSingleItSystemGlobalRoleOptionTypesInternalV2CreateItSystemRole({
            dto,
          });
      case 'it-contract':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.itContractRoleService.postSingleItContractGlobalItContractRoleTypesInternalV2CreateGlobalItContractRoleType(
            {
              dto,
            }
          );
      case 'data-processing':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.dprRoleService.postSingleDprGlobalRoleOptionTypesInternalV2CreateDprRole({
            dto,
          });
      default:
        throw new Error(`Create operation is not supported for ${optionType}`);
    }
  }
}

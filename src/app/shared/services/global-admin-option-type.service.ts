import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  APIGlobalRegularOptionUpdateRequestDTO,
  APIGlobalRoleOptionCreateRequestDTO,
  APIGlobalRoleOptionResponseDTO,
  APIGlobalRoleOptionUpdateRequestDTO,
  DprGlobalDataProcessingBasisForTransferOptionsInternalV2Service,
  DprGlobalDataProcessingCountryOptionsInternalV2Service,
  DprGlobalDataProcessingDataResponsibleOptionsInternalV2Service,
  DprGlobalDataProcessingOversightOptionsInternalV2Service,
  DprGlobalRoleOptionTypesInternalV2Service,
  ItContractGlobalAgreementElementTypesInternalV2Service,
  ItContractGlobalCriticalityTypesInternalV2Service,
  ItContractGlobalItContractRoleTypesInternalV2Service,
  ItContractGlobalItContractTemplateTypesInternalV2Service,
  ItContractGlobalItContractTypesInternalV2Service,
  ItContractGlobalOptionExtendTypesInternalV2Service,
  ItContractGlobalPaymentFrequencyTypesInternalV2Service,
  ItContractGlobalPaymentModelTypesInternalV2Service,
  ItContractGlobalPriceRegulationTypesInternalV2Service,
  ItContractGlobalProcurementStrategyTypesInternalV2Service,
  ItContractGlobalPurchaseFormTypesInternalV2Service,
  ItContractGlobalTerminationDeadlineTypesInternalV2Service,
  ItSystemGlobalArchiveLocationsInternalV2Service,
  ItSystemGlobalArchiveTestLocationsInternalV2Service,
  ItSystemGlobalArchiveTypesInternalV2Service,
  ItSystemGlobalBusinessTypesInternalV2Service,
  ItSystemGlobalDataTypesInternalV2Service,
  ItSystemGlobalFrequencyTypesInternalV2Service,
  ItSystemGlobalInterfaceTypesInternalV2Service,
  ItSystemGlobalItSystemCategoriesInternalV2Service,
  ItSystemGlobalRegisterTypesInternalV2Service,
  ItSystemGlobalRoleOptionTypesInternalV2Service,
  ItSystemGlobalSensitivePersonalDataTypesInternalV2Service,
  ItSystemGlobalSystemUsageCriticalityLevelTypesInternalV2Service,
  OrganizationGlobalCountryCodesInternalV2Service,
  OrganizationUnitGlobalRoleOptionTypesInternalV2Service,
} from 'src/app/api/v2';
import { GlobalAdminOptionType } from '../models/options/global-admin-option-type.model';

@Injectable({
  providedIn: 'root',
})
export class GlobalAdminOptionTypeService {
  constructor(
    //IT system regular types
    @Inject(ItSystemGlobalBusinessTypesInternalV2Service)
    private readonly businessTypeService: ItSystemGlobalBusinessTypesInternalV2Service,
    @Inject(ItSystemGlobalArchiveTypesInternalV2Service)
    private readonly archiveTypeService: ItSystemGlobalArchiveTypesInternalV2Service,
    @Inject(ItSystemGlobalArchiveLocationsInternalV2Service)
    private readonly archiveLocationService: ItSystemGlobalArchiveLocationsInternalV2Service,
    @Inject(ItSystemGlobalArchiveTestLocationsInternalV2Service)
    private readonly archiveTestLocationService: ItSystemGlobalArchiveTestLocationsInternalV2Service,
    @Inject(ItSystemGlobalDataTypesInternalV2Service)
    private readonly dataTypeService: ItSystemGlobalDataTypesInternalV2Service,
    @Inject(ItSystemGlobalFrequencyTypesInternalV2Service)
    private readonly frequencyTypeService: ItSystemGlobalFrequencyTypesInternalV2Service,
    @Inject(ItSystemGlobalInterfaceTypesInternalV2Service)
    private readonly interfaceTypeService: ItSystemGlobalInterfaceTypesInternalV2Service,
    @Inject(ItSystemGlobalSensitivePersonalDataTypesInternalV2Service)
    private readonly sensitivePersonalDataTypeService: ItSystemGlobalSensitivePersonalDataTypesInternalV2Service,
    @Inject(ItSystemGlobalItSystemCategoriesInternalV2Service)
    private readonly itSystemCategoryService: ItSystemGlobalItSystemCategoriesInternalV2Service,
    @Inject(ItSystemGlobalRegisterTypesInternalV2Service)
    private readonly registerTypeService: ItSystemGlobalRegisterTypesInternalV2Service,
    @Inject(ItSystemGlobalSystemUsageCriticalityLevelTypesInternalV2Service)
    private readonly systemUsageCriticalityLevelService: ItSystemGlobalSystemUsageCriticalityLevelTypesInternalV2Service,

    //IT Contract regular types
    @Inject(ItContractGlobalItContractTypesInternalV2Service)
    private readonly contractTypeService: ItContractGlobalItContractTypesInternalV2Service,
    @Inject(ItContractGlobalItContractTemplateTypesInternalV2Service)
    private readonly templateTypeService: ItContractGlobalItContractTemplateTypesInternalV2Service,
    @Inject(ItContractGlobalPurchaseFormTypesInternalV2Service)
    private readonly purchaseFormTypeService: ItContractGlobalPurchaseFormTypesInternalV2Service,
    @Inject(ItContractGlobalPaymentModelTypesInternalV2Service)
    private readonly paymentModelTypeService: ItContractGlobalPaymentModelTypesInternalV2Service,
    @Inject(ItContractGlobalAgreementElementTypesInternalV2Service)
    private readonly agreementElementTypeService: ItContractGlobalAgreementElementTypesInternalV2Service,
    @Inject(ItContractGlobalOptionExtendTypesInternalV2Service)
    private readonly optionExtendTypeService: ItContractGlobalOptionExtendTypesInternalV2Service,
    @Inject(ItContractGlobalPaymentFrequencyTypesInternalV2Service)
    private readonly paymentFrequencyTypeService: ItContractGlobalPaymentFrequencyTypesInternalV2Service,
    @Inject(ItContractGlobalPriceRegulationTypesInternalV2Service)
    private readonly priceRegulationTypeService: ItContractGlobalPriceRegulationTypesInternalV2Service,
    @Inject(ItContractGlobalProcurementStrategyTypesInternalV2Service)
    private readonly procurementStrategyTypeService: ItContractGlobalProcurementStrategyTypesInternalV2Service,
    @Inject(ItContractGlobalTerminationDeadlineTypesInternalV2Service)
    private readonly terminationDeadlineTypeService: ItContractGlobalTerminationDeadlineTypesInternalV2Service,
    @Inject(ItContractGlobalCriticalityTypesInternalV2Service)
    private readonly criticalityTypeService: ItContractGlobalCriticalityTypesInternalV2Service,

    //Data processing regular option type services
    @Inject(DprGlobalDataProcessingBasisForTransferOptionsInternalV2Service)
    private readonly basisForTransferService: DprGlobalDataProcessingBasisForTransferOptionsInternalV2Service,
    @Inject(DprGlobalDataProcessingOversightOptionsInternalV2Service)
    private readonly oversightOptionService: DprGlobalDataProcessingOversightOptionsInternalV2Service,
    @Inject(DprGlobalDataProcessingDataResponsibleOptionsInternalV2Service)
    private readonly dataResponsibleService: DprGlobalDataProcessingDataResponsibleOptionsInternalV2Service,
    @Inject(DprGlobalDataProcessingCountryOptionsInternalV2Service)
    private readonly countryService: DprGlobalDataProcessingCountryOptionsInternalV2Service,

    //Organization types
    @Inject(OrganizationGlobalCountryCodesInternalV2Service)
    private readonly countryCodeService: OrganizationGlobalCountryCodesInternalV2Service,

    //Role types
    @Inject(ItSystemGlobalRoleOptionTypesInternalV2Service)
    private readonly itSystemRoleService: ItSystemGlobalRoleOptionTypesInternalV2Service,
    @Inject(ItContractGlobalItContractRoleTypesInternalV2Service)
    private readonly itContractRoleService: ItContractGlobalItContractRoleTypesInternalV2Service,
    @Inject(DprGlobalRoleOptionTypesInternalV2Service)
    private readonly dprRoleService: DprGlobalRoleOptionTypesInternalV2Service,
    @Inject(OrganizationUnitGlobalRoleOptionTypesInternalV2Service)
    private readonly orgUnitRoleService: OrganizationUnitGlobalRoleOptionTypesInternalV2Service,
  ) {}

  public getGlobalOptions(optionType: GlobalAdminOptionType): Observable<Array<APIGlobalRoleOptionResponseDTO>> {
    return this.resolveGetGlobalOptionsEndpoint(optionType)();
  }

  public createGlobalOption(
    optionType: GlobalAdminOptionType,
    request: APIGlobalRoleOptionCreateRequestDTO,
  ): Observable<APIGlobalRoleOptionResponseDTO> {
    return this.resolveCreateGlobalOptionEndpoint(optionType)(request);
  }

  public patchGlobalOption(
    optionType: GlobalAdminOptionType,
    optionUuid: string,
    request: APIGlobalRoleOptionUpdateRequestDTO,
  ) {
    return this.resolvePatchGlobalOptionEndpoint(optionType)(optionUuid, request);
  }

  private resolveGetGlobalOptionsEndpoint(
    optionType: GlobalAdminOptionType,
  ): () => Observable<Array<APIGlobalRoleOptionResponseDTO>> {
    switch (optionType) {
      //It system regular types
      case 'it-system_business-type':
        return () => this.businessTypeService.getSingleItSystemGlobalBusinessTypesInternalV2GetBusinessTypes();
      case 'it-system_usage-archive-type':
        return () => this.archiveTypeService.getSingleItSystemGlobalArchiveTypesInternalV2GetGlobalArchiveTypes();
      case 'it-system_usage-archive-location-type':
        return () => this.archiveLocationService.getSingleItSystemGlobalArchiveLocationsInternalV2GetArchiveLocations();
      case 'it-system_usage-archive-location-test-type':
        return () =>
          this.archiveTestLocationService.getSingleItSystemGlobalArchiveTestLocationsInternalV2GetGlobalArchiveTestLocations();
      case 'it-interface_data-type':
        return () => this.dataTypeService.getSingleItSystemGlobalDataTypesInternalV2GetGlobalDataTypes();
      case 'it-system_usage-relation-frequency-type':
        return () => this.frequencyTypeService.getSingleItSystemGlobalFrequencyTypesInternalV2GetGlobalFrequencyTypes();
      case 'it-interface_interface-type':
        return () => this.interfaceTypeService.getSingleItSystemGlobalInterfaceTypesInternalV2GetGlobalInterfaceTypes();
      case 'it_system_usage-gdpr-sensitive-data-type':
        return () =>
          this.sensitivePersonalDataTypeService.getSingleItSystemGlobalSensitivePersonalDataTypesInternalV2GetGlobalSensitivePersonalDatas();
      case 'it-system_usage-data-classification-type':
        return () =>
          this.itSystemCategoryService.getSingleItSystemGlobalItSystemCategoriesInternalV2GetGlobalItSystemCategoriess();
      case 'it_system_usage-gdpr-registered-data-category-type':
        return () => this.registerTypeService.getSingleItSystemGlobalRegisterTypesInternalV2GetGlobalRegisterTypes();
      case 'it-system-usage_system-usage-criticality-level':
        return () =>
          this.systemUsageCriticalityLevelService.getSingleItSystemGlobalSystemUsageCriticalityLevelTypesInternalV2GetSystemUsageCriticalityLevelTypes();

      //It Contract regular types
      case 'it-contract_contract-type':
        return () =>
          this.contractTypeService.getSingleItContractGlobalItContractTypesInternalV2GetGlobalItContractTypes();

      case 'it-contract_contract-template-type':
        return () =>
          this.templateTypeService.getSingleItContractGlobalItContractTemplateTypesInternalV2GetGlobalItContractTemplateTypes();

      case 'it-contract_purchase-form-type':
        return () =>
          this.purchaseFormTypeService.getSingleItContractGlobalPurchaseFormTypesInternalV2GetGlobalPurchaseFormTypes();

      case 'it-contract-payment-model-types':
        return () =>
          this.paymentModelTypeService.getSingleItContractGlobalPaymentModelTypesInternalV2GetGlobalPaymentModelTypes();

      case 'it-contract-agreement-element-types':
        return () =>
          this.agreementElementTypeService.getSingleItContractGlobalAgreementElementTypesInternalV2GetGlobalAgreementElementTypes();

      case 'it-contract-extend-types':
        return () =>
          this.optionExtendTypeService.getSingleItContractGlobalOptionExtendTypesInternalV2GetGlobalOptionExtendTypes();

      case 'it-contract-payment-frequency-types':
        return () =>
          this.paymentFrequencyTypeService.getSingleItContractGlobalPaymentFrequencyTypesInternalV2GetGlobalPaymentFreqencyTypes();

      case 'it-contract-price-regulation-types':
        return () =>
          this.priceRegulationTypeService.getSingleItContractGlobalPriceRegulationTypesInternalV2GetGlobalPriceRegulationTypes();

      case 'it-contract_procurement-strategy-type':
        return () =>
          this.procurementStrategyTypeService.getSingleItContractGlobalProcurementStrategyTypesInternalV2GetGlobalProcurementStrategyTypes();

      case 'it-contract-termination-period-types':
        return () =>
          this.terminationDeadlineTypeService.getSingleItContractGlobalTerminationDeadlineTypesInternalV2GetGlobalTerminationDeadlineTypes();

      case 'it-contract_criticality-type':
        return () =>
          this.criticalityTypeService.getSingleItContractGlobalCriticalityTypesInternalV2GetGlobalCriticalityTypes();

      //Data processing regular types
      case 'data-processing-basis-for-transfer-types':
        return () =>
          this.basisForTransferService.getSingleDprGlobalDataProcessingBasisForTransferOptionsInternalV2GetGlobalDataProcessingBasisForTransferOptions();
      case 'data-processing-oversight-option-types':
        return () =>
          this.oversightOptionService.getSingleDprGlobalDataProcessingOversightOptionsInternalV2GetGlobalDataProcessingOversightOptions();
      case 'data-processing-data-responsible-types':
        return () =>
          this.dataResponsibleService.getSingleDprGlobalDataProcessingDataResponsibleOptionsInternalV2GetGlobalDataProcessingDataResponsibleOptions();
      case 'data-processing-country-types':
        return () =>
          this.countryService.getSingleDprGlobalDataProcessingCountryOptionsInternalV2GetGlobalDataProcessingCountryOptions();

      //Organization types
      case 'organization_country-code':
        return () => this.countryCodeService.getSingleOrganizationGlobalCountryCodesInternalV2GetCountryCodes();

      //Role types
      case 'it-system-usage':
        return () => this.itSystemRoleService.getSingleItSystemGlobalRoleOptionTypesInternalV2GetItSystemRoles();
      case 'it-contract':
        return () =>
          this.itContractRoleService.getSingleItContractGlobalItContractRoleTypesInternalV2GetGlobalItContractRoleTypes();
      case 'data-processing':
        return () => this.dprRoleService.getSingleDprGlobalRoleOptionTypesInternalV2GetDprRoles();
      case 'organization-unit':
        return () =>
          this.orgUnitRoleService.getSingleOrganizationUnitGlobalRoleOptionTypesInternalV2GetOrganizationUnitRoles();
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
            aPIGlobalRegularOptionUpdateRequestDTO: dto,
          });
      case 'it-system_usage-archive-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.archiveTypeService.patchSingleItSystemGlobalArchiveTypesInternalV2PatchGlobalArchiveType({
            optionUuid,
            aPIGlobalRegularOptionUpdateRequestDTO: dto,
          });
      case 'it-system_usage-archive-location-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.archiveLocationService.patchSingleItSystemGlobalArchiveLocationsInternalV2PatchGlobalArchiveLocation({
            optionUuid,
            aPIGlobalRegularOptionUpdateRequestDTO: dto,
          });
      case 'it-system_usage-archive-location-test-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.archiveTestLocationService.patchSingleItSystemGlobalArchiveTestLocationsInternalV2PatchGlobalArchiveTestLocation(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: dto,
            },
          );
      case 'it-interface_data-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.dataTypeService.patchSingleItSystemGlobalDataTypesInternalV2PatchGlobalDataType({
            optionUuid,
            aPIGlobalRegularOptionUpdateRequestDTO: dto,
          });
      case 'it-system_usage-relation-frequency-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.frequencyTypeService.patchSingleItSystemGlobalFrequencyTypesInternalV2PatchGlobalFrequencyType({
            optionUuid,
            aPIGlobalRegularOptionUpdateRequestDTO: dto,
          });
      case 'it-interface_interface-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.interfaceTypeService.patchSingleItSystemGlobalInterfaceTypesInternalV2PatchGlobalInterfaceType({
            optionUuid,
            aPIGlobalRegularOptionUpdateRequestDTO: dto,
          });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.sensitivePersonalDataTypeService.patchSingleItSystemGlobalSensitivePersonalDataTypesInternalV2PatchGlobalSensitivePersonalData(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: dto,
            },
          );
      case 'it-system_usage-data-classification-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.itSystemCategoryService.patchSingleItSystemGlobalItSystemCategoriesInternalV2PatchGlobalItSystemCategories(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: dto,
            },
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.registerTypeService.patchSingleItSystemGlobalRegisterTypesInternalV2PatchGlobalRegisterType({
            optionUuid,
            aPIGlobalRegularOptionUpdateRequestDTO: dto,
          });
      case 'it-system-usage_system-usage-criticality-level':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.systemUsageCriticalityLevelService.patchSingleItSystemGlobalSystemUsageCriticalityLevelTypesInternalV2PatchSystemUsageCriticalityLevelType(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: dto,
            },
          );

      //IT contract regular types
      case 'it-contract_contract-type':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.contractTypeService.patchSingleItContractGlobalItContractTypesInternalV2PatchGlobalItContractType({
            optionUuid,
            aPIGlobalRegularOptionUpdateRequestDTO: request,
          });

      case 'it-contract_contract-template-type':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.templateTypeService.patchSingleItContractGlobalItContractTemplateTypesInternalV2PatchGlobalItContractTemplateType(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: request,
            },
          );

      case 'it-contract_purchase-form-type':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.purchaseFormTypeService.patchSingleItContractGlobalPurchaseFormTypesInternalV2PatchGlobalPurchaseFormType(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: request,
            },
          );

      case 'it-contract-payment-model-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.paymentModelTypeService.patchSingleItContractGlobalPaymentModelTypesInternalV2PatchGlobalPaymentModelType(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: request,
            },
          );

      case 'it-contract-agreement-element-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.agreementElementTypeService.patchSingleItContractGlobalAgreementElementTypesInternalV2PatchGlobalAgreementElementType(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: request,
            },
          );

      case 'it-contract-extend-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.optionExtendTypeService.patchSingleItContractGlobalOptionExtendTypesInternalV2PatchGlobalOptionExtendType(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: request,
            },
          );

      case 'it-contract-payment-frequency-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.paymentFrequencyTypeService.patchSingleItContractGlobalPaymentFrequencyTypesInternalV2PatchGlobalPaymentFreqencyType(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: request,
            },
          );

      case 'it-contract-price-regulation-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.priceRegulationTypeService.patchSingleItContractGlobalPriceRegulationTypesInternalV2PatchGlobalPriceRegulationType(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: request,
            },
          );

      case 'it-contract_procurement-strategy-type':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.procurementStrategyTypeService.patchSingleItContractGlobalProcurementStrategyTypesInternalV2PatchGlobalProcurementStrategyType(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: request,
            },
          );

      case 'it-contract-termination-period-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.terminationDeadlineTypeService.patchSingleItContractGlobalTerminationDeadlineTypesInternalV2PatchGlobalTerminationDeadlineType(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: request,
            },
          );

      case 'it-contract_criticality-type':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.criticalityTypeService.patchSingleItContractGlobalCriticalityTypesInternalV2PatchGlobalCriticalityType({
            optionUuid,
            aPIGlobalRegularOptionUpdateRequestDTO: request,
          });

      // Data processing regular option types
      case 'data-processing-basis-for-transfer-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.basisForTransferService.patchSingleDprGlobalDataProcessingBasisForTransferOptionsInternalV2PatchGlobalDataProcessingBasisForTransferOption(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: request,
            },
          );

      case 'data-processing-oversight-option-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.oversightOptionService.patchSingleDprGlobalDataProcessingOversightOptionsInternalV2PatchGlobalDataProcessingOversightOption(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: request,
            },
          );

      case 'data-processing-data-responsible-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.dataResponsibleService.patchSingleDprGlobalDataProcessingDataResponsibleOptionsInternalV2PatchGlobalDataProcessingDataResponsibleOption(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: request,
            },
          );

      case 'data-processing-country-types':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.countryService.patchSingleDprGlobalDataProcessingCountryOptionsInternalV2PatchGlobalDataProcessingCountryOption(
            {
              optionUuid,
              aPIGlobalRegularOptionUpdateRequestDTO: request,
            },
          );

      //Organization types
      case 'organization_country-code':
        return (optionUuid: string, request: APIGlobalRegularOptionUpdateRequestDTO) =>
          this.countryCodeService.patchSingleOrganizationGlobalCountryCodesInternalV2PatchCountryCode({
            optionUuid,
            aPIGlobalRegularOptionUpdateRequestDTO: request,
          });

      //Role types
      case 'it-system-usage':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.itSystemRoleService.patchSingleItSystemGlobalRoleOptionTypesInternalV2PatchGlobalBItSystemRole({
            optionUuid,
            aPIGlobalRoleOptionUpdateRequestDTO: dto,
          });
      case 'it-contract':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.itContractRoleService.patchSingleItContractGlobalItContractRoleTypesInternalV2PatchGlobalItContractRoleType(
            {
              optionUuid,
              aPIGlobalRoleOptionUpdateRequestDTO: dto,
            },
          );
      case 'data-processing':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.dprRoleService.patchSingleDprGlobalRoleOptionTypesInternalV2PatchDprRole({
            optionUuid,
            aPIGlobalRoleOptionUpdateRequestDTO: dto,
          });
      case 'organization-unit':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.orgUnitRoleService.patchSingleOrganizationUnitGlobalRoleOptionTypesInternalV2PatchGlobalOrganizationUnitRole(
            {
              optionUuid,
              aPIGlobalRoleOptionUpdateRequestDTO: dto,
            },
          );
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
            aPIGlobalRegularOptionCreateRequestDTO: request,
          });
      case 'it-system_usage-archive-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.archiveTypeService.postSingleItSystemGlobalArchiveTypesInternalV2CreateGlobalArchiveType({
            aPIGlobalRegularOptionCreateRequestDTO: request,
          });
      case 'it-system_usage-archive-location-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.archiveLocationService.postSingleItSystemGlobalArchiveLocationsInternalV2CreateArchiveLocation({
            aPIGlobalRegularOptionCreateRequestDTO: request,
          });
      case 'it-system_usage-archive-location-test-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.archiveTestLocationService.postSingleItSystemGlobalArchiveTestLocationsInternalV2CreateGlobalArchiveTestLocation(
            {
              aPIGlobalRegularOptionCreateRequestDTO: request,
            },
          );
      case 'it-interface_data-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.dataTypeService.postSingleItSystemGlobalDataTypesInternalV2CreateGlobalDataType({
            aPIGlobalRegularOptionCreateRequestDTO: request,
          });
      case 'it-system_usage-relation-frequency-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.frequencyTypeService.postSingleItSystemGlobalFrequencyTypesInternalV2CreateGlobalFrequencyType({
            aPIGlobalRegularOptionCreateRequestDTO: request,
          });
      case 'it-interface_interface-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.interfaceTypeService.postSingleItSystemGlobalInterfaceTypesInternalV2CreateGlobalInterfaceType({
            aPIGlobalRegularOptionCreateRequestDTO: request,
          });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.sensitivePersonalDataTypeService.postSingleItSystemGlobalSensitivePersonalDataTypesInternalV2CreateGlobalSensitivePersonalData(
            {
              aPIGlobalRegularOptionCreateRequestDTO: request,
            },
          );
      case 'it-system_usage-data-classification-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.itSystemCategoryService.postSingleItSystemGlobalItSystemCategoriesInternalV2CreateGlobalItSystemCategories(
            {
              aPIGlobalRegularOptionCreateRequestDTO: request,
            },
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.registerTypeService.postSingleItSystemGlobalRegisterTypesInternalV2CreateGlobalRegisterType({
            aPIGlobalRegularOptionCreateRequestDTO: request,
          });

      case 'it-system-usage_system-usage-criticality-level':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.systemUsageCriticalityLevelService.postSingleItSystemGlobalSystemUsageCriticalityLevelTypesInternalV2CreateSystemUsageCriticalityLevelType(
            {
              aPIGlobalRegularOptionCreateRequestDTO: request,
            },
          );

      //IT contract regular types
      case 'it-contract_contract-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.contractTypeService.postSingleItContractGlobalItContractTypesInternalV2CreateGlobalItContractType({
            aPIGlobalRegularOptionCreateRequestDTO: request,
          });

      case 'it-contract_contract-template-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.templateTypeService.postSingleItContractGlobalItContractTemplateTypesInternalV2CreateGlobalItContractTemplateType(
            {
              aPIGlobalRegularOptionCreateRequestDTO: request,
            },
          );

      case 'it-contract_purchase-form-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.purchaseFormTypeService.postSingleItContractGlobalPurchaseFormTypesInternalV2CreateGlobalPurchaseFormType(
            {
              aPIGlobalRegularOptionCreateRequestDTO: request,
            },
          );

      case 'it-contract-payment-model-types':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.paymentModelTypeService.postSingleItContractGlobalPaymentModelTypesInternalV2CreateGlobalPaymentModelType(
            {
              aPIGlobalRegularOptionCreateRequestDTO: request,
            },
          );

      case 'it-contract-agreement-element-types':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.agreementElementTypeService.postSingleItContractGlobalAgreementElementTypesInternalV2CreateGlobalAgreementElementType(
            {
              aPIGlobalRegularOptionCreateRequestDTO: request,
            },
          );

      case 'it-contract-extend-types':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.optionExtendTypeService.postSingleItContractGlobalOptionExtendTypesInternalV2CreateGlobalOptionExtendType(
            {
              aPIGlobalRegularOptionCreateRequestDTO: request,
            },
          );

      case 'it-contract-payment-frequency-types':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.paymentFrequencyTypeService.postSingleItContractGlobalPaymentFrequencyTypesInternalV2CreateGlobalPaymentFreqencyType(
            {
              aPIGlobalRegularOptionCreateRequestDTO: request,
            },
          );

      case 'it-contract-price-regulation-types':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.priceRegulationTypeService.postSingleItContractGlobalPriceRegulationTypesInternalV2CreateGlobalPriceRegulationType(
            {
              aPIGlobalRegularOptionCreateRequestDTO: request,
            },
          );

      case 'it-contract_procurement-strategy-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.procurementStrategyTypeService.postSingleItContractGlobalProcurementStrategyTypesInternalV2CreateGlobalProcurementStrategyType(
            {
              aPIGlobalRegularOptionCreateRequestDTO: request,
            },
          );

      case 'it-contract-termination-period-types':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.terminationDeadlineTypeService.postSingleItContractGlobalTerminationDeadlineTypesInternalV2CreateGlobalTerminationDeadlineType(
            {
              aPIGlobalRegularOptionCreateRequestDTO: request,
            },
          );

      case 'it-contract_criticality-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.criticalityTypeService.postSingleItContractGlobalCriticalityTypesInternalV2CreateGlobalCriticalityType({
            aPIGlobalRegularOptionCreateRequestDTO: request,
          });

      // Data processing regular option types
      case 'data-processing-basis-for-transfer-types':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.basisForTransferService.postSingleDprGlobalDataProcessingBasisForTransferOptionsInternalV2CreateGlobalDataProcessingBasisForTransferOption(
            {
              aPIGlobalRegularOptionCreateRequestDTO: dto,
            },
          );

      case 'data-processing-oversight-option-types':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.oversightOptionService.postSingleDprGlobalDataProcessingOversightOptionsInternalV2CreateGlobalDataProcessingOversightOption(
            {
              aPIGlobalRegularOptionCreateRequestDTO: dto,
            },
          );

      case 'data-processing-data-responsible-types':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.dataResponsibleService.postSingleDprGlobalDataProcessingDataResponsibleOptionsInternalV2CreateGlobalDataProcessingDataResponsibleOption(
            {
              aPIGlobalRegularOptionCreateRequestDTO: dto,
            },
          );

      case 'data-processing-country-types':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.countryService.postSingleDprGlobalDataProcessingCountryOptionsInternalV2CreateGlobalDataProcessingCountryOption(
            {
              aPIGlobalRegularOptionCreateRequestDTO: dto,
            },
          );

      //Organization types
      case 'organization_country-code':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.countryCodeService.postSingleOrganizationGlobalCountryCodesInternalV2CreateCountryCode({
            aPIGlobalRegularOptionCreateRequestDTO: request,
          });

      //Role types
      case 'it-system-usage':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.itSystemRoleService.postSingleItSystemGlobalRoleOptionTypesInternalV2CreateItSystemRole({
            aPIGlobalRoleOptionCreateRequestDTO: dto,
          });
      case 'it-contract':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.itContractRoleService.postSingleItContractGlobalItContractRoleTypesInternalV2CreateGlobalItContractRoleType(
            {
              aPIGlobalRoleOptionCreateRequestDTO: dto,
            },
          );
      case 'data-processing':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.dprRoleService.postSingleDprGlobalRoleOptionTypesInternalV2CreateDprRole({
            aPIGlobalRoleOptionCreateRequestDTO: dto,
          });
      case 'organization-unit':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.orgUnitRoleService.postSingleOrganizationUnitGlobalRoleOptionTypesInternalV2CreateOrganizationUnitRole({
            aPIGlobalRoleOptionCreateRequestDTO: dto,
          });
      default:
        throw new Error(`Create operation is not supported for ${optionType}`);
    }
  }
}

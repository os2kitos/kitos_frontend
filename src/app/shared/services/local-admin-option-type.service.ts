import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  APILocalRegularOptionResponseDTO,
  APILocalRegularOptionUpdateRequestDTO,
  APILocalRoleOptionResponseDTO,
  APILocalRoleOptionUpdateRequestDTO,
  DprLocalBasisForTransferTypesInternalV2Service,
  DprLocalCountryOptionTypesInternalV2Service,
  DprLocalDataResponsibleTypesInternalV2Service,
  DprLocalOversightOptionTypesInternalV2Service,
  DprLocalRoleOptionTypesInternalV2Service,
  ItContractLocalAgreementElementTypesInternalV2Service,
  ItContractLocalContractTypesInternalV2Service,
  ItContractLocalCriticalityTypesInternalV2Service,
  ItContractLocalOptionExtendTypesInternalV2Service,
  ItContractLocalPaymentFrequencyTypesInternalV2Service,
  ItContractLocalPaymentModelTypesInternalV2Service,
  ItContractLocalPriceRegulationTypesInternalV2Service,
  ItContractLocalProcurementStrategyTypesInternalV2Service,
  ItContractLocalPurchaseFormTypesInternalV2Service,
  ItContractLocalRoleOptionTypesInternalV2Service,
  ItContractLocalTemplateTypesInternalV2Service,
  ItContractLocalTerminationDeadlineTypesInternalV2Service,
  ItSystemLocalArchiveLocationTypesInternalV2Service,
  ItSystemLocalArchiveTestLocationTypesInternalV2Service,
  ItSystemLocalArchiveTypesInternalV2Service,
  ItSystemLocalBusinessTypesInternalV2Service,
  ItSystemLocalDataTypesInternalV2Service,
  ItSystemLocalFrequencyTypesInternalV2Service,
  ItSystemLocalInterfaceTypesInternalV2Service,
  ItSystemLocalItSystemCategoriesTypesInternalV2Service,
  ItSystemLocalRegisterTypesInternalV2Service,
  ItSystemLocalRoleOptionTypesInternalV2Service,
  ItSystemLocalSensitivePersonalDataTypesInternalV2Service,
  ItSystemLocalSystemUsageCriticalityLevelTypesInternalV2Service,
  ItSystemLocalTechnicalSystemTypesInternalV2Service,
  OrganizationUnitLocalRoleOptionTypesInternalV2Service,
} from 'src/app/api/v2';
import { LocalAdminOptionType } from '../models/options/local-admin-option-type.model';

@Injectable({
  providedIn: 'root',
})
export class LocalAdminOptionTypeService implements OnDestroy {
  public subscriptions = new Subscription();

  constructor(
    //It system regular option type services
    @Inject(ItSystemLocalBusinessTypesInternalV2Service)
    private businessTypeService: ItSystemLocalBusinessTypesInternalV2Service,
    @Inject(ItSystemLocalArchiveTypesInternalV2Service)
    private archiveTypeService: ItSystemLocalArchiveTypesInternalV2Service,
    @Inject(ItSystemLocalArchiveLocationTypesInternalV2Service)
    private archiveLocationService: ItSystemLocalArchiveLocationTypesInternalV2Service,
    @Inject(ItSystemLocalArchiveTestLocationTypesInternalV2Service)
    private archiveTestLocationService: ItSystemLocalArchiveTestLocationTypesInternalV2Service,
    @Inject(ItSystemLocalDataTypesInternalV2Service)
    private dataTypeService: ItSystemLocalDataTypesInternalV2Service,
    @Inject(ItSystemLocalFrequencyTypesInternalV2Service)
    private frequencyTypeService: ItSystemLocalFrequencyTypesInternalV2Service,
    @Inject(ItSystemLocalInterfaceTypesInternalV2Service)
    private interfaceTypeService: ItSystemLocalInterfaceTypesInternalV2Service,
    @Inject(ItSystemLocalSensitivePersonalDataTypesInternalV2Service)
    private sensitivePersonalDataTypeService: ItSystemLocalSensitivePersonalDataTypesInternalV2Service,
    @Inject(ItSystemLocalItSystemCategoriesTypesInternalV2Service)
    private itSystemCategoryService: ItSystemLocalItSystemCategoriesTypesInternalV2Service,
    @Inject(ItSystemLocalRegisterTypesInternalV2Service)
    private registerTypeService: ItSystemLocalRegisterTypesInternalV2Service,
    @Inject(ItSystemLocalSystemUsageCriticalityLevelTypesInternalV2Service)
    private criticalityLevelService: ItSystemLocalSystemUsageCriticalityLevelTypesInternalV2Service,
    @Inject(ItSystemLocalTechnicalSystemTypesInternalV2Service)
    private technicalSystemTypeService: ItSystemLocalTechnicalSystemTypesInternalV2Service,

    //It contract regular option services
    @Inject(ItContractLocalContractTypesInternalV2Service)
    private contractTypeService: ItContractLocalContractTypesInternalV2Service,
    @Inject(ItContractLocalTemplateTypesInternalV2Service)
    private templateTypeService: ItContractLocalTemplateTypesInternalV2Service,
    @Inject(ItContractLocalPurchaseFormTypesInternalV2Service)
    private purchaseFormTypeService: ItContractLocalPurchaseFormTypesInternalV2Service,
    @Inject(ItContractLocalPaymentModelTypesInternalV2Service)
    private paymentModelTypeService: ItContractLocalPaymentModelTypesInternalV2Service,
    @Inject(ItContractLocalAgreementElementTypesInternalV2Service)
    private agreementElementTypeService: ItContractLocalAgreementElementTypesInternalV2Service,
    @Inject(ItContractLocalOptionExtendTypesInternalV2Service)
    private optionExtendTypeService: ItContractLocalOptionExtendTypesInternalV2Service,
    @Inject(ItContractLocalPaymentFrequencyTypesInternalV2Service)
    private paymentFrequencyTypeService: ItContractLocalPaymentFrequencyTypesInternalV2Service,
    @Inject(ItContractLocalPriceRegulationTypesInternalV2Service)
    private priceRegulationTypeService: ItContractLocalPriceRegulationTypesInternalV2Service,
    @Inject(ItContractLocalProcurementStrategyTypesInternalV2Service)
    private procurementStrategyTypeService: ItContractLocalProcurementStrategyTypesInternalV2Service,
    @Inject(ItContractLocalTerminationDeadlineTypesInternalV2Service)
    private terminationDeadlineTypeService: ItContractLocalTerminationDeadlineTypesInternalV2Service,
    @Inject(ItContractLocalCriticalityTypesInternalV2Service)
    private criticalityTypeService: ItContractLocalCriticalityTypesInternalV2Service,

    //Data processing regular option type services
    @Inject(DprLocalBasisForTransferTypesInternalV2Service)
    private basisForTransferService: DprLocalBasisForTransferTypesInternalV2Service,
    @Inject(DprLocalOversightOptionTypesInternalV2Service)
    private oversightOptionService: DprLocalOversightOptionTypesInternalV2Service,
    @Inject(DprLocalDataResponsibleTypesInternalV2Service)
    private dataResponsibleService: DprLocalDataResponsibleTypesInternalV2Service,
    @Inject(DprLocalCountryOptionTypesInternalV2Service)
    private countryService: DprLocalCountryOptionTypesInternalV2Service,

    //Role option type services
    @Inject(OrganizationUnitLocalRoleOptionTypesInternalV2Service)
    private organiztionUnitRoleService: OrganizationUnitLocalRoleOptionTypesInternalV2Service,
    @Inject(ItSystemLocalRoleOptionTypesInternalV2Service)
    private itSystemRoleService: ItSystemLocalRoleOptionTypesInternalV2Service,
    @Inject(ItContractLocalRoleOptionTypesInternalV2Service)
    private itContractRoleService: ItContractLocalRoleOptionTypesInternalV2Service,
    @Inject(DprLocalRoleOptionTypesInternalV2Service)
    private dprRoleService: DprLocalRoleOptionTypesInternalV2Service,
  ) {}

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public getLocalOptions(
    organizationUuid: string,
    optionType: LocalAdminOptionType,
  ): Observable<Array<APILocalRegularOptionResponseDTO>> {
    return this.resolveGetLocalOptionsEndpoint(optionType)(organizationUuid);
  }

  public patchLocalOption(
    optionType: LocalAdminOptionType,
    organizationUuid: string,
    optionUuid: string,
    request: APILocalRegularOptionUpdateRequestDTO,
  ) {
    return this.resolvePatchLocalOptionsEndpoint(optionType)(organizationUuid, optionUuid, request);
  }

  public patchLocalRoleOption(
    optionType: LocalAdminOptionType,
    organizationUuid: string,
    optionUuid: string,
    request: APILocalRoleOptionUpdateRequestDTO,
  ) {
    return this.resolvePatchLocalRoleOptionsEndpoint(optionType)(organizationUuid, optionUuid, request);
  }

  public patchIsActive(
    optionType: LocalAdminOptionType,
    organizationUuid: string,
    optionUuid: string,
    isActive: boolean,
  ) {
    if (isActive) {
      return this.resolveCreateLocalOptionsEndpoint(optionType)(organizationUuid, optionUuid);
    } else {
      return this.resolveDeleteLocalOptionsEndpoint(optionType)(organizationUuid, optionUuid);
    }
  }

  private resolveGetLocalOptionsEndpoint(
    optionType: LocalAdminOptionType,
  ): (organizationUuid: string) => Observable<Array<APILocalRoleOptionResponseDTO>> {
    switch (optionType) {
      //It system regular option types
      case 'it-system_business-type':
        return (organizationUuid) =>
          this.businessTypeService.getSingleItSystemLocalBusinessTypesInternalV2GetLocalBusinessTypes({
            organizationUuid,
          });
      case 'it-system_usage-archive-type':
        return (organizationUuid) =>
          this.archiveTypeService.getSingleItSystemLocalArchiveTypesInternalV2GetLocalArchiveTypes({
            organizationUuid,
          });
      case 'it-system_usage-archive-location-type':
        return (organizationUuid) =>
          this.archiveLocationService.getSingleItSystemLocalArchiveLocationTypesInternalV2GetLocalArchiveLocationTypes({
            organizationUuid,
          });
      case 'it-system_usage-archive-location-test-type':
        return (organizationUuid) =>
          this.archiveTestLocationService.getSingleItSystemLocalArchiveTestLocationTypesInternalV2GetLocalArchiveTestLocationTypes(
            {
              organizationUuid,
            },
          );
      case 'it-interface_data-type':
        return (organizationUuid) =>
          this.dataTypeService.getSingleItSystemLocalDataTypesInternalV2GetLocalDataTypes({
            organizationUuid,
          });
      case 'it-system_usage-relation-frequency-type':
        return (organizationUuid) =>
          this.frequencyTypeService.getSingleItSystemLocalFrequencyTypesInternalV2GetLocalRelationFrequencyTypes({
            organizationUuid,
          });
      case 'it-interface_interface-type':
        return (organizationUuid) =>
          this.interfaceTypeService.getSingleItSystemLocalInterfaceTypesInternalV2GetLocalInterfaceTypes({
            organizationUuid,
          });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (organizationUuid) =>
          this.sensitivePersonalDataTypeService.getSingleItSystemLocalSensitivePersonalDataTypesInternalV2GetLocalSensitivePersonalDataTypes(
            {
              organizationUuid,
            },
          );
      case 'it-system_usage-data-classification-type':
        return (organizationUuid) =>
          this.itSystemCategoryService.getSingleItSystemLocalItSystemCategoriesTypesInternalV2GetLocalItSystemCategoryTypes(
            {
              organizationUuid,
            },
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (organizationUuid) =>
          this.registerTypeService.getSingleItSystemLocalRegisterTypesInternalV2GetLocalRegisterTypes({
            organizationUuid,
          });
      case 'it-system-usage_system-usage-criticality-level':
        return (organizationUuid) =>
          this.criticalityLevelService.getSingleItSystemLocalSystemUsageCriticalityLevelTypesInternalV2GetLocalSystemUsageCriticalityLevelTypes(
            {
              organizationUuid,
            },
          );
      case 'it-system-usage_technical-system-type':
        return (organizationUuid) =>
          this.technicalSystemTypeService.getSingleItSystemLocalTechnicalSystemTypesInternalV2GetLocalTechnicalSystemTypes(
            {
              organizationUuid,
            },
          );

      //Data processing regular option types
      case 'data-processing-basis-for-transfer-types':
        return (organizationUuid) =>
          this.basisForTransferService.getSingleDprLocalBasisForTransferTypesInternalV2GetLocalBasisForTransferTypes({
            organizationUuid,
          });
      case 'data-processing-oversight-option-types':
        return (organizationUuid) =>
          this.oversightOptionService.getSingleDprLocalOversightOptionTypesInternalV2GetLocalOversightOptionTypes({
            organizationUuid,
          });
      case 'data-processing-data-responsible-types':
        return (organizationUuid) =>
          this.dataResponsibleService.getSingleDprLocalDataResponsibleTypesInternalV2GetLocalDataResponsibleTypes({
            organizationUuid,
          });
      case 'data-processing-country-types':
        return (organizationUuid) =>
          this.countryService.getSingleDprLocalCountryOptionTypesInternalV2GetLocalCountryOptionTypes({
            organizationUuid,
          });

      //It contract regular option types
      case 'it-contract_contract-type':
        return (organizationUuid) =>
          this.contractTypeService.getSingleItContractLocalContractTypesInternalV2GetLocalContractTypes({
            organizationUuid,
          });
      case 'it-contract_contract-template-type':
        return (organizationUuid) =>
          this.templateTypeService.getSingleItContractLocalTemplateTypesInternalV2GetLocalTemplateTypes({
            organizationUuid,
          });
      case 'it-contract_purchase-form-type':
        return (organizationUuid) =>
          this.purchaseFormTypeService.getSingleItContractLocalPurchaseFormTypesInternalV2GetLocalPurchaseFormTypes({
            organizationUuid,
          });
      case 'it-contract-payment-model-types':
        return (organizationUuid) =>
          this.paymentModelTypeService.getSingleItContractLocalPaymentModelTypesInternalV2GetLocalPaymentModelTypes({
            organizationUuid,
          });
      case 'it-contract-agreement-element-types':
        return (organizationUuid) =>
          this.agreementElementTypeService.getSingleItContractLocalAgreementElementTypesInternalV2GetLocalAgreementElementTypes(
            {
              organizationUuid,
            },
          );
      case 'it-contract-extend-types':
        return (organizationUuid) =>
          this.optionExtendTypeService.getSingleItContractLocalOptionExtendTypesInternalV2GetLocalOptionExtendTypes({
            organizationUuid,
          });
      case 'it-contract-payment-frequency-types':
        return (organizationUuid) =>
          this.paymentFrequencyTypeService.getSingleItContractLocalPaymentFrequencyTypesInternalV2GetLocalPaymentFrequencyTypes(
            {
              organizationUuid,
            },
          );
      case 'it-contract-price-regulation-types':
        return (organizationUuid) =>
          this.priceRegulationTypeService.getSingleItContractLocalPriceRegulationTypesInternalV2GetLocalPriceRegulationTypes(
            {
              organizationUuid,
            },
          );
      case 'it-contract_procurement-strategy-type':
        return (organizationUuid) =>
          this.procurementStrategyTypeService.getSingleItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypes(
            {
              organizationUuid,
            },
          );
      case 'it-contract-termination-period-types':
        return (organizationUuid) =>
          this.terminationDeadlineTypeService.getSingleItContractLocalTerminationDeadlineTypesInternalV2GetLocalTerminationDeadlineTypes(
            {
              organizationUuid,
            },
          );
      case 'it-contract_criticality-type':
        return (organizationUuid) =>
          this.criticalityTypeService.getSingleItContractLocalCriticalityTypesInternalV2GetLocalCriticalityTypes({
            organizationUuid,
          });
      //Role option types
      case 'organization-unit':
        return (organizationUuid) =>
          this.organiztionUnitRoleService.getSingleOrganizationUnitLocalRoleOptionTypesInternalV2GetLocalOrganizationUnitRoles(
            {
              organizationUuid,
            },
          );
      case 'it-system-usage':
        return (organizationUuid) =>
          this.itSystemRoleService.getSingleItSystemLocalRoleOptionTypesInternalV2GetLocalItSystemRoles({
            organizationUuid,
          });
      case 'it-contract':
        return (organizationUuid) =>
          this.itContractRoleService.getSingleItContractLocalRoleOptionTypesInternalV2GetLocalItContractRoles({
            organizationUuid,
          });
      case 'data-processing':
        return (organizationUuid) =>
          this.dprRoleService.getSingleDprLocalRoleOptionTypesInternalV2GetLocalDprRoles({
            organizationUuid,
          });
      default:
        throw new Error(`Get operation is not supported for ${optionType}`);
    }
  }

  private resolvePatchLocalOptionsEndpoint(optionType: LocalAdminOptionType) {
    switch (optionType) {
      //It system regular option types
      case 'it-system_business-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.businessTypeService.patchSingleItSystemLocalBusinessTypesInternalV2PatchLocalBusinessType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });
      case 'it-system_usage-archive-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.archiveTypeService.patchSingleItSystemLocalArchiveTypesInternalV2PatchLocalArchiveType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });
      case 'it-system_usage-archive-location-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.archiveLocationService.patchSingleItSystemLocalArchiveLocationTypesInternalV2PatchArchiveLocationType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });
      case 'it-system_usage-archive-location-test-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.archiveTestLocationService.patchSingleItSystemLocalArchiveTestLocationTypesInternalV2PatchLocalArchiveTestLocationType(
            {
              organizationUuid,
              optionUuid,
              aPILocalRegularOptionUpdateRequestDTO: request,
            },
          );
      case 'it-interface_data-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.dataTypeService.patchSingleItSystemLocalDataTypesInternalV2PatchLocalDataType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });
      case 'it-system_usage-relation-frequency-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.frequencyTypeService.patchSingleItSystemLocalFrequencyTypesInternalV2PatchLocalRelationFrequencyType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });
      case 'it-interface_interface-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.interfaceTypeService.patchSingleItSystemLocalInterfaceTypesInternalV2PatchLocalInterfaceType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.sensitivePersonalDataTypeService.patchSingleItSystemLocalSensitivePersonalDataTypesInternalV2PatchLocalSensitivePersonalDataType(
            {
              organizationUuid,
              optionUuid,
              aPILocalRegularOptionUpdateRequestDTO: request,
            },
          );
      case 'it-system_usage-data-classification-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.itSystemCategoryService.patchSingleItSystemLocalItSystemCategoriesTypesInternalV2PatchLocalItSystemCategoryType(
            {
              organizationUuid,
              optionUuid,
              aPILocalRegularOptionUpdateRequestDTO: request,
            },
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.registerTypeService.patchSingleItSystemLocalRegisterTypesInternalV2PatchLocalRegisterType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });

      case 'it-system-usage_system-usage-criticality-level':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.criticalityLevelService.patchSingleItSystemLocalSystemUsageCriticalityLevelTypesInternalV2PatchSystemUsageCriticalityLevelType(
            {
              organizationUuid,
              optionUuid,
              aPILocalRegularOptionUpdateRequestDTO: request,
            },
          );
      case 'it-system-usage_technical-system-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.technicalSystemTypeService.patchSingleItSystemLocalTechnicalSystemTypesInternalV2PatchTechnicalSystemType(
            {
              organizationUuid,
              optionUuid,
              aPILocalRegularOptionUpdateRequestDTO: request,
            },
          );

      //Data processing regular option types
      case 'data-processing-basis-for-transfer-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.basisForTransferService.patchSingleDprLocalBasisForTransferTypesInternalV2PatchLocalBasisForTransferType(
            {
              organizationUuid,
              optionUuid,
              aPILocalRegularOptionUpdateRequestDTO: request,
            },
          );
      case 'data-processing-oversight-option-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.oversightOptionService.patchSingleDprLocalOversightOptionTypesInternalV2PatchLocalOversightOptionType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });
      case 'data-processing-data-responsible-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.dataResponsibleService.patchSingleDprLocalDataResponsibleTypesInternalV2PatchLocalDataResponsibleType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });
      case 'data-processing-country-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.countryService.patchSingleDprLocalCountryOptionTypesInternalV2PatchLocalCountryOptionType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });

      //It contract regular option types
      case 'it-contract_contract-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.contractTypeService.patchSingleItContractLocalContractTypesInternalV2PatchLocalContractType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });
      case 'it-contract_contract-template-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.templateTypeService.patchSingleItContractLocalTemplateTypesInternalV2PatchLocalTemplateType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });
      case 'it-contract_purchase-form-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.purchaseFormTypeService.patchSingleItContractLocalPurchaseFormTypesInternalV2PatchLocalPurchaseFormType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });
      case 'it-contract-payment-model-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.paymentModelTypeService.patchSingleItContractLocalPaymentModelTypesInternalV2PatchLocalPaymentModelType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });
      case 'it-contract-agreement-element-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.agreementElementTypeService.patchSingleItContractLocalAgreementElementTypesInternalV2PatchLocalAgreementElementType(
            {
              organizationUuid,
              optionUuid,
              aPILocalRegularOptionUpdateRequestDTO: request,
            },
          );
      case 'it-contract-extend-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.optionExtendTypeService.patchSingleItContractLocalOptionExtendTypesInternalV2PatchLocalOptionExtendType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });
      case 'it-contract-payment-frequency-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.paymentFrequencyTypeService.patchSingleItContractLocalPaymentFrequencyTypesInternalV2PatchLocalPaymentFrequencyType(
            {
              organizationUuid,
              optionUuid,
              aPILocalRegularOptionUpdateRequestDTO: request,
            },
          );
      case 'it-contract-price-regulation-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.priceRegulationTypeService.patchSingleItContractLocalPriceRegulationTypesInternalV2PatchLocalPriceRegulationType(
            {
              organizationUuid,
              optionUuid,
              aPILocalRegularOptionUpdateRequestDTO: request,
            },
          );
      case 'it-contract_procurement-strategy-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.procurementStrategyTypeService.patchSingleItContractLocalProcurementStrategyTypesInternalV2PatchLocalProcurementStrategyType(
            {
              organizationUuid,
              optionUuid,
              aPILocalRegularOptionUpdateRequestDTO: request,
            },
          );
      case 'it-contract-termination-period-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.terminationDeadlineTypeService.patchSingleItContractLocalTerminationDeadlineTypesInternalV2PatchLocalTerminationDeadlineType(
            {
              organizationUuid,
              optionUuid,
              aPILocalRegularOptionUpdateRequestDTO: request,
            },
          );
      case 'it-contract_criticality-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.criticalityTypeService.patchSingleItContractLocalCriticalityTypesInternalV2PatchLocalCriticalityType({
            organizationUuid,
            optionUuid,
            aPILocalRegularOptionUpdateRequestDTO: request,
          });

      //Role option types
      case 'organization-unit':
        return (organizationUuid: string, optionUuid: string, request: APILocalRoleOptionUpdateRequestDTO) =>
          this.organiztionUnitRoleService.patchSingleOrganizationUnitLocalRoleOptionTypesInternalV2PatchLocalOrganizationUnitRole(
            {
              organizationUuid,
              optionUuid,
              aPILocalRoleOptionUpdateRequestDTO: request,
            },
          );
      case 'it-system-usage':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.itSystemRoleService.patchSingleItSystemLocalRoleOptionTypesInternalV2PatchLocalItSystemRole({
            organizationUuid,
            optionUuid,
            aPILocalRoleOptionUpdateRequestDTO: request,
          });

      case 'data-processing':
        return (organizationUuid: string, optionUuid: string, request: APILocalRoleOptionUpdateRequestDTO) =>
          this.dprRoleService.patchSingleDprLocalRoleOptionTypesInternalV2PatchLocalDprRole({
            organizationUuid,
            optionUuid,
            aPILocalRoleOptionUpdateRequestDTO: request,
          });

      case 'it-contract':
        return (organizationUuid: string, optionUuid: string, request: APILocalRoleOptionUpdateRequestDTO) =>
          this.itContractRoleService.patchSingleItContractLocalRoleOptionTypesInternalV2PatchLocalItContractRole({
            organizationUuid,
            optionUuid,
            aPILocalRoleOptionUpdateRequestDTO: request,
          });
      default:
        throw new Error(`Patch operation is not supported for ${optionType}`);
    }
  }

  private resolvePatchLocalRoleOptionsEndpoint(optionType: LocalAdminOptionType) {
    switch (optionType) {
      //Role option types
      case 'organization-unit':
        return (organizationUuid: string, optionUuid: string, request: APILocalRoleOptionUpdateRequestDTO) =>
          this.organiztionUnitRoleService.patchSingleOrganizationUnitLocalRoleOptionTypesInternalV2PatchLocalOrganizationUnitRole(
            {
              organizationUuid,
              optionUuid,
              aPILocalRoleOptionUpdateRequestDTO: request,
            },
          );
      case 'it-system-usage':
        return (organizationUuid: string, optionUuid: string, request: APILocalRoleOptionUpdateRequestDTO) =>
          this.itSystemRoleService.patchSingleItSystemLocalRoleOptionTypesInternalV2PatchLocalItSystemRole({
            organizationUuid,
            optionUuid,
            aPILocalRoleOptionUpdateRequestDTO: request,
          });

      case 'data-processing':
        return (organizationUuid: string, optionUuid: string, request: APILocalRoleOptionUpdateRequestDTO) =>
          this.dprRoleService.patchSingleDprLocalRoleOptionTypesInternalV2PatchLocalDprRole({
            organizationUuid,
            optionUuid,
            aPILocalRoleOptionUpdateRequestDTO: request,
          });

      case 'it-contract':
        return (organizationUuid: string, optionUuid: string, request: APILocalRoleOptionUpdateRequestDTO) =>
          this.itContractRoleService.patchSingleItContractLocalRoleOptionTypesInternalV2PatchLocalItContractRole({
            organizationUuid,
            optionUuid,
            aPILocalRoleOptionUpdateRequestDTO: request,
          });
      default:
        throw new Error(`Patch role operation is not supported for ${optionType}`);
    }
  }

  private resolveCreateLocalOptionsEndpoint(
    optionType: LocalAdminOptionType,
  ): (organizationUuid: string, optionUuid: string) => Observable<APILocalRoleOptionResponseDTO> {
    switch (optionType) {
      //It system regular option types
      case 'it-system_business-type':
        return (organizationUuid, optionUuid) =>
          this.businessTypeService.postSingleItSystemLocalBusinessTypesInternalV2CreateLocalBusinessType({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });
      case 'it-system_usage-archive-type':
        return (organizationUuid, optionUuid) =>
          this.archiveTypeService.postSingleItSystemLocalArchiveTypesInternalV2CreateLocalArchiveType({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });
      case 'it-system_usage-archive-location-type':
        return (organizationUuid, optionUuid) =>
          this.archiveLocationService.postSingleItSystemLocalArchiveLocationTypesInternalV2CreateArchiveLocationType({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });
      case 'it-system_usage-archive-location-test-type':
        return (organizationUuid, optionUuid) =>
          this.archiveTestLocationService.postSingleItSystemLocalArchiveTestLocationTypesInternalV2CreateLocalArchiveTestLocationType(
            {
              organizationUuid,
              aPILocalOptionCreateRequestDTO: { optionUuid },
            },
          );
      case 'it-interface_data-type':
        return (organizationUuid, optionUuid) =>
          this.dataTypeService.postSingleItSystemLocalDataTypesInternalV2CreateLocalDataType({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });
      case 'it-system_usage-relation-frequency-type':
        return (organizationUuid, optionUuid) =>
          this.frequencyTypeService.postSingleItSystemLocalFrequencyTypesInternalV2CreateLocalRelationFrequencyType({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });
      case 'it-interface_interface-type':
        return (organizationUuid, optionUuid) =>
          this.interfaceTypeService.postSingleItSystemLocalInterfaceTypesInternalV2CreateLocalInterfaceType({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (organizationUuid, optionUuid) =>
          this.sensitivePersonalDataTypeService.postSingleItSystemLocalSensitivePersonalDataTypesInternalV2CreateLocalSensitivePersonalDataType(
            {
              organizationUuid,
              aPILocalOptionCreateRequestDTO: { optionUuid },
            },
          );
      case 'it-system_usage-data-classification-type':
        return (organizationUuid, optionUuid) =>
          this.itSystemCategoryService.postSingleItSystemLocalItSystemCategoriesTypesInternalV2CreateLocalItSystemCategoryType(
            {
              organizationUuid,
              aPILocalOptionCreateRequestDTO: { optionUuid },
            },
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (organizationUuid, optionUuid) =>
          this.registerTypeService.postSingleItSystemLocalRegisterTypesInternalV2CreateLocalRegisterType({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });
      case 'it-system-usage_system-usage-criticality-level':
        return (organizationUuid, optionUuid) =>
          this.criticalityLevelService.postSingleItSystemLocalSystemUsageCriticalityLevelTypesInternalV2CreateSystemUsageCriticalityLevelType(
            {
              organizationUuid,
              aPILocalOptionCreateRequestDTO: { optionUuid },
            },
          );
      case 'it-system-usage_technical-system-type':
        return (organizationUuid, optionUuid) =>
          this.technicalSystemTypeService.postSingleItSystemLocalTechnicalSystemTypesInternalV2CreateTechnicalSystemType(
            {
              organizationUuid,
              aPILocalOptionCreateRequestDTO: { optionUuid },
            },
          );

      //Data processing regular option types
      case 'data-processing-basis-for-transfer-types':
        return (organizationUuid, optionUuid) =>
          this.basisForTransferService.postSingleDprLocalBasisForTransferTypesInternalV2CreateLocalBasisForTransferType(
            {
              organizationUuid,
              aPILocalOptionCreateRequestDTO: { optionUuid },
            },
          );
      case 'data-processing-oversight-option-types':
        return (organizationUuid, optionUuid) =>
          this.oversightOptionService.postSingleDprLocalOversightOptionTypesInternalV2CreateLocalOversightOptionType({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });
      case 'data-processing-data-responsible-types':
        return (organizationUuid, optionUuid) =>
          this.dataResponsibleService.postSingleDprLocalDataResponsibleTypesInternalV2CreateLocalDataResponsibleType({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });
      case 'data-processing-country-types':
        return (organizationUuid, optionUuid) =>
          this.countryService.postSingleDprLocalCountryOptionTypesInternalV2CreateLocalCountryOptionType({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });

      //It contract regular option types
      case 'it-contract_contract-type':
        return (organizationUuid, optionUuid) =>
          this.contractTypeService.postSingleItContractLocalContractTypesInternalV2CreateLocalContractType({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });
      case 'it-contract_contract-template-type':
        return (organizationUuid, optionUuid) =>
          this.templateTypeService.postSingleItContractLocalTemplateTypesInternalV2CreateLocalTemplateType({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });
      case 'it-contract_purchase-form-type':
        return (organizationUuid, optionUuid) =>
          this.purchaseFormTypeService.postSingleItContractLocalPurchaseFormTypesInternalV2CreateLocalResultPurchaseFormType(
            {
              organizationUuid,
              aPILocalOptionCreateRequestDTO: { optionUuid },
            },
          );
      case 'it-contract-payment-model-types':
        return (organizationUuid, optionUuid) =>
          this.paymentModelTypeService.postSingleItContractLocalPaymentModelTypesInternalV2CreateLocalPaymentModelType({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });
      case 'it-contract-agreement-element-types':
        return (organizationUuid, optionUuid) =>
          this.agreementElementTypeService.postSingleItContractLocalAgreementElementTypesInternalV2CreateLocalAgreementElementType(
            {
              organizationUuid,
              aPILocalOptionCreateRequestDTO: { optionUuid },
            },
          );
      case 'it-contract-extend-types':
        return (organizationUuid, optionUuid) =>
          this.optionExtendTypeService.postSingleItContractLocalOptionExtendTypesInternalV2CreateLocalOptionExtendType({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });
      case 'it-contract-payment-frequency-types':
        return (organizationUuid, optionUuid) =>
          this.paymentFrequencyTypeService.postSingleItContractLocalPaymentFrequencyTypesInternalV2CreateLocalPaymentFrequencyType(
            {
              organizationUuid,
              aPILocalOptionCreateRequestDTO: { optionUuid },
            },
          );
      case 'it-contract-price-regulation-types':
        return (organizationUuid, optionUuid) =>
          this.priceRegulationTypeService.postSingleItContractLocalPriceRegulationTypesInternalV2CreateLocalPriceRegulationType(
            {
              organizationUuid,
              aPILocalOptionCreateRequestDTO: { optionUuid },
            },
          );
      case 'it-contract_procurement-strategy-type':
        return (organizationUuid, optionUuid) =>
          this.procurementStrategyTypeService.postSingleItContractLocalProcurementStrategyTypesInternalV2CreateLocalProcurementStrategyType(
            {
              organizationUuid,
              aPILocalOptionCreateRequestDTO: { optionUuid },
            },
          );
      case 'it-contract-termination-period-types':
        return (organizationUuid, optionUuid) =>
          this.terminationDeadlineTypeService.postSingleItContractLocalTerminationDeadlineTypesInternalV2CreateLocalTerminationDeadlineType(
            {
              organizationUuid,
              aPILocalOptionCreateRequestDTO: { optionUuid },
            },
          );
      case 'it-contract_criticality-type':
        return (organizationUuid, optionUuid) =>
          this.criticalityTypeService.postSingleItContractLocalCriticalityTypesInternalV2CreateLocalCriticalityType({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });

      //Role option types
      case 'organization-unit':
        return (organizationUuid, optionUuid) =>
          this.organiztionUnitRoleService.postSingleOrganizationUnitLocalRoleOptionTypesInternalV2CreateLocalOrganizationUnitRole(
            {
              organizationUuid,
              aPILocalOptionCreateRequestDTO: { optionUuid },
            },
          );
      case 'it-system-usage':
        return (organizationUuid, optionUuid) =>
          this.itSystemRoleService.postSingleItSystemLocalRoleOptionTypesInternalV2CreateLocalItSystemRole({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });

      case 'data-processing':
        return (organizationUuid, optionUuid) =>
          this.dprRoleService.postSingleDprLocalRoleOptionTypesInternalV2CreateLocalDprRole({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });

      case 'it-contract':
        return (organizationUuid, optionUuid) =>
          this.itContractRoleService.postSingleItContractLocalRoleOptionTypesInternalV2CreateLocalItContractRole({
            organizationUuid,
            aPILocalOptionCreateRequestDTO: { optionUuid },
          });
      default:
        throw new Error(`Create operation is not supported for ${optionType}`);
    }
  }

  private resolveDeleteLocalOptionsEndpoint(
    optionType: LocalAdminOptionType,
  ): (organizationUuid: string, optionUuid: string) => Observable<APILocalRoleOptionResponseDTO> {
    switch (optionType) {
      //It system regular option types
      case 'it-system_business-type':
        return (organizationUuid, optionUuid) =>
          this.businessTypeService.deleteSingleItSystemLocalBusinessTypesInternalV2DeleteLocalBusinessType({
            organizationUuid,
            optionUuid,
          });
      case 'it-system_usage-archive-type':
        return (organizationUuid, optionUuid) =>
          this.archiveTypeService.deleteSingleItSystemLocalArchiveTypesInternalV2DeleteLocalArchiveType({
            organizationUuid,
            optionUuid,
          });
      case 'it-system_usage-archive-location-type':
        return (organizationUuid, optionUuid) =>
          this.archiveLocationService.deleteSingleItSystemLocalArchiveLocationTypesInternalV2DeleteArchiveLocationType({
            organizationUuid,
            optionUuid,
          });
      case 'it-system_usage-archive-location-test-type':
        return (organizationUuid, optionUuid) =>
          this.archiveTestLocationService.deleteSingleItSystemLocalArchiveTestLocationTypesInternalV2DeleteLocalArchiveTestLocationType(
            {
              organizationUuid,
              optionUuid,
            },
          );
      case 'it-interface_data-type':
        return (organizationUuid, optionUuid) =>
          this.dataTypeService.deleteSingleItSystemLocalDataTypesInternalV2DeleteLocalDataType({
            organizationUuid,
            optionUuid,
          });
      case 'it-system_usage-relation-frequency-type':
        return (organizationUuid, optionUuid) =>
          this.frequencyTypeService.deleteSingleItSystemLocalFrequencyTypesInternalV2DeleteLocalRelationFrequencyType({
            organizationUuid,
            optionUuid,
          });
      case 'it-interface_interface-type':
        return (organizationUuid, optionUuid) =>
          this.interfaceTypeService.deleteSingleItSystemLocalInterfaceTypesInternalV2DeleteLocalInterfaceType({
            organizationUuid,
            optionUuid,
          });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (organizationUuid, optionUuid) =>
          this.sensitivePersonalDataTypeService.deleteSingleItSystemLocalSensitivePersonalDataTypesInternalV2DeleteLocalSensitivePersonalDataType(
            {
              organizationUuid,
              optionUuid,
            },
          );
      case 'it-system_usage-data-classification-type':
        return (organizationUuid, optionUuid) =>
          this.itSystemCategoryService.deleteSingleItSystemLocalItSystemCategoriesTypesInternalV2DeleteLocalItSystemCategoryType(
            {
              organizationUuid,
              optionUuid,
            },
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (organizationUuid, optionUuid) =>
          this.registerTypeService.deleteSingleItSystemLocalRegisterTypesInternalV2DeleteLocalRegisterType({
            organizationUuid,
            optionUuid,
          });

      case 'it-system-usage_system-usage-criticality-level':
        return (organizationUuid, optionUuid) =>
          this.criticalityLevelService.deleteSingleItSystemLocalSystemUsageCriticalityLevelTypesInternalV2DeleteSystemUsageCriticalityLevelType(
            {
              organizationUuid,
              optionUuid,
            },
          );
      case 'it-system-usage_technical-system-type':
        return (organizationUuid, optionUuid) =>
          this.technicalSystemTypeService.deleteSingleItSystemLocalTechnicalSystemTypesInternalV2DeleteTechnicalSystemType(
            {
              organizationUuid,
              optionUuid,
            },
          );

      //Data processing regular option types
      case 'data-processing-basis-for-transfer-types':
        return (organizationUuid, optionUuid) =>
          this.basisForTransferService.deleteSingleDprLocalBasisForTransferTypesInternalV2DeleteLocalBasisForTransferType(
            {
              organizationUuid,
              optionUuid,
            },
          );
      case 'data-processing-oversight-option-types':
        return (organizationUuid, optionUuid) =>
          this.oversightOptionService.deleteSingleDprLocalOversightOptionTypesInternalV2DeleteLocalOversightOptionType({
            organizationUuid,
            optionUuid,
          });
      case 'data-processing-data-responsible-types':
        return (organizationUuid, optionUuid) =>
          this.dataResponsibleService.deleteSingleDprLocalDataResponsibleTypesInternalV2DeleteLocalDataResponsibleType({
            organizationUuid,
            optionUuid,
          });
      case 'data-processing-country-types':
        return (organizationUuid, optionUuid) =>
          this.countryService.deleteSingleDprLocalCountryOptionTypesInternalV2DeleteLocalCountryOptionType({
            organizationUuid,
            optionUuid,
          });

      //It contract regular option types
      case 'it-contract_contract-type':
        return (organizationUuid, optionUuid) =>
          this.contractTypeService.deleteSingleItContractLocalContractTypesInternalV2DeleteLocalContractType({
            organizationUuid,
            optionUuid,
          });
      case 'it-contract_contract-template-type':
        return (organizationUuid, optionUuid) =>
          this.templateTypeService.deleteSingleItContractLocalTemplateTypesInternalV2DeleteLocalTemplateType({
            organizationUuid,
            optionUuid,
          });
      case 'it-contract_purchase-form-type':
        return (organizationUuid, optionUuid) =>
          this.purchaseFormTypeService.deleteSingleItContractLocalPurchaseFormTypesInternalV2DeleteLocalPurchaseFormType(
            {
              organizationUuid,
              optionUuid,
            },
          );
      case 'it-contract-payment-model-types':
        return (organizationUuid, optionUuid) =>
          this.paymentModelTypeService.deleteSingleItContractLocalPaymentModelTypesInternalV2DeleteLocalPaymentModelType(
            {
              organizationUuid,
              optionUuid,
            },
          );
      case 'it-contract-agreement-element-types':
        return (organizationUuid, optionUuid) =>
          this.agreementElementTypeService.deleteSingleItContractLocalAgreementElementTypesInternalV2DeleteLocalAgreementElementType(
            {
              organizationUuid,
              optionUuid,
            },
          );
      case 'it-contract-extend-types':
        return (organizationUuid, optionUuid) =>
          this.optionExtendTypeService.deleteSingleItContractLocalOptionExtendTypesInternalV2DeleteLocalOptionExtendType(
            {
              organizationUuid,
              optionUuid,
            },
          );
      case 'it-contract-payment-frequency-types':
        return (organizationUuid, optionUuid) =>
          this.paymentFrequencyTypeService.deleteSingleItContractLocalPaymentFrequencyTypesInternalV2DeleteLocalPaymentFrequencyType(
            {
              organizationUuid,
              optionUuid,
            },
          );
      case 'it-contract-price-regulation-types':
        return (organizationUuid, optionUuid) =>
          this.priceRegulationTypeService.deleteSingleItContractLocalPriceRegulationTypesInternalV2DeleteLocalPriceRegulationType(
            {
              organizationUuid,
              optionUuid,
            },
          );
      case 'it-contract_procurement-strategy-type':
        return (organizationUuid, optionUuid) =>
          this.procurementStrategyTypeService.deleteSingleItContractLocalProcurementStrategyTypesInternalV2DeleteLocalProcurementStrategyType(
            {
              organizationUuid,
              optionUuid,
            },
          );
      case 'it-contract-termination-period-types':
        return (organizationUuid, optionUuid) =>
          this.terminationDeadlineTypeService.deleteSingleItContractLocalTerminationDeadlineTypesInternalV2DeleteLocalTerminationDeadlineType(
            {
              organizationUuid,
              optionUuid,
            },
          );
      case 'it-contract_criticality-type':
        return (organizationUuid, optionUuid) =>
          this.criticalityTypeService.deleteSingleItContractLocalCriticalityTypesInternalV2DeleteLocalCriticalityType({
            organizationUuid,
            optionUuid,
          });

      //Role option types
      case 'organization-unit':
        return (organizationUuid, optionUuid) =>
          this.organiztionUnitRoleService.deleteSingleOrganizationUnitLocalRoleOptionTypesInternalV2DeleteLocalOrganizationUnitRole(
            {
              organizationUuid,
              optionUuid,
            },
          );
      case 'it-system-usage':
        return (organizationUuid, optionUuid) =>
          this.itSystemRoleService.deleteSingleItSystemLocalRoleOptionTypesInternalV2DeleteLocalItSystemRole({
            organizationUuid,
            optionUuid,
          });

      case 'data-processing':
        return (organizationUuid, optionUuid) =>
          this.dprRoleService.deleteSingleDprLocalRoleOptionTypesInternalV2DeleteLocalDprRole({
            organizationUuid,
            optionUuid,
          });

      case 'it-contract':
        return (organizationUuid, optionUuid) =>
          this.itContractRoleService.deleteSingleItContractLocalRoleOptionTypesInternalV2DeleteLocalItContractRole({
            organizationUuid,
            optionUuid,
          });
      default:
        throw new Error(`Delete operation is not supported for ${optionType}`);
    }
  }
}

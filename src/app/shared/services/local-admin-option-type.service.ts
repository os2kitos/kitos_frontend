import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  APILocalRegularOptionResponseDTO,
  APILocalRegularOptionUpdateRequestDTO,
  APILocalRoleOptionResponseDTO,
  APIV2DprLocalBasisForTransferTypesInternalINTERNALService,
  APIV2DprLocalCountryOptionTypesInternalINTERNALService,
  APIV2DprLocalDataResponsibleTypesInternalINTERNALService,
  APIV2DprLocalOversightOptionTypesInternalINTERNALService,
  APIV2DprLocalRoleOptionTypesInternalINTERNALService,
  APIV2ItContractLocalAgreementElementTypesInternalINTERNALService,
  APIV2ItContractLocalContractTypesInternalINTERNALService,
  APIV2ItContractLocalCriticalityTypesInternalINTERNALService,
  APIV2ItContractLocalOptionExtendTypesInternalINTERNALService,
  APIV2ItContractLocalPaymentFrequencyTypesInternalINTERNALService,
  APIV2ItContractLocalPaymentModelTypesInternalINTERNALService,
  APIV2ItContractLocalPriceRegulationTypesInternalINTERNALService,
  APIV2ItContractLocalProcurementStrategyTypesInternalINTERNALService,
  APIV2ItContractLocalPurchaseFormTypesInternalINTERNALService,
  APIV2ItContractLocalRoleOptionTypesInternalINTERNALService,
  APIV2ItContractLocalTemplateTypesInternalINTERNALService,
  APIV2ItContractLocalTerminationDeadlineTypesInternalINTERNALService,
  APIV2ItSystemLocalArchiveLocationTypesInternalINTERNALService,
  APIV2ItSystemLocalArchiveTestLocationTypesInternalINTERNALService,
  APIV2ItSystemLocalArchiveTypesInternalINTERNALService,
  APIV2ItSystemLocalBusinessTypesInternalINTERNALService,
  APIV2ItSystemLocalDataTypesInternalINTERNALService,
  APIV2ItSystemLocalFrequencyTypesInternalINTERNALService,
  APIV2ItSystemLocalInterfaceTypesInternalINTERNALService,
  APIV2ItSystemLocalItSystemCategoriesTypesInternalINTERNALService,
  APIV2ItSystemLocalRegisterTypesInternalINTERNALService,
  APIV2ItSystemLocalRoleOptionTypesInternalINTERNALService,
  APIV2ItSystemLocalSensitivePersonalDataTypesInternalINTERNALService,
  APIV2OrganizationUnitLocalRoleOptionTypesInternalINTERNALService,
} from 'src/app/api/v2';
import { LocalAdminOptionType } from '../models/options/local-admin-option-type.model';

@Injectable({
  providedIn: 'root',
})
export class LocalAdminOptionTypeService implements OnDestroy {
  public subscriptions = new Subscription();

  constructor(
    //It system regular option type services
    @Inject(APIV2ItSystemLocalBusinessTypesInternalINTERNALService)
    private businessTypeService: APIV2ItSystemLocalBusinessTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalArchiveTypesInternalINTERNALService)
    private archiveTypeService: APIV2ItSystemLocalArchiveTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalArchiveLocationTypesInternalINTERNALService)
    private archiveLocationService: APIV2ItSystemLocalArchiveLocationTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalArchiveTestLocationTypesInternalINTERNALService)
    private archiveTestLocationService: APIV2ItSystemLocalArchiveTestLocationTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalDataTypesInternalINTERNALService)
    private dataTypeService: APIV2ItSystemLocalDataTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalFrequencyTypesInternalINTERNALService)
    private frequencyTypeService: APIV2ItSystemLocalFrequencyTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalInterfaceTypesInternalINTERNALService)
    private interfaceTypeService: APIV2ItSystemLocalInterfaceTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalSensitivePersonalDataTypesInternalINTERNALService)
    private sensitivePersonalDataTypeService: APIV2ItSystemLocalSensitivePersonalDataTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalItSystemCategoriesTypesInternalINTERNALService)
    private itSystemCategoryService: APIV2ItSystemLocalItSystemCategoriesTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalRegisterTypesInternalINTERNALService)
    private registerTypeService: APIV2ItSystemLocalRegisterTypesInternalINTERNALService,
    @Inject(APIV2OrganizationUnitLocalRoleOptionTypesInternalINTERNALService)
    //It contract regular option services
    @Inject(APIV2ItContractLocalContractTypesInternalINTERNALService)
    private contractTypeService: APIV2ItContractLocalContractTypesInternalINTERNALService,
    @Inject(APIV2ItContractLocalTemplateTypesInternalINTERNALService)
    private templateTypeService: APIV2ItContractLocalTemplateTypesInternalINTERNALService,
    @Inject(APIV2ItContractLocalPurchaseFormTypesInternalINTERNALService)
    private purchaseFormTypeService: APIV2ItContractLocalPurchaseFormTypesInternalINTERNALService,
    @Inject(APIV2ItContractLocalPaymentModelTypesInternalINTERNALService)
    private paymentModelTypeService: APIV2ItContractLocalPaymentModelTypesInternalINTERNALService,
    @Inject(APIV2ItContractLocalAgreementElementTypesInternalINTERNALService)
    private agreementElementTypeService: APIV2ItContractLocalAgreementElementTypesInternalINTERNALService,
    @Inject(APIV2ItContractLocalOptionExtendTypesInternalINTERNALService)
    private optionExtendTypeService: APIV2ItContractLocalOptionExtendTypesInternalINTERNALService,
    @Inject(APIV2ItContractLocalPaymentFrequencyTypesInternalINTERNALService)
    private paymentFrequencyTypeService: APIV2ItContractLocalPaymentFrequencyTypesInternalINTERNALService,
    @Inject(APIV2ItContractLocalPriceRegulationTypesInternalINTERNALService)
    private priceRegulationTypeService: APIV2ItContractLocalPriceRegulationTypesInternalINTERNALService,
    @Inject(APIV2ItContractLocalProcurementStrategyTypesInternalINTERNALService)
    private procurementStrategyTypeService: APIV2ItContractLocalProcurementStrategyTypesInternalINTERNALService,
    @Inject(APIV2ItContractLocalTerminationDeadlineTypesInternalINTERNALService)
    private terminationDeadlineTypeService: APIV2ItContractLocalTerminationDeadlineTypesInternalINTERNALService,
    @Inject(APIV2ItContractLocalCriticalityTypesInternalINTERNALService)
    private criticalityTypeService: APIV2ItContractLocalCriticalityTypesInternalINTERNALService,

    //Data processing regular option type services
    @Inject(APIV2DprLocalBasisForTransferTypesInternalINTERNALService)
    private basisForTransferService: APIV2DprLocalBasisForTransferTypesInternalINTERNALService,
    @Inject(APIV2DprLocalOversightOptionTypesInternalINTERNALService)
    private oversightOptionService: APIV2DprLocalOversightOptionTypesInternalINTERNALService,
    @Inject(APIV2DprLocalDataResponsibleTypesInternalINTERNALService)
    private dataResponsibleService: APIV2DprLocalDataResponsibleTypesInternalINTERNALService,
    @Inject(APIV2DprLocalCountryOptionTypesInternalINTERNALService)
    private countryService: APIV2DprLocalCountryOptionTypesInternalINTERNALService,

    //Role option type services
    @Inject(APIV2OrganizationUnitLocalRoleOptionTypesInternalINTERNALService)
    private organiztionUnitRoleService: APIV2OrganizationUnitLocalRoleOptionTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalRoleOptionTypesInternalINTERNALService)
    private itSystemRoleService: APIV2ItSystemLocalRoleOptionTypesInternalINTERNALService,
    @Inject(APIV2ItContractLocalRoleOptionTypesInternalINTERNALService)
    private itContractRoleService: APIV2ItContractLocalRoleOptionTypesInternalINTERNALService,
    @Inject(APIV2DprLocalRoleOptionTypesInternalINTERNALService)
    private dprRoleService: APIV2DprLocalRoleOptionTypesInternalINTERNALService
  ) {}

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public getLocalOptions(
    organizationUuid: string,
    optionType: LocalAdminOptionType
  ): Observable<Array<APILocalRegularOptionResponseDTO>> {
    return this.resolveGetLocalOptionsEndpoint(optionType)(organizationUuid);
  }

  public patchLocalOption(
    optionType: LocalAdminOptionType,
    organizationUuid: string,
    optionUuid: string,
    request: APILocalRegularOptionUpdateRequestDTO
  ) {
    return this.resolvePatchLocalOptionsEndpoint(optionType)(organizationUuid, optionUuid, request);
  }

  public patchIsActive(
    optionType: LocalAdminOptionType,
    organizationUuid: string,
    optionUuid: string,
    isActive: boolean
  ) {
    if (isActive) {
      return this.resolveCreateLocalOptionsEndpoint(optionType)(organizationUuid, optionUuid);
    } else {
      return this.resolveDeleteLocalOptionsEndpoint(optionType)(organizationUuid, optionUuid);
    }
  }

  private resolveGetLocalOptionsEndpoint(
    optionType: LocalAdminOptionType
  ): (organizationUuid: string) => Observable<Array<APILocalRoleOptionResponseDTO>> {
    switch (optionType) {
      //It system regular option types
      case 'it-system_business-type':
        return (organizationUuid) =>
          this.businessTypeService.getManyItSystemLocalBusinessTypesInternalV2GetLocalBusinessTypes({
            organizationUuid,
          });
      case 'it-system_usage-archive-type':
        return (organizationUuid) =>
          this.archiveTypeService.getManyItSystemLocalArchiveTypesInternalV2GetLocalArchiveTypes({
            organizationUuid,
          });
      case 'it-system_usage-archive-location-type':
        return (organizationUuid) =>
          this.archiveLocationService.getManyItSystemLocalArchiveLocationTypesInternalV2GetLocalArchiveLocationTypes({
            organizationUuid,
          });
      case 'it-system_usage-archive-location-test-type':
        return (organizationUuid) =>
          this.archiveTestLocationService.getManyItSystemLocalArchiveTestLocationTypesInternalV2GetLocalArchiveTestLocationTypes(
            {
              organizationUuid,
            }
          );
      case 'it-interface_data-type':
        return (organizationUuid) =>
          this.dataTypeService.getManyItSystemLocalDataTypesInternalV2GetLocalDataTypes({
            organizationUuid,
          });
      case 'it-system_usage-relation-frequency-type':
        return (organizationUuid) =>
          this.frequencyTypeService.getManyItSystemLocalFrequencyTypesInternalV2GetLocalRelationFrequencyTypes({
            organizationUuid,
          });
      case 'it-interface_interface-type':
        return (organizationUuid) =>
          this.interfaceTypeService.getManyItSystemLocalInterfaceTypesInternalV2GetLocalInterfaceTypes({
            organizationUuid,
          });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (organizationUuid) =>
          this.sensitivePersonalDataTypeService.getManyItSystemLocalSensitivePersonalDataTypesInternalV2GetLocalSensitivePersonalDataTypes(
            {
              organizationUuid,
            }
          );
      case 'it-system_usage-data-classification-type':
        return (organizationUuid) =>
          this.itSystemCategoryService.getManyItSystemLocalItSystemCategoriesTypesInternalV2GetLocalItSystemCategoryTypes(
            {
              organizationUuid,
            }
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (organizationUuid) =>
          this.registerTypeService.getManyItSystemLocalRegisterTypesInternalV2GetLocalRegisterTypes({
            organizationUuid,
          });

      //Data processing regular option types
      case 'data-processing-basis-for-transfer-types':
        return (organizationUuid) =>
          this.basisForTransferService.getManyDprLocalBasisForTransferTypesInternalV2GetLocalBasisForTransferTypes({
            organizationUuid,
          });
      case 'data-processing-oversight-option-types':
        return (organizationUuid) =>
          this.oversightOptionService.getManyDprLocalOversightOptionTypesInternalV2GetLocalOversightOptionTypes({
            organizationUuid,
          });
      case 'data-processing-data-responsible-types':
        return (organizationUuid) =>
          this.dataResponsibleService.getManyDprLocalDataResponsibleTypesInternalV2GetLocalDataResponsibleTypes({
            organizationUuid,
          });
      case 'data-processing-country-types':
        return (organizationUuid) =>
          this.countryService.getManyDprLocalCountryOptionTypesInternalV2GetLocalCountryOptionTypes({
            organizationUuid,
          });

      //It contract regular option types
      case 'it-contract_contract-type':
        return (organizationUuid) =>
          this.contractTypeService.getManyItContractLocalContractTypesInternalV2GetLocalContractTypes({
            organizationUuid,
          });
      case 'it-contract_contract-template-type':
        return (organizationUuid) =>
          this.templateTypeService.getManyItContractLocalTemplateTypesInternalV2GetLocalTemplateTypes({
            organizationUuid,
          });
      case 'it-contract_purchase-form-type':
        return (organizationUuid) =>
          this.purchaseFormTypeService.getManyItContractLocalPurchaseFormTypesInternalV2GetLocalPurchaseFormTypes({
            organizationUuid,
          });
      case 'it-contract-payment-model-types':
        return (organizationUuid) =>
          this.paymentModelTypeService.getManyItContractLocalPaymentModelTypesInternalV2GetLocalPaymentModelTypes({
            organizationUuid,
          });
      case 'it-contract-agreement-element-types':
        return (organizationUuid) =>
          this.agreementElementTypeService.getManyItContractLocalAgreementElementTypesInternalV2GetLocalAgreementElementTypes(
            {
              organizationUuid,
            }
          );
      case 'it-contract-extend-types':
        return (organizationUuid) =>
          this.optionExtendTypeService.getManyItContractLocalOptionExtendTypesInternalV2GetLocalOptionExtendTypes({
            organizationUuid,
          });
      case 'it-contract-payment-frequency-types':
        return (organizationUuid) =>
          this.paymentFrequencyTypeService.getManyItContractLocalPaymentFrequencyTypesInternalV2GetLocalPaymentFrequencyTypes(
            {
              organizationUuid,
            }
          );
      case 'it-contract-price-regulation-types':
        return (organizationUuid) =>
          this.priceRegulationTypeService.getManyItContractLocalPriceRegulationTypesInternalV2GetLocalPriceRegulationTypes(
            {
              organizationUuid,
            }
          );
      case 'it-contract_procurement-strategy-type':
        return (organizationUuid) =>
          this.procurementStrategyTypeService.getManyItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypes(
            {
              organizationUuid,
            }
          );
      case 'it-contract-termination-period-types':
        return (organizationUuid) =>
          this.terminationDeadlineTypeService.getManyItContractLocalTerminationDeadlineTypesInternalV2GetLocalTerminationDeadlineTypes(
            {
              organizationUuid,
            }
          );
      case 'it-contract_criticality-type':
        return (organizationUuid) =>
          this.criticalityTypeService.getManyItContractLocalCriticalityTypesInternalV2GetLocalCriticalityTypes({
            organizationUuid,
          });
      //Role option types
      case 'organization-unit':
        return (organizationUuid) =>
          this.organiztionUnitRoleService.getManyOrganizationUnitLocalRoleOptionTypesInternalV2GetLocalOrganizationUnitRoles(
            {
              organizationUuid,
            }
          );
      case 'it-system-usage':
        return (organizationUuid) =>
          this.itSystemRoleService.getManyItSystemLocalRoleOptionTypesInternalV2GetLocalItSystemRoles({
            organizationUuid,
          });
      case 'it-contract':
        return (organizationUuid) =>
          this.itContractRoleService.getManyItContractLocalRoleOptionTypesInternalV2GetLocalItContractRoles({
            organizationUuid,
          });
      case 'data-processing':
        return (organizationUuid) =>
          this.dprRoleService.getManyDprLocalRoleOptionTypesInternalV2GetLocalDprRoles({
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
            dto: request,
          });
      case 'it-system_usage-archive-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.archiveTypeService.patchSingleItSystemLocalArchiveTypesInternalV2PatchLocalArchiveType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it-system_usage-archive-location-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.archiveLocationService.patchSingleItSystemLocalArchiveLocationTypesInternalV2PatchArchiveLocationType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it-system_usage-archive-location-test-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.archiveTestLocationService.patchSingleItSystemLocalArchiveTestLocationTypesInternalV2PatchLocalArchiveTestLocationType(
            {
              organizationUuid,
              optionUuid,
              dto: request,
            }
          );
      case 'it-interface_data-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.dataTypeService.patchSingleItSystemLocalDataTypesInternalV2PatchLocalDataType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it-system_usage-relation-frequency-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.frequencyTypeService.patchSingleItSystemLocalFrequencyTypesInternalV2PatchLocalRelationFrequencyType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it-interface_interface-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.interfaceTypeService.patchSingleItSystemLocalInterfaceTypesInternalV2PatchLocalInterfaceType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.sensitivePersonalDataTypeService.patchSingleItSystemLocalSensitivePersonalDataTypesInternalV2PatchLocalSensitivePersonalDataType(
            {
              organizationUuid,
              optionUuid,
              dto: request,
            }
          );
      case 'it-system_usage-data-classification-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.itSystemCategoryService.patchSingleItSystemLocalItSystemCategoriesTypesInternalV2PatchLocalItSystemCategoryType(
            {
              organizationUuid,
              optionUuid,
              dto: request,
            }
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.registerTypeService.patchSingleItSystemLocalRegisterTypesInternalV2PatchLocalRegisterType({
            organizationUuid,
            optionUuid,
            dto: request,
          });

      //Data processing regular option types
      case 'data-processing-basis-for-transfer-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.basisForTransferService.patchSingleDprLocalBasisForTransferTypesInternalV2PatchLocalBasisForTransferType(
            {
              organizationUuid,
              optionUuid,
              dto: request,
            }
          );
      case 'data-processing-oversight-option-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.oversightOptionService.patchSingleDprLocalOversightOptionTypesInternalV2PatchLocalOversightOptionType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'data-processing-data-responsible-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.dataResponsibleService.patchSingleDprLocalDataResponsibleTypesInternalV2PatchLocalDataResponsibleType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'data-processing-country-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.countryService.patchSingleDprLocalCountryOptionTypesInternalV2PatchLocalCountryOptionType({
            organizationUuid,
            optionUuid,
            dto: request,
          });

      //It contract regular option types
      case 'it-contract_contract-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.contractTypeService.patchSingleItContractLocalContractTypesInternalV2PatchLocalContractType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it-contract_contract-template-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.templateTypeService.patchSingleItContractLocalTemplateTypesInternalV2PatchLocalTemplateType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it-contract_purchase-form-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.purchaseFormTypeService.patchSingleItContractLocalPurchaseFormTypesInternalV2PatchLocalPurchaseFormType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it-contract-payment-model-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.paymentModelTypeService.patchSingleItContractLocalPaymentModelTypesInternalV2PatchLocalPaymentModelType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it-contract-agreement-element-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.agreementElementTypeService.patchSingleItContractLocalAgreementElementTypesInternalV2PatchLocalAgreementElementType(
            {
              organizationUuid,
              optionUuid,
              dto: request,
            }
          );
      case 'it-contract-extend-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.optionExtendTypeService.patchSingleItContractLocalOptionExtendTypesInternalV2PatchLocalOptionExtendType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it-contract-payment-frequency-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.paymentFrequencyTypeService.patchSingleItContractLocalPaymentFrequencyTypesInternalV2PatchLocalPaymentFrequencyType(
            {
              organizationUuid,
              optionUuid,
              dto: request,
            }
          );
      case 'it-contract-price-regulation-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.priceRegulationTypeService.patchSingleItContractLocalPriceRegulationTypesInternalV2PatchLocalPriceRegulationType(
            {
              organizationUuid,
              optionUuid,
              dto: request,
            }
          );
      case 'it-contract_procurement-strategy-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.procurementStrategyTypeService.patchSingleItContractLocalProcurementStrategyTypesInternalV2PatchLocalProcurementStrategyType(
            {
              organizationUuid,
              optionUuid,
              dto: request,
            }
          );
      case 'it-contract-termination-period-types':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.terminationDeadlineTypeService.patchSingleItContractLocalTerminationDeadlineTypesInternalV2PatchLocalTerminationDeadlineType(
            {
              organizationUuid,
              optionUuid,
              dto: request,
            }
          );
      case 'it-contract_criticality-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.criticalityTypeService.patchSingleItContractLocalCriticalityTypesInternalV2PatchLocalCriticalityType({
            organizationUuid,
            optionUuid,
            dto: request,
          });

      //Role option types
      case 'organization-unit':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.organiztionUnitRoleService.patchSingleOrganizationUnitLocalRoleOptionTypesInternalV2PatchLocalOrganizationUnitRole(
            {
              organizationUuid,
              optionUuid,
              dto: request,
            }
          );
      case 'it-system-usage':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.itSystemRoleService.patchSingleItSystemLocalRoleOptionTypesInternalV2PatchLocalItSystemRole({
            organizationUuid,
            optionUuid,
            dto: request,
          });

      case 'data-processing':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.dprRoleService.patchSingleDprLocalRoleOptionTypesInternalV2PatchLocalDprRole({
            organizationUuid,
            optionUuid,
            dto: request,
          });

      case 'it-contract':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.itContractRoleService.patchSingleItContractLocalRoleOptionTypesInternalV2PatchLocalItContractRole({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      default:
        throw new Error(`Patch operation is not supported for ${optionType}`);
    }
  }

  private resolveCreateLocalOptionsEndpoint(
    optionType: LocalAdminOptionType
  ): (organizationUuid: string, optionUuid: string) => Observable<APILocalRoleOptionResponseDTO> {
    switch (optionType) {
      //It system regular option types
      case 'it-system_business-type':
        return (organizationUuid, optionUuid) =>
          this.businessTypeService.postSingleItSystemLocalBusinessTypesInternalV2CreateLocalBusinessType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it-system_usage-archive-type':
        return (organizationUuid, optionUuid) =>
          this.archiveTypeService.postSingleItSystemLocalArchiveTypesInternalV2CreateLocalArchiveType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it-system_usage-archive-location-type':
        return (organizationUuid, optionUuid) =>
          this.archiveLocationService.postSingleItSystemLocalArchiveLocationTypesInternalV2CreateArchiveLocationType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it-system_usage-archive-location-test-type':
        return (organizationUuid, optionUuid) =>
          this.archiveTestLocationService.postSingleItSystemLocalArchiveTestLocationTypesInternalV2CreateLocalArchiveTestLocationType(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
      case 'it-interface_data-type':
        return (organizationUuid, optionUuid) =>
          this.dataTypeService.postSingleItSystemLocalDataTypesInternalV2CreateLocalDataType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it-system_usage-relation-frequency-type':
        return (organizationUuid, optionUuid) =>
          this.frequencyTypeService.postSingleItSystemLocalFrequencyTypesInternalV2CreateLocalRelationFrequencyType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it-interface_interface-type':
        return (organizationUuid, optionUuid) =>
          this.interfaceTypeService.postSingleItSystemLocalInterfaceTypesInternalV2CreateLocalInterfaceType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (organizationUuid, optionUuid) =>
          this.sensitivePersonalDataTypeService.postSingleItSystemLocalSensitivePersonalDataTypesInternalV2CreateLocalSensitivePersonalDataType(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
      case 'it-system_usage-data-classification-type':
        return (organizationUuid, optionUuid) =>
          this.itSystemCategoryService.postSingleItSystemLocalItSystemCategoriesTypesInternalV2CreateLocalItSystemCategoryType(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (organizationUuid, optionUuid) =>
          this.registerTypeService.postSingleItSystemLocalRegisterTypesInternalV2CreateLocalRegisterType({
            organizationUuid,
            dto: { optionUuid },
          });

      //Data processing regular option types
      case 'data-processing-basis-for-transfer-types':
        return (organizationUuid, optionUuid) =>
          this.basisForTransferService.postSingleDprLocalBasisForTransferTypesInternalV2CreateLocalBasisForTransferType(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
      case 'data-processing-oversight-option-types':
        return (organizationUuid, optionUuid) =>
          this.oversightOptionService.postSingleDprLocalOversightOptionTypesInternalV2CreateLocalOversightOptionType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'data-processing-data-responsible-types':
        return (organizationUuid, optionUuid) =>
          this.dataResponsibleService.postSingleDprLocalDataResponsibleTypesInternalV2CreateLocalDataResponsibleType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'data-processing-country-types':
        return (organizationUuid, optionUuid) =>
          this.countryService.postSingleDprLocalCountryOptionTypesInternalV2CreateLocalCountryOptionType({
            organizationUuid,
            dto: { optionUuid },
          });

      //It contract regular option types
      case 'it-contract_contract-type':
        return (organizationUuid, optionUuid) =>
          this.contractTypeService.postSingleItContractLocalContractTypesInternalV2CreateLocalContractType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it-contract_contract-template-type':
        return (organizationUuid, optionUuid) =>
          this.templateTypeService.postSingleItContractLocalTemplateTypesInternalV2CreateLocalTemplateType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it-contract_purchase-form-type':
        return (organizationUuid, optionUuid) =>
          this.purchaseFormTypeService.postSingleItContractLocalPurchaseFormTypesInternalV2CreateLocalResultPurchaseFormType(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
      case 'it-contract-payment-model-types':
        return (organizationUuid, optionUuid) =>
          this.paymentModelTypeService.postSingleItContractLocalPaymentModelTypesInternalV2CreateLocalPaymentModelType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it-contract-agreement-element-types':
        return (organizationUuid, optionUuid) =>
          this.agreementElementTypeService.postSingleItContractLocalAgreementElementTypesInternalV2CreateLocalAgreementElementType(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
      case 'it-contract-extend-types':
        return (organizationUuid, optionUuid) =>
          this.optionExtendTypeService.postSingleItContractLocalOptionExtendTypesInternalV2CreateLocalOptionExtendType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it-contract-payment-frequency-types':
        return (organizationUuid, optionUuid) =>
          this.paymentFrequencyTypeService.postSingleItContractLocalPaymentFrequencyTypesInternalV2CreateLocalPaymentFrequencyType(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
      case 'it-contract-price-regulation-types':
        return (organizationUuid, optionUuid) =>
          this.priceRegulationTypeService.postSingleItContractLocalPriceRegulationTypesInternalV2CreateLocalPriceRegulationType(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
      case 'it-contract_procurement-strategy-type':
        return (organizationUuid, optionUuid) =>
          this.procurementStrategyTypeService.postSingleItContractLocalProcurementStrategyTypesInternalV2CreateLocalProcurementStrategyType(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
      case 'it-contract-termination-period-types':
        return (organizationUuid, optionUuid) =>
          this.terminationDeadlineTypeService.postSingleItContractLocalTerminationDeadlineTypesInternalV2CreateLocalTerminationDeadlineType(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
      case 'it-contract_criticality-type':
        return (organizationUuid, optionUuid) =>
          this.criticalityTypeService.postSingleItContractLocalCriticalityTypesInternalV2CreateLocalCriticalityType({
            organizationUuid,
            dto: { optionUuid },
          });
      //Role option types
      case 'organization-unit':
        return (organizationUuid, optionUuid) =>
          this.organiztionUnitRoleService.postSingleOrganizationUnitLocalRoleOptionTypesInternalV2CreateLocalOrganizationUnitRole(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
      case 'it-system-usage':
        return (organizationUuid, optionUuid) =>
          this.itSystemRoleService.postSingleItSystemLocalRoleOptionTypesInternalV2CreateLocalItSystemRole({
            organizationUuid,
            dto: { optionUuid },
          });

      case 'data-processing':
        return (organizationUuid, optionUuid) =>
          this.dprRoleService.postSingleDprLocalRoleOptionTypesInternalV2CreateLocalDprRole({
            organizationUuid,
            dto: { optionUuid },
          });

      case 'it-contract':
        return (organizationUuid, optionUuid) =>
          this.itContractRoleService.postSingleItContractLocalRoleOptionTypesInternalV2CreateLocalItContractRole({
            organizationUuid,
            dto: { optionUuid },
          });
      default:
        throw new Error(`Create operation is not supported for ${optionType}`);
    }
  }

  private resolveDeleteLocalOptionsEndpoint(
    optionType: LocalAdminOptionType
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
            }
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
            }
          );
      case 'it-system_usage-data-classification-type':
        return (organizationUuid, optionUuid) =>
          this.itSystemCategoryService.deleteSingleItSystemLocalItSystemCategoriesTypesInternalV2DeleteLocalItSystemCategoryType(
            {
              organizationUuid,
              optionUuid,
            }
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (organizationUuid, optionUuid) =>
          this.registerTypeService.deleteSingleItSystemLocalRegisterTypesInternalV2DeleteLocalRegisterType({
            organizationUuid,
            optionUuid,
          });

      //Data processing regular option types
      case 'data-processing-basis-for-transfer-types':
        return (organizationUuid, optionUuid) =>
          this.basisForTransferService.deleteSingleDprLocalBasisForTransferTypesInternalV2DeleteLocalBasisForTransferType(
            {
              organizationUuid,
              optionUuid,
            }
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
            }
          );
      case 'it-contract-payment-model-types':
        return (organizationUuid, optionUuid) =>
          this.paymentModelTypeService.deleteSingleItContractLocalPaymentModelTypesInternalV2DeleteLocalPaymentModelType(
            {
              organizationUuid,
              optionUuid,
            }
          );
      case 'it-contract-agreement-element-types':
        return (organizationUuid, optionUuid) =>
          this.agreementElementTypeService.deleteSingleItContractLocalAgreementElementTypesInternalV2DeleteLocalAgreementElementType(
            {
              organizationUuid,
              optionUuid,
            }
          );
      case 'it-contract-extend-types':
        return (organizationUuid, optionUuid) =>
          this.optionExtendTypeService.deleteSingleItContractLocalOptionExtendTypesInternalV2DeleteLocalOptionExtendType(
            {
              organizationUuid,
              optionUuid,
            }
          );
      case 'it-contract-payment-frequency-types':
        return (organizationUuid, optionUuid) =>
          this.paymentFrequencyTypeService.deleteSingleItContractLocalPaymentFrequencyTypesInternalV2DeleteLocalPaymentFrequencyType(
            {
              organizationUuid,
              optionUuid,
            }
          );
      case 'it-contract-price-regulation-types':
        return (organizationUuid, optionUuid) =>
          this.priceRegulationTypeService.deleteSingleItContractLocalPriceRegulationTypesInternalV2DeleteLocalPriceRegulationType(
            {
              organizationUuid,
              optionUuid,
            }
          );
      case 'it-contract_procurement-strategy-type':
        return (organizationUuid, optionUuid) =>
          this.procurementStrategyTypeService.deleteSingleItContractLocalProcurementStrategyTypesInternalV2DeleteLocalProcurementStrategyType(
            {
              organizationUuid,
              optionUuid,
            }
          );
      case 'it-contract-termination-period-types':
        return (organizationUuid, optionUuid) =>
          this.terminationDeadlineTypeService.deleteSingleItContractLocalTerminationDeadlineTypesInternalV2DeleteLocalTerminationDeadlineType(
            {
              organizationUuid,
              optionUuid,
            }
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
            }
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

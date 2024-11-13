import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  APIGlobalRoleOptionCreateRequestDTO,
  APIGlobalRoleOptionResponseDTO,
  APIGlobalRoleOptionUpdateRequestDTO,
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

    //Role types
    @Inject(APIV2ItSystemGlobalRoleOptionTypesInternalINTERNALService)
    private itSystemRoleService: APIV2ItSystemGlobalRoleOptionTypesInternalINTERNALService
  ) {}

  public getGlobalOptions(optionType: GlobalAdminOptionType): Observable<Array<APIGlobalRoleOptionResponseDTO>> {
    return this.resolveGetGlobalOptionsEndpoint(optionType)();
  }

  public createGlobalOption(optionType: GlobalAdminOptionType, request: APIGlobalRoleOptionUpdateRequestDTO) {
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

      //Role types
      case 'it-system-usage':
        return () => this.itSystemRoleService.getManyItSystemGlobalRoleOptionTypesInternalV2GetItSystemRoles();
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

      //Role types
      case 'it-system-usage':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.itSystemRoleService.patchSingleItSystemGlobalRoleOptionTypesInternalV2PatchGlobalBItSystemRole({
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
      //Role types
      case 'it-system-usage':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.itSystemRoleService.postSingleItSystemGlobalRoleOptionTypesInternalV2CreateItSystemRole({
            dto,
          });
      default:
        throw new Error(`Create operation is not supported for ${optionType}`);
    }
  }
}

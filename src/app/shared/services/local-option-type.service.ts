import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, first, Observable, OperatorFunction, pipe, switchMap, tap, throwError } from 'rxjs';
import {
  APILocalRegularOptionResponseDTO,
  APILocalRegularOptionUpdateRequestDTO,
  APILocalRoleOptionResponseDTO,
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
import { OptionTypeActions } from 'src/app/store/option-types/actions';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { filterNullish } from '../pipes/filter-nullish';
import { OptionTypeTableOption } from '../components/option-type-table/option-type-table.component';

@Injectable({
  providedIn: 'root',
})
export class LocalOptionTypeService {
  constructor(
    private store: Store,
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
    private organiztionUnitRoleService: APIV2OrganizationUnitLocalRoleOptionTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalRoleOptionTypesInternalINTERNALService)
    private itSystemRoleService: APIV2ItSystemLocalRoleOptionTypesInternalINTERNALService
  ) {}

  public getLocalOptions(
    organizationUuid: string,
    optionType: OptionTypeTableOption
  ): Observable<Array<APILocalRegularOptionResponseDTO>> {
    return this.resolveGetLocalOptionsEndpoint(optionType)(organizationUuid);
  }

  public patchLocalOption(
    optionType: OptionTypeTableOption,
    optionUuid: string,
    request: APILocalRegularOptionUpdateRequestDTO
  ): void {
    this.getOrganizationUuid()
      .pipe(
        switchMap((organizationUuid) =>
          this.resolvePatchLocalOptionsEndpoint(optionType)(organizationUuid, optionUuid, request)
        ),
        this.handleResponse()
      )

      .subscribe();
  }

  public patchIsActive(optionType: OptionTypeTableOption, optionUuid: string, isActive: boolean): void {
    this.getOrganizationUuid()
      .pipe(
        switchMap((organizationUuid) => {
          if (isActive) {
            return this.resolveCreateLocalOptionsEndpoint(optionType)(organizationUuid, optionUuid);
          } else {
            return this.resolveDeleteLocalOptionsEndpoint(optionType)(organizationUuid, optionUuid);
          }
        })
      )
      .pipe(this.handleResponse())
      .subscribe();
  }

  private handleResponse<T>(): OperatorFunction<T, T> {
    return pipe(
      tap(() => {
        this.store.dispatch(OptionTypeActions.updateOptionTypeSuccess());
      }),
      catchError((error) => {
        this.store.dispatch(OptionTypeActions.updateOptionTypeError());
        return throwError(() => new Error(`Failed to update option: ${error.message}`));
      })
    );
  }

  private getOrganizationUuid(): Observable<string> {
    return this.store.select(selectOrganizationUuid).pipe(first(), filterNullish());
  }

  private resolveGetLocalOptionsEndpoint(
    optionType: OptionTypeTableOption
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
          this.itSystemRoleService.getManyItSystemLocalRoleOptionTypesInternalV2GetLocalOrganizationUnitRoles({
            organizationUuid,
          });
      default:
        throw new Error(`Get operation is not supported for ${optionType}`);
    }
  }

  private resolvePatchLocalOptionsEndpoint(optionType: OptionTypeTableOption) {
    switch (optionType) {
      case 'it-system_business-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.businessTypeService.patchSingleItSystemLocalBusinessTypesInternalV2PatchLocalBusinessType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
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
      default:
        throw new Error(`Patch operation is not supported for ${optionType}`);
    }
  }

  private resolveCreateLocalOptionsEndpoint(
    optionType: OptionTypeTableOption
  ): (organizationUuid: string, optionUuid: string) => Observable<APILocalRoleOptionResponseDTO> {
    switch (optionType) {
      case 'it-system_business-type':
        return (organizationUuid, optionUuid) =>
          this.businessTypeService.postSingleItSystemLocalBusinessTypesInternalV2CreateLocalBusinessType({
            organizationUuid,
            dto: { optionUuid },
          });
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
      default:
        throw new Error(`Create operation is not supported for ${optionType}`);
    }
  }

  private resolveDeleteLocalOptionsEndpoint(
    optionType: OptionTypeTableOption
  ): (organizationUuid: string, optionUuid: string) => Observable<APILocalRoleOptionResponseDTO> {
    switch (optionType) {
      case 'it-system_business-type':
        return (organizationUuid, optionUuid) =>
          this.businessTypeService.deleteSingleItSystemLocalBusinessTypesInternalV2DeleteLocalBusinessType({
            organizationUuid,
            optionUuid,
          });
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
      default:
        throw new Error(`Delete operation is not supported for ${optionType}`);
    }
  }
}

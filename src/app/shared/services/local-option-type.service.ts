import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, first, Observable, OperatorFunction, pipe, switchMap, tap, throwError } from 'rxjs';
import {
  APILocalRegularOptionResponseDTO,
  APILocalRegularOptionUpdateRequestDTO,
  APILocalRoleOptionResponseDTO,
  APIV2ItSystemLocalRegularOptionTypesInternalINTERNALService,
  APIV2OrganizationUnitLocalRoleOptionTypesInternalINTERNALService,
} from 'src/app/api/v2';
import { OptionTypeActions } from 'src/app/store/option-types/actions';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { filterNullish } from '../pipes/filter-nullish';
import { OptionTypeTableOption } from '../models/options/local-option-type.model';

@Injectable({
  providedIn: 'root',
})
export class LocalOptionTypeService {
  constructor(
    private store: Store,
    private itSystemService: APIV2ItSystemLocalRegularOptionTypesInternalINTERNALService,
    private organiztionUnitService: APIV2OrganizationUnitLocalRoleOptionTypesInternalINTERNALService
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
      case 'it-system_business-type':
        return (organizationUuid) =>
          this.itSystemService.getManyItSystemLocalRegularOptionTypesInternalV2GetLocalBusinessTypes({
            organizationUuid,
          });
      case 'organization-unit':
        return (organizationUuid) =>
          this.organiztionUnitService.getManyOrganizationUnitLocalRoleOptionTypesInternalV2GetLocalOrganizationUnitRoles(
            {
              organizationUuid,
            }
          );
      default:
        throw new Error(`Get operation is not supported for ${optionType}`);
    }
  }

  private resolvePatchLocalOptionsEndpoint(optionType: OptionTypeTableOption) {
    switch (optionType) {
      case 'it-system_business-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.itSystemService.patchSingleItSystemLocalRegularOptionTypesInternalV2PatchLocalBusinessType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'organization-unit':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.organiztionUnitService.patchSingleOrganizationUnitLocalRoleOptionTypesInternalV2PatchLocalOrganizationUnitRole(
            {
              organizationUuid,
              optionUuid,
              dto: request,
            }
          );
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
          this.itSystemService.postSingleItSystemLocalRegularOptionTypesInternalV2CreateLocalBusinessType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'organization-unit':
        return (organizationUuid, optionUuid) =>
          this.organiztionUnitService.postSingleOrganizationUnitLocalRoleOptionTypesInternalV2CreateLocalOrganizationUnitRole(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
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
          this.itSystemService.deleteSingleItSystemLocalRegularOptionTypesInternalV2DeleteLocalBusinessType({
            organizationUuid,
            optionUuid,
          });
      case 'organization-unit':
        return (organizationUuid, optionUuid) =>
          this.organiztionUnitService.deleteSingleOrganizationUnitLocalRoleOptionTypesInternalV2DeleteLocalOrganizationUnitRole(
            {
              organizationUuid,
              optionUuid,
            }
          );
      default:
        throw new Error(`Delete operation is not supported for ${optionType}`);
    }
  }
}

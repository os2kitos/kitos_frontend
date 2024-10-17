import { Injectable } from '@angular/core';
import { first, switchMap, tap, catchError, throwError, Observable } from 'rxjs';
import {
  APILocalRegularOptionResponseDTO,
  APILocalRegularOptionUpdateRequestDTO,
  APIV2ItSystemLocalRegularOptionTypesInternalINTERNALService,
} from 'src/app/api/v2';
import { OptionTypeActions } from 'src/app/store/option-types/actions';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { RegularOptionType } from '../models/options/regular-option-types.model';
import { filterNullish } from '../pipes/filter-nullish';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class LocalRegularOptionTypeService {
  constructor(
    private store: Store,
    private itSystemLocalOptionTypesService: APIV2ItSystemLocalRegularOptionTypesInternalINTERNALService
  ) {}

  public getLocalOptions(
    organizationUuid: string,
    optionType: RegularOptionType
  ): Observable<Array<APILocalRegularOptionResponseDTO>> {
    return this.resolveGetLocalOptionsEndpoint(optionType)(organizationUuid);
  }

  public patchLocalOption(
    optionType: RegularOptionType,
    optionUuid: string,
    request: APILocalRegularOptionUpdateRequestDTO
  ): void {
    this.store
      .select(selectOrganizationUuid)
      .pipe(
        first(),
        filterNullish(),
        switchMap((organizationUuid) =>
          this.resolvePatchLocalOptionsEndpoint(optionType)(organizationUuid, optionUuid, request)
        )
      )
      .pipe(
        tap(() => {
          this.store.dispatch(OptionTypeActions.updateOptionTypeSuccess());
        }),
        catchError(() => {
          this.store.dispatch(OptionTypeActions.updateOptionTypeError());
          return throwError(() => 'Failed to update option');
        })
      )
      .subscribe();
  }

  public patchIsActive(optionType: RegularOptionType, optionUuid: string, isActive: boolean): void {
    this.store
      .select(selectOrganizationUuid)
      .pipe(
        first(),
        filterNullish(),
        switchMap((organizationUuid) => {
          if (isActive) {
            return this.resolveCreateLocalOptionsEndpoint(optionType)(organizationUuid, optionUuid);
          } else {
            return this.resolveDeleteLocalOptionsEndpoint(optionType)(organizationUuid, optionUuid);
          }
        })
      )
      .pipe(
        tap(() => {
          this.store.dispatch(OptionTypeActions.updateOptionTypeSuccess());
        }),
        catchError(() => {
          this.store.dispatch(OptionTypeActions.updateOptionTypeError());
          return throwError(() => 'Failed to update option');
        })
      )
      .subscribe();
  }

  private resolveGetLocalOptionsEndpoint(
    optionType: RegularOptionType
  ): (organizationUuid: string) => Observable<Array<APILocalRegularOptionResponseDTO>> {
    switch (optionType) {
      case 'it-system_business-type':
        return (organizationUuid) =>
          this.itSystemLocalOptionTypesService.getManyItSystemLocalRegularOptionTypesInternalV2GetLocalBusinessTypes({
            organizationUuid,
          });
      default:
        throw new Error(`Get operation is not supported for ${optionType}`);
    }
  }

  private resolvePatchLocalOptionsEndpoint(optionType: RegularOptionType) {
    switch (optionType) {
      case 'it-system_business-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.itSystemLocalOptionTypesService.patchSingleItSystemLocalRegularOptionTypesInternalV2PatchLocalBusinessType(
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
    optionType: RegularOptionType
  ): (organizationUuid: string, optionUuid: string) => Observable<APILocalRegularOptionResponseDTO> {
    switch (optionType) {
      case 'it-system_business-type':
        return (organizationUuid, optionUuid) =>
          this.itSystemLocalOptionTypesService.postSingleItSystemLocalRegularOptionTypesInternalV2CreateLocalBusinessType(
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
    optionType: RegularOptionType
  ): (organizationUuid: string, optionUuid: string) => Observable<APILocalRegularOptionResponseDTO> {
    switch (optionType) {
      case 'it-system_business-type':
        return (organizationUuid, optionUuid) =>
          this.itSystemLocalOptionTypesService.deleteSingleItSystemLocalRegularOptionTypesInternalV2DeleteLocalBusinessType(
            {
              organizationUuid,
              optionUuid,
            }
          );
      default:
        throw new Error(`Create operation is not supported for ${optionType}`);
    }
  }
}

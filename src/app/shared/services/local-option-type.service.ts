import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, first, Observable, OperatorFunction, pipe, switchMap, tap, throwError } from 'rxjs';
import {
  APILocalRegularOptionResponseDTO,
  APILocalRegularOptionUpdateRequestDTO,
  APIV2ItSystemLocalRegularOptionTypesInternalINTERNALService,
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
    private itSystemLocalOptionTypesApiService: APIV2ItSystemLocalRegularOptionTypesInternalINTERNALService
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
      catchError(() => {
        this.store.dispatch(OptionTypeActions.updateOptionTypeError());
        return throwError(() => 'Failed to update option');
      })
    );
  }

  private getOrganizationUuid(): Observable<string> {
    return this.store.select(selectOrganizationUuid).pipe(first(), filterNullish());
  }

  private resolveGetLocalOptionsEndpoint(
    optionType: OptionTypeTableOption
  ): (organizationUuid: string) => Observable<Array<APILocalRegularOptionResponseDTO>> {
    switch (optionType) {
      case 'it-system_business-type':
        return (organizationUuid) =>
          this.itSystemLocalOptionTypesApiService.getManyItSystemLocalRegularOptionTypesInternalV2GetLocalBusinessTypes(
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
          this.itSystemLocalOptionTypesApiService.patchSingleItSystemLocalRegularOptionTypesInternalV2PatchLocalBusinessType(
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
  ): (organizationUuid: string, optionUuid: string) => Observable<APILocalRegularOptionResponseDTO> {
    switch (optionType) {
      case 'it-system_business-type':
        return (organizationUuid, optionUuid) =>
          this.itSystemLocalOptionTypesApiService.postSingleItSystemLocalRegularOptionTypesInternalV2CreateLocalBusinessType(
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
  ): (organizationUuid: string, optionUuid: string) => Observable<APILocalRegularOptionResponseDTO> {
    switch (optionType) {
      case 'it-system_business-type':
        return (organizationUuid, optionUuid) =>
          this.itSystemLocalOptionTypesApiService.deleteSingleItSystemLocalRegularOptionTypesInternalV2DeleteLocalBusinessType(
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

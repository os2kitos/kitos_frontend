import { Injectable } from '@angular/core';
import { first, switchMap, tap, catchError, throwError } from 'rxjs';
import {
  APILocalRegularOptionUpdateRequestDTO,
  APIV2ItSystemLocalOptionTypesInternalINTERNALService,
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
    private itSystemLocalOptionTypesService: APIV2ItSystemLocalOptionTypesInternalINTERNALService
  ) {}

  private resolvePatchLocalOptionsEndpoint(optionType: RegularOptionType) {
    switch (optionType) {
      case 'it-system_business-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.itSystemLocalOptionTypesService.patchSingleItSystemLocalOptionTypesInternalV2PatchLocalBusinessType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      default:
        throw new Error(`Patch operation is not supported for ${optionType}`);
    }
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
    this;
  }
}

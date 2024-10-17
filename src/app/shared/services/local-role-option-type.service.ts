import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { RoleOptionTypes } from '../models/options/role-option-types.model';
import { catchError, first, of, switchMap, tap, throwError } from 'rxjs';
import { OptionTypeActions } from 'src/app/store/option-types/actions';
import { filterNullish } from '../pipes/filter-nullish';

@Injectable({
  providedIn: 'root',
})
export class LocalRoleOptionTypeService {
  constructor(private store: Store) {}

  private resolvePatchLocalRoleOptionEndpoint(optionType: RoleOptionTypes) {
    switch (optionType) {
      case 'it-contract':
        return (organizationUuid: string, optionUuid: string, request: object) => of({});
      default:
        throw new Error(`Patch operation is not supported for ${optionType}`);
    }
  }

  public patchLocalRoleOption(optionType: RoleOptionTypes, optionUuid: string, request: object) {
    this.store
      .select(selectOrganizationUuid)
      .pipe(
        first(),
        filterNullish(),
        switchMap((organizationUuid) =>
          this.resolvePatchLocalRoleOptionEndpoint(optionType)(organizationUuid, optionUuid, request)
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
}

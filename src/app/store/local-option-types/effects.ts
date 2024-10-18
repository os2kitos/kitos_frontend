import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LocalOptionTypeActions } from './actions';
import { concatLatestFrom } from '@ngrx/operators';
import { selectOrganizationUuid } from '../user-store/selectors';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { catchError, map, of, switchMap } from 'rxjs';
import { LocalOptionTypeService } from 'src/app/shared/services/local-option-type.service';

@Injectable()
export class LocalOptionTypeEffects {
  constructor(
    private store: Store,
    private actions$: Actions,
    private localOptionTypeService: LocalOptionTypeService
  ) {}

  patchOptionType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LocalOptionTypeActions.uppdateOptionType),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ optionType, optionUuid, request }, organizationUuid]) => {
        return this.localOptionTypeService.patchLocalOption(optionType, organizationUuid, optionUuid, request).pipe(
          map(() => LocalOptionTypeActions.updateOptionTypeSuccess()),
          catchError(() => of(LocalOptionTypeActions.updateOptionTypeError()))
        );
      })
    );
  });

  patchActiveStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LocalOptionTypeActions.updateOptionTypeActiveStatus),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ optionType, optionUuid, isActive }, organizationUuid]) => {
        return this.localOptionTypeService.patchIsActive(optionType, organizationUuid, optionUuid, isActive).pipe(
          map(() => LocalOptionTypeActions.updateOptionTypeSuccess()),
          catchError(() => of(LocalOptionTypeActions.updateOptionTypeError()))
        );
      })
    );
  });
}

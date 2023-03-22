import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { APIV2ItContractContractTypeService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ContractTypeActions } from './actions';
import { selectHasValidCache } from './selectors';

@Injectable()
export class ContractTypeEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private apiItContractTypeService: APIV2ItContractContractTypeService
  ) {}

  getContractTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ContractTypeActions.getContractTypes),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid), this.store.select(selectHasValidCache)]),
      filter(([_, __, validCache]) => !validCache),
      map(([_, organizationUuid]) => organizationUuid),
      filterNullish(),
      switchMap((organizationUuid) =>
        this.apiItContractTypeService.getManyItContractContractTypeV2Get({ organizationUuid: organizationUuid }).pipe(
          map((response) => ContractTypeActions.getContractTypesSuccess(response)),
          catchError(() => of(ContractTypeActions.getContractTypesError()))
        )
      )
    );
  });
}

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, switchMap } from 'rxjs';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { RoleOptionTypeActions } from './actions';
import { selectHasValidCache } from './selectors';

export class RoleOptionTypeEffects {
  constructor(private actions$: Actions, private store: Store) {}

  getOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoleOptionTypeActions.getOptions),
      concatLatestFrom(({ _, optionType }) => [this.store.select(selectHasValidCache(optionType))]),
      filter(([_, validCache]) => {
        return !validCache;
      }),
      filterNullish(),
      switchMap
    );
  });
}

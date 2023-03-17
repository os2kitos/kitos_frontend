import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, filter, map, of, switchMap } from "rxjs";
import { APIV2ItInterfaceInterfaceTypeService } from "src/app/api/v2";
import { filterNullish } from "src/app/shared/pipes/filter-nullish";
import { selectHasValidCache } from "../business-type/selectors";
import { selectOrganizationUuid } from "../user-store/selectors";
import { InterfaceTypeActions } from "./actions";

@Injectable()
export class InterfaceTypeEffects{
  constructor(
    private actions$: Actions,
    private store: Store,
    private apiItInterfaceTypeService: APIV2ItInterfaceInterfaceTypeService
  ){}

    getInterfaceTypes$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(InterfaceTypeActions.getInterfaceTypes),
        concatLatestFrom(() => [this.store.select(selectOrganizationUuid), this.store.select(selectHasValidCache)]),
        filter(([_, __, validCache]) => !validCache),
        map(([_, organizationUuid]) => organizationUuid),
        filterNullish(),
        switchMap((organziationUuid) =>
          this.apiItInterfaceTypeService.gETItInterfaceInterfaceTypeV2GetUnboundedPaginationQueryPaginationGuidOrganizationUuid(
            organziationUuid
          )
          .pipe(
            map((response)=> InterfaceTypeActions.getInterfaceTypesSuccess(response)),
            catchError(() => of(InterfaceTypeActions.getInterffcaeTypesError))
          )
        )
      );
    });
}

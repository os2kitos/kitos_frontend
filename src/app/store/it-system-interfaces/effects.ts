import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { ITInterfaceActions } from "./actions";
import { catchError, map, of, switchMap } from "rxjs";
import { OData } from "src/app/shared/models/odata.model";
import { compact } from "lodash";
import { adaptITInterface } from "src/app/shared/models/it-interface/it-interface.model";
import { HttpClient } from "@angular/common/http";
import { selectOrganizationUuid } from "../user-store/selectors";
import { toODataString } from "src/app/shared/models/grid-state.model";


@Injectable()
export class ITInterfaceEffects {

  constructor(
    private actions$: Actions,
    private store: Store,
    private httpClient: HttpClient,
  ) {}

  getItInterfaces$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.getITInterfaces),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid)),
      switchMap(([ odataString, organizationUuid ]) =>
        this.httpClient.get<OData>(`/odata/ItInterfaces?organizationUuid=${organizationUuid}&${odataString.odataString}`
        )
        .pipe(
          map((data) =>
            ITInterfaceActions.getITInterfacesSuccess(compact(data.value.map(adaptITInterface)), data['@odata.count'])
          ),
          catchError(() => of(ITInterfaceActions.getITInterfacesError()))
        )
      )
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.updateGridState),
        map(({ gridState }) => ITInterfaceActions.getITInterfaces(toODataString(gridState)))
    );
  });
}

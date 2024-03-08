import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { ITInterfaceActions } from "./actions";
import { catchError, map, of, switchMap } from "rxjs";
import { OData } from "src/app/shared/models/odata.model";
import { compact } from "lodash";
import { adaptITInterface } from "src/app/shared/models/it-interface/it-interface.model";
import { HttpClient } from "@angular/common/http";
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
      switchMap(({ odataString }) =>
        this.httpClient.get<OData>(`/odata/ItInterfaces?${odataString}`
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

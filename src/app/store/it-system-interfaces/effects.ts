import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2ItInterfaceService } from 'src/app/api/v2';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITInterface } from 'src/app/shared/models/it-interface/it-interface.model';
import { OData } from 'src/app/shared/models/odata.model';
import { ITInterfaceActions } from './actions';

@Injectable()
export class ITInterfaceEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private httpClient: HttpClient,
    private apiService: APIV2ItInterfaceService
  ) {}

  getItInterfaces$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.getITInterfaces),
      switchMap(({ odataString }) =>
        this.httpClient.get<OData>(`/odata/ItInterfaces?${odataString}`).pipe(
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

  getItInterface$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.getITInterface),
      switchMap(({ uuid }) =>
        this.apiService.getSingleItInterfaceV2GetItInterface({ uuid }).pipe(
          map((itInterface) => ITInterfaceActions.getITInterfaceSuccess(itInterface)),
          catchError(() => of(ITInterfaceActions.getITInterfaceError()))
        )
      )
    );
  });

  getItInterfacePermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.getITInterfacePermissions),
      switchMap(({ uuid }) =>
        this.apiService.getSingleItInterfaceV2GetItInterfacePermissions({ interfaceUuid: uuid }).pipe(
          map((permissions) => ITInterfaceActions.getITInterfacePermissionsSuccess(permissions)),
          catchError(() => of(ITInterfaceActions.getITInterfacePermissionsError()))
        )
      )
    );
  });
}

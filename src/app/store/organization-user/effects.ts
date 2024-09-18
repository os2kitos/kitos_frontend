import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { toODataString } from '@progress/kendo-data-query';
import { compact } from 'lodash';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2ItInterfaceService } from 'src/app/api/v2';
import { OData } from 'src/app/shared/models/odata.model';
import { adaptOrganizationUser } from 'src/app/shared/models/organization-user/organization-user.model';
import { ORGANIZATION_USER_COLUMNS_ID } from 'src/app/shared/persistent-state-constants';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { OrganizationUserActions } from './actions';

@Injectable()
export class OrganizationUserEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private httpClient: HttpClient,
    private apiService: APIV2ItInterfaceService,
    private statePersistingService: StatePersistingService
  ) {}

  getItInterfaces$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.getOrganizationUsers),
      switchMap(({ odataString }) =>
        this.httpClient
          .get<OData>(
            `/odata/ItInterfaces?$expand=Interface($select=Name),
            ObjectOwner($select=Name,LastName),
            Organization($select=Name),
            ExhibitedBy($expand=ItSystem($select=Id,Name,Uuid,Disabled;$expand=BelongsTo($select=Name))),
            LastChangedByUser($select=Name,LastName),DataRows($expand=DataType($select=Name))&${odataString}&$count=true`
          )
          .pipe(
            map((data) =>
              OrganizationUserActions.getOrganizationUsersSuccess(
                compact(data.value.map(adaptOrganizationUser)),
                data['@odata.count']
              )
            ),
            catchError(() => of(OrganizationUserActions.getOrganizationUsersError()))
          )
      )
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.updateGridState),
      map(({ gridState }) => OrganizationUserActions.getOrganizationUsers(toODataString(gridState)))
    );
  });

  updateGridColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.updateGridColumns),
      map(({ gridColumns }) => {
        this.statePersistingService.set(ORGANIZATION_USER_COLUMNS_ID, gridColumns);
        return OrganizationUserActions.updateGridColumnsSuccess(gridColumns);
      })
    );
  });
}

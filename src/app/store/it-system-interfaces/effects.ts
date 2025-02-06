import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, combineLatestWith, map, of, switchMap } from 'rxjs';
import { APIV2ItInterfaceService } from 'src/app/api/v2';
import { INTERFACE_COLUMNS_ID } from 'src/app/shared/constants/persistent-state-constants';
import {
  castContainsFieldToString,
  replaceQueryByMultiplePropertyContains,
} from 'src/app/shared/helpers/odata-query.helpers';
import { adaptITInterface } from 'src/app/shared/models/it-interface/it-interface.model';
import { OData } from 'src/app/shared/models/odata.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { GridDataCacheService } from 'src/app/shared/services/grid-data-cache.service';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ITInterfaceActions } from './actions';
import { selectInterfaceUuid, selectPreviousGridState } from './selectors';

@Injectable()
export class ITInterfaceEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private httpClient: HttpClient,
    private apiService: APIV2ItInterfaceService,
    private gridColumnStorageService: GridColumnStorageService,
    private gridDataCacheService: GridDataCacheService
  ) {}

  getItInterfaces$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.getITInterfaces),
      concatLatestFrom(() => [this.store.select(selectPreviousGridState)]),
      switchMap(([{ gridState }, previousGridState]) => {
        this.gridDataCacheService.tryResetOnGridStateChange(gridState, previousGridState);

        const cachedRange = this.gridDataCacheService.get(gridState);
        if (cachedRange.data !== undefined) {
          return of(ITInterfaceActions.getITInterfacesSuccess(cachedRange.data, cachedRange.total));
        }

        const cacheableOdataString = this.gridDataCacheService.toChunkedODataString(gridState);
        const fixedOdataString = applyQueryFixes(cacheableOdataString);

        return this.httpClient
          .get<OData>(
            `/odata/ItInterfaces?$expand=Interface($select=Name),
            ObjectOwner($select=Name,LastName),
            Organization($select=Name),
            ExhibitedBy($expand=ItSystem($select=Id,Name,Uuid,Disabled;$expand=BelongsTo($select=Name))),
            LastChangedByUser($select=Name,LastName),DataRows($expand=DataType($select=Name))&${fixedOdataString}&$count=true`
          )
          .pipe(
            map((data) => {
              const dataItems = compact(data.value.map(adaptITInterface));
              const total = data['@odata.count'];
              this.gridDataCacheService.set(gridState, dataItems, total);

              const returnData = this.gridDataCacheService.gridStateSliceFromArray(dataItems, gridState);
              return ITInterfaceActions.getITInterfacesSuccess(returnData, total);
            }),
            catchError(() => of(ITInterfaceActions.getITInterfacesError()))
          );
      })
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.updateGridState),
      map(({ gridState }) => ITInterfaceActions.getITInterfaces(gridState))
    );
  });

  updateGridColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.updateGridColumns),
      map(({ gridColumns }) => {
        this.gridColumnStorageService.setColumns(INTERFACE_COLUMNS_ID, gridColumns);
        return ITInterfaceActions.updateGridColumnsSuccess(gridColumns);
      })
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

  getItInterfaceCollectionPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.getITInterfaceCollectionPermissions),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([_, organizationUuid]) =>
        this.apiService.getSingleItInterfaceV2GetItInterfaceCollectionPermissions({ organizationUuid }).pipe(
          map((collectionPermissions) =>
            ITInterfaceActions.getITInterfaceCollectionPermissionsSuccess(collectionPermissions)
          ),
          catchError(() => of(ITInterfaceActions.getITInterfaceCollectionPermissionsError()))
        )
      )
    );
  });

  deleteItInterface$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.deleteITInterface),
      combineLatestWith(this.store.select(selectInterfaceUuid)),
      switchMap(([_, interfaceUuid]) => {
        if (!interfaceUuid) {
          return of(ITInterfaceActions.deleteITInterfaceError());
        }
        return this.apiService.deleteSingleItInterfaceV2Delete({ uuid: interfaceUuid }).pipe(
          map(() => ITInterfaceActions.deleteITInterfaceSuccess()),
          catchError(() => of(ITInterfaceActions.deleteITInterfaceError()))
        );
      })
    );
  });

  updateItInterface$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.updateITInterface),
      concatLatestFrom(() => this.store.select(selectInterfaceUuid).pipe(filterNullish())),
      switchMap(([{ itInterface }, interfaceUuid]) => {
        if (!itInterface) return of(ITInterfaceActions.updateITInterfaceError());
        return this.apiService.patchSingleItInterfaceV2Patch({ uuid: interfaceUuid, request: itInterface }).pipe(
          map((itInterface) => ITInterfaceActions.updateITInterfaceSuccess(itInterface)),
          catchError((err: HttpErrorResponse) => {
            if (err.status === 409) {
              //Name conflict
              return of(
                ITInterfaceActions.updateITInterfaceError(
                  $localize`Fejl! Feltet kunne ikke ændres da værdien allerede findes i KITOS!`
                )
              );
            } else {
              return of(ITInterfaceActions.updateITInterfaceError()); //Uses default error message
            }
          })
        );
      })
    );
  });

  removeItInterfaceData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.removeITInterfaceData),
      combineLatestWith(this.store.select(selectInterfaceUuid).pipe(filterNullish())),
      switchMap(([{ uuid }, interfaceUuid]) =>
        this.apiService
          .deleteSingleItInterfaceV2DeleteDataDescription({
            uuid: interfaceUuid,
            dataDescriptionUuid: uuid,
          })
          .pipe(
            map(() => ITInterfaceActions.removeITInterfaceDataSuccess(uuid)),
            catchError(() => of(ITInterfaceActions.removeITInterfaceDataError()))
          )
      )
    );
  });

  addInterfaceData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.addITInterfaceData),
      combineLatestWith(this.store.select(selectInterfaceUuid).pipe(filterNullish())),
      switchMap(([{ data }, interfaceUuid]) =>
        this.apiService.postSingleItInterfaceV2PostDataDescription({ request: data, uuid: interfaceUuid }).pipe(
          map((response) => ITInterfaceActions.addITInterfaceDataSuccess(response)),
          catchError(() => of(ITInterfaceActions.addITInterfaceDataError()))
        )
      )
    );
  });

  updateInterfaceData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.updateITInterfaceData),
      combineLatestWith(this.store.select(selectInterfaceUuid).pipe(filterNullish())),
      switchMap(([{ dataUuid, data }, interfaceUuid]) =>
        this.apiService
          .putSingleItInterfaceV2PutDataDescription({
            uuid: interfaceUuid,
            dataDescriptionUuid: dataUuid,
            request: data,
          })
          .pipe(
            map((response) => ITInterfaceActions.updateITInterfaceDataSuccess(response)),
            catchError(() => of(ITInterfaceActions.updateITInterfaceDataError()))
          )
      )
    );
  });

  createITInterface$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.createITInterface),
      combineLatestWith(this.store.select(selectOrganizationUuid)),
      switchMap(([{ name, interfaceId, openAfterCreate }, organizationUuid]) =>
        this.apiService
          .postSingleItInterfaceV2Post({
            request: { name, interfaceId, organizationUuid },
          })
          .pipe(
            map(({ uuid }) => ITInterfaceActions.createITInterfaceSuccess(uuid, openAfterCreate)),
            catchError(() => of(ITInterfaceActions.createITInterfaceError()))
          )
      )
    );
  });
}

function applyQueryFixes(odataString: string): string {
  const lastChangedByUserSearchedProperties = ['Name', 'LastName'];
  let fixedOdataString = replaceQueryByMultiplePropertyContains(
    odataString,
    'LastChangedByUser.Name',
    'LastChangedByUser',
    lastChangedByUserSearchedProperties
  );

  fixedOdataString = castContainsFieldToString(fixedOdataString, 'Uuid');

  return replaceQueryByMultiplePropertyContains(
    fixedOdataString,
    'ObjectOwner.Name',
    'ObjectOwner',
    lastChangedByUserSearchedProperties
  );
}

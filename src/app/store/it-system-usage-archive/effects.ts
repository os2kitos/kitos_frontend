import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, of, switchMap } from 'rxjs';
import { ItSystemUsageArchiveV2Service } from 'src/app/api/v2';
import { USAGE_ARCHIVE_COLUMNS_ID } from 'src/app/shared/constants/persistent-state-constants';
import { adaptItSystemUsageArchive } from 'src/app/shared/models/it-system/it-system-usage-archive-odata.model';
import { OData } from 'src/app/shared/models/odata.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { GridDataCacheService } from 'src/app/shared/services/grid-data-cache.service';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ITSystemUsageArchiveActions } from './actions';
import { selectItSystemUsageArchiveUuid, selectUsageArchivePreviousGridState } from './selectors';

@Injectable()
export class ITSystemUsageArchiveEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    @Inject(ItSystemUsageArchiveV2Service) private archiveService: ItSystemUsageArchiveV2Service,
    private httpClient: HttpClient,
    private gridColumnStorageService: GridColumnStorageService,
    private gridDataCacheService: GridDataCacheService,
  ) {}

  getArchives$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageArchiveActions.getITSystemUsageArchives),
      concatLatestFrom(() => [
        this.store.select(selectUsageArchivePreviousGridState),
        this.store.select(selectOrganizationUuid),
      ]),
      switchMap(([{ gridState }, previousGridState, organizationUuid]) => {
        this.gridDataCacheService.tryResetOnGridStateChange(gridState, previousGridState);

        const cachedRange = this.gridDataCacheService.get(gridState);
        if (cachedRange.data !== undefined) {
          return of(ITSystemUsageArchiveActions.getITSystemUsageArchivesSuccess(cachedRange.data, cachedRange.total));
        }

        const cacheableOdataString = this.gridDataCacheService.toChunkedODataString(gridState);
        return this.httpClient
          .get<OData>(
            `/odata/ItSystemUsageArchives?organizationUuid=${organizationUuid}&$expand=Snapshot($expand=ItSystem($select=Name,Uuid))&${cacheableOdataString}&$count=true`,
          )
          .pipe(
            map((data) => {
              const dataItems = compact(data.value.map(adaptItSystemUsageArchive));
              const total = data['@odata.count'];
              this.gridDataCacheService.set(gridState, dataItems, total);

              const returnData = this.gridDataCacheService.gridStateSliceFromArray(dataItems, gridState);
              return ITSystemUsageArchiveActions.getITSystemUsageArchivesSuccess(returnData, total);
            }),
            catchError(() => of(ITSystemUsageArchiveActions.getITSystemUsageArchivesError())),
          );
      }),
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageArchiveActions.updateGridState),
      map(({ gridState }) => ITSystemUsageArchiveActions.getITSystemUsageArchives(gridState)),
    );
  });

  updateGridColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageArchiveActions.updateGridColumns),
      map(({ gridColumns }) => {
        this.gridColumnStorageService.setColumns(USAGE_ARCHIVE_COLUMNS_ID, gridColumns);
        return ITSystemUsageArchiveActions.updateGridColumnsSuccess(gridColumns);
      }),
    );
  });

  deleteArchive$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageArchiveActions.deleteITSystemUsageArchive),
      concatLatestFrom(() => this.store.select(selectItSystemUsageArchiveUuid).pipe(filterNullish())),
      switchMap(([_, archiveUuid]) =>
        this.archiveService.deleteSingleItSystemUsageArchiveV2Delete({ archiveUuid }).pipe(
          map(() => ITSystemUsageArchiveActions.deleteITSystemUsageArchiveSuccess()),
          catchError(() => of(ITSystemUsageArchiveActions.deleteITSystemUsageArchiveError())),
        ),
      ),
    );
  });

  getPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageArchiveActions.getITSystemUsageArchivePermissions),
      switchMap(({ archiveUuid }) =>
        this.archiveService.getSingleItSystemUsageArchiveV2GetItSystemUsageArchivePermissions({ archiveUuid }).pipe(
          map((permissions) => ITSystemUsageArchiveActions.getITSystemUsageArchivePermissionsSuccess(permissions)),
          catchError(() => of(ITSystemUsageArchiveActions.getITSystemUsageArchivePermissionsError())),
        ),
      ),
    );
  });

  getCollectionPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageArchiveActions.getITSystemUsageArchiveCollectionPermissions),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([_, organizationUuid]) =>
        this.archiveService
          .getSingleItSystemUsageArchiveV2GetItSystemUsageArchiveCollectionPermissions({ organizationUuid })
          .pipe(
            map((permissions) =>
              ITSystemUsageArchiveActions.getITSystemUsageArchiveCollectionPermissionsSuccess(permissions),
            ),
            catchError(() => of(ITSystemUsageArchiveActions.getITSystemUsageArchiveCollectionPermissionsError())),
          ),
      ),
    );
  });

  getArchive$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageArchiveActions.getITSystemUsageArchive),
      switchMap(({ itSystemUsageArchiveUuid }) =>
        this.archiveService.getSingleItSystemUsageArchiveV2Get({ archiveUuid: itSystemUsageArchiveUuid }).pipe(
          map((itSystemUsageArchive) =>
            ITSystemUsageArchiveActions.getITSystemUsageArchiveSuccess(itSystemUsageArchive),
          ),
          catchError(() => of(ITSystemUsageArchiveActions.getITSystemUsageArchiveError())),
        ),
      ),
    );
  });
}

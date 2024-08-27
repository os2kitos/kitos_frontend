import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, combineLatestWith, filter, map, mergeMap, of, switchMap } from 'rxjs';
import { APIItSystemResponseDTO, APIV2ItSystemService } from 'src/app/api/v2';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITSystem } from 'src/app/shared/models/it-system/it-system.model';
import { OData } from 'src/app/shared/models/odata.model';
import { CATALOG_COLUMNS_ID } from 'src/app/shared/persistent-state-constants';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ExternalReferencesApiService } from 'src/app/shared/services/external-references-api-service.service';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { GridExportActions } from '../grid/actions';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ITSystemActions } from './actions';
import { selectItSystemExternalReferences, selectItSystemUuid } from './selectors';

@Injectable()
export class ITSystemEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    @Inject(APIV2ItSystemService) private apiItSystemService: APIV2ItSystemService,
    private httpClient: HttpClient,
    private externalReferenceApiService: ExternalReferencesApiService,
    private statePersistingService: StatePersistingService
  ) { }

  getItSystem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.getITSystem),
      switchMap(({ systemUuid }) =>
        this.apiItSystemService.getSingleItSystemV2GetItSystem({ uuid: systemUuid }).pipe(
          map((itSystem) => ITSystemActions.getITSystemSuccess(itSystem)),
          catchError(() => of(ITSystemActions.getITSystemError()))
        )
      )
    );
  });

  getitSystems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.getITSystems),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ odataString }, organizationUuid]) => {
        const fixedOdataString = applyQueryFixes(odataString);

        return this.httpClient
          .get<OData>(
            `/odata/ItSystems?$expand=BusinessType($select=Name),
          BelongsTo($select=Name),
          TaskRefs($select=Description,TaskKey),
          Parent($select=Name,Disabled),
          Organization($select=Id,Name),
          Usages($select=OrganizationId;$expand=Organization($select=Uuid,Name)),
          LastChangedByUser($select=Name,LastName),
          Reference($select=Title,URL,ExternalReferenceId)&${fixedOdataString}&$count=true`
          )
          .pipe(
            map((data) =>
              ITSystemActions.getITSystemsSuccess(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                compact(data.value.map((value: any) => adaptITSystem(value, organizationUuid))),
                data['@odata.count']
              )
            ),
            catchError(() => of(ITSystemActions.getITSystemsError()))
          );
      })
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.updateGridState),
      map(({ gridState }) => ITSystemActions.getITSystems(toODataString(gridState)))
    );
  });

  updateGridStateOnExport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GridExportActions.exportDataFetch, GridExportActions.exportCompleted),
      filter(({ entityType }) => entityType === 'it-system'),
      map(({ gridState }) => ITSystemActions.getITSystems(toODataString(gridState)))
    );
  });

  updateGridColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.updateGridColumns),
      map(({ gridColumns }) => {
        this.statePersistingService.set(CATALOG_COLUMNS_ID, gridColumns);
        return ITSystemActions.updateGridColumnsSuccess(gridColumns);
      })
    );
  });

  deleteItSystem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.deleteITSystem),
      concatLatestFrom(() => this.store.select(selectItSystemUuid)),
      switchMap(([_, systemUuid]) => {
        if (!systemUuid) return of(ITSystemActions.deleteITSystemError());

        return this.apiItSystemService.deleteSingleItSystemV2DeleteItSystem({ uuid: systemUuid }).pipe(
          map(() => ITSystemActions.deleteITSystemSuccess()),
          catchError(() => of(ITSystemActions.getITSystemsError()))
        );
      })
    );
  });

  patchItSystem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.patchITSystem),
      concatLatestFrom(() => this.store.select(selectItSystemUuid)),
      switchMap(([{ itSystem, customSuccessText, customErrorText }, systemUuid]) => {
        if (!systemUuid) return of(ITSystemActions.patchITSystemError());
        return this.apiItSystemService.patchSingleItSystemV2PatchItSystem({ uuid: systemUuid, request: itSystem }).pipe(
          map((itSystem) => ITSystemActions.patchITSystemSuccess(itSystem, customSuccessText)),
          catchError((err: HttpErrorResponse) => {
            if (err.status === 409) {
              return of(
                ITSystemActions.patchITSystemError(
                  $localize`Fejl! Feltet kunne ikke ændres da værdien den allerede findes i KITOS!`
                )
              );
            } else {
              return of(ITSystemActions.patchITSystemError(customErrorText));
            }
          })
        );
      })
    );
  });

  getItSystemPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.getITSystemPermissions),
      switchMap(({ systemUuid }) =>
        this.apiItSystemService.getSingleItSystemV2GetItSystemPermissions({ systemUuid }).pipe(
          map((permissions) => ITSystemActions.getITSystemPermissionsSuccess(permissions)),
          catchError(() => of(ITSystemActions.getITSystemPermissionsError()))
        )
      )
    );
  });

  getItSystemCollectionPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.getITSystemCollectionPermissions),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([_, organizationUuid]) =>
        this.apiItSystemService.getSingleItSystemV2GetItSystemCollectionPermissions({ organizationUuid }).pipe(
          map((permissions) => ITSystemActions.getITSystemCollectionPermissionsSuccess(permissions)),
          catchError(() => of(ITSystemActions.getITSystemCollectionPermissionsError()))
        )
      )
    );
  });

  addExternalReference$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.addExternalReference),
      concatLatestFrom(() => [
        this.store.select(selectItSystemExternalReferences).pipe(filterNullish()),
        this.store.select(selectItSystemUuid),
      ]),
      mergeMap(([newExternalReference, externalReferences, systemUuid]) => {
        return this.externalReferenceApiService
          .addExternalReference<APIItSystemResponseDTO>(
            newExternalReference.externalReference,
            externalReferences,
            systemUuid,
            'it-system'
          )
          .pipe(
            map((response) => ITSystemActions.addExternalReferenceSuccess(response)),
            catchError(() => of(ITSystemActions.addExternalReferenceError()))
          );
      })
    );
  });

  editExternalReference$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.editExternalReference),
      concatLatestFrom(() => [
        this.store.select(selectItSystemExternalReferences),
        this.store.select(selectItSystemUuid),
      ]),
      mergeMap(([editData, externalReferences, systemUuid]) => {
        return this.externalReferenceApiService
          .editExternalReference<APIItSystemResponseDTO>(editData, externalReferences, systemUuid, 'it-system')
          .pipe(
            map((response) => ITSystemActions.editExternalReferenceSuccess(response)),
            catchError(() => of(ITSystemActions.editExternalReferenceError()))
          );
      })
    );
  });

  removeExternalReference$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.removeExternalReference),
      concatLatestFrom(() => [
        this.store.select(selectItSystemExternalReferences),
        this.store.select(selectItSystemUuid),
      ]),
      mergeMap(([referenceUuid, externalReferences, systemUuid]) => {
        return this.externalReferenceApiService
          .deleteExternalReference<APIItSystemResponseDTO>(
            referenceUuid.referenceUuid,
            externalReferences,
            systemUuid,
            'it-system'
          )
          .pipe(
            map((response) => ITSystemActions.removeExternalReferenceSuccess(response)),
            catchError(() => of(ITSystemActions.removeExternalReferenceError()))
          );
      })
    );
  });

  createItSystem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.createItSystem),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid)),
      switchMap(([{ name, openAfterCreate }, organizationUuid]) => {
        return this.apiItSystemService.postSingleItSystemV2PostItSystem({ request: { name, organizationUuid } }).pipe(
          map(({ uuid }) => ITSystemActions.createItSystemSuccess(uuid, openAfterCreate)),
          catchError(() => of(ITSystemActions.createItSystemError()))
        );
      })
    );
  });
}

function applyQueryFixes(odataString: string): string {
  const fixedOdataString = odataString
    .replace(/(\w+\()KLEIds(.*\))/, 'TaskRefs/any(c: $1c/TaskKey$2)')
    .replace(/(\w+\()KLENames(.*\))/, 'TaskRefs/any(c: $1c/Description$2)');
  return fixedOdataString;
}

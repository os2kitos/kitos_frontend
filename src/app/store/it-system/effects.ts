import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { APIItSystemResponseDTO, APIV2ItSystemService } from 'src/app/api/v2';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITSystem } from 'src/app/shared/models/it-system/it-system.model';
import { OData } from 'src/app/shared/models/odata.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ExternalReferencesApiService } from 'src/app/shared/services/external-references-api-service.service';
import { ITSystemActions } from './actions';
import { selectItSystemExternalReferences, selectItSystemUuid } from './selectors';

@Injectable()
export class ITSystemEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private apiItSystemService: APIV2ItSystemService,
    private httpClient: HttpClient,
    private externalReferenceApiService: ExternalReferencesApiService
  ) {}

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
      switchMap(({ odataString }) =>
        this.httpClient.get<OData>(`/odata/ItSystems?${odataString}`).pipe(
          map((data) =>
            ITSystemActions.getITSystemsSuccess(compact(data.value.map(adaptITSystem)), data['@odata.count'])
          ),
          catchError(() => of(ITSystemActions.getITSystemsError()))
        )
      )
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.updateGridState),
      map(({ gridState }) => ITSystemActions.getITSystems(toODataString(gridState)))
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

        return this.apiItSystemService
          .patchSingleItSystemV2PostItSystemV1({ uuid: systemUuid, request: itSystem })
          .pipe(
            map((itSystem) => ITSystemActions.patchITSystemSuccess(itSystem, customSuccessText)),
            catchError(() => of(ITSystemActions.patchITSystemError(customErrorText)))
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
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { APIUpdateExternalReferenceDataWriteRequestDTO, APIV2ItSystemService } from 'src/app/api/v2';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITSystem } from 'src/app/shared/models/it-system/it-system.model';
import { OData } from 'src/app/shared/models/odata.model';
import { ITSystemActions } from './actions';
import { selectItSystemExternalReferences, selectItSystemUuid } from './selectors';

@Injectable()
export class ITSystemEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private apiItSystemService: APIV2ItSystemService,
    private httpClient: HttpClient
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
      switchMap(([{ itSystem }, systemUuid]) => {
        if (!systemUuid) return of(ITSystemActions.patchITSystemError());

        return this.apiItSystemService
          .patchSingleItSystemV2PostItSystemV1({ uuid: systemUuid, request: itSystem })
          .pipe(
            map((itSystem) => ITSystemActions.patchITSystemSuccess(itSystem)),
            catchError(() => of(ITSystemActions.patchITSystemError()))
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
        this.store.select(selectItSystemExternalReferences),
        this.store.select(selectItSystemUuid),
      ]),
      mergeMap(([newExternalReference, externalReferences, systemUuid]) => {
        if (newExternalReference && externalReferences && systemUuid) {
          const externalReferenceToAdd = newExternalReference.externalReference;
          const nextState = externalReferences.map(
            (externalReference: APIUpdateExternalReferenceDataWriteRequestDTO) => ({
              ...externalReference,
              //If the new reference is master we must reset the existing as the api dictates to provide only one
              masterReference: !externalReferenceToAdd.masterReference && externalReference.masterReference,
            })
          );
          //Add the new reference
          nextState.push({ ...externalReferenceToAdd, masterReference: externalReferenceToAdd.masterReference });

          return this.apiItSystemService
            .patchSingleItSystemV2PostItSystemV1({ uuid: systemUuid, request: { externalReferences: nextState } })
            .pipe(
              map((response) => ITSystemActions.addExternalReferenceSuccess(response)),
              catchError(() => of(ITSystemActions.addExternalReferenceError()))
            );
        }
        return of(ITSystemActions.addExternalReferenceError());
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
        if (editData && externalReferences && systemUuid) {
          const externalReferenceToEdit = editData.externalReference;
          const nextState = externalReferences.map(
            (externalReference: APIUpdateExternalReferenceDataWriteRequestDTO) => {
              if (externalReference.uuid === editData.referenceUuid) {
                return {
                  ...externalReferenceToEdit,
                  masterReference: externalReferenceToEdit.masterReference,
                };
              } else {
                return {
                  ...externalReference,
                  masterReference: !externalReferenceToEdit.masterReference && externalReference.masterReference,
                };
              }
            }
          );

          return this.apiItSystemService
            .patchSingleItSystemV2PostItSystemV1({ uuid: systemUuid, request: { externalReferences: nextState } })
            .pipe(
              map((response) => ITSystemActions.editExternalReferenceSuccess(response)),
              catchError(() => of(ITSystemActions.editExternalReferenceError()))
            );
        }
        return of(ITSystemActions.editExternalReferenceError());
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
        if (referenceUuid && externalReferences && systemUuid) {
          const currentState = externalReferences.map(
            (externalReference: APIUpdateExternalReferenceDataWriteRequestDTO) => ({ ...externalReference })
          ) as APIUpdateExternalReferenceDataWriteRequestDTO[];
          const nextState = currentState.filter(
            (externalReference) => externalReference.uuid !== referenceUuid.referenceUuid
          );

          return this.apiItSystemService
            .patchSingleItSystemV2PostItSystemV1({ uuid: systemUuid, request: { externalReferences: nextState } })
            .pipe(
              map((response) => ITSystemActions.removeExternalReferenceSuccess(response)),
              catchError(() => of(ITSystemActions.removeExternalReferenceError()))
            );
        }
        return of(ITSystemActions.removeExternalReferenceError());
      })
    );
  });
}

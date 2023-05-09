import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { compact, uniq } from 'lodash';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import {
  APIUpdateExternalReferenceDataWriteRequestDTO,
  APIUpdateItSystemUsageRequestDTO,
  APIV2ItSystemUsageService,
} from 'src/app/api/v2';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITSystemUsage } from 'src/app/shared/models/it-system-usage.model';
import { OData } from 'src/app/shared/models/odata.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ITSystemUsageActions } from './actions';
import {
  selectItSystemUsageExternalReferences,
  selectItSystemUsageLocallyAddedKleUuids,
  selectItSystemUsageLocallyRemovedKleUuids,
  selectItSystemUsageResponsibleUnit,
  selectItSystemUsageUsingOrganizationUnits,
  selectItSystemUsageUuid,
} from './selectors';

@Injectable()
export class ITSystemUsageEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private httpClient: HttpClient,
    private apiV2ItSystemUsageService: APIV2ItSystemUsageService
  ) {}

  getItSystemUsages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.getItSystemUsages),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid)),
      switchMap(([{ odataString }, organizationUuid]) =>
        this.httpClient
          .get<OData>(`/odata/ItSystemUsageOverviewReadModels?organizationUuid=${organizationUuid}&${odataString}`)
          .pipe(
            map((data) =>
              ITSystemUsageActions.getItSystemUsagesSuccess(
                compact(data.value.map(adaptITSystemUsage)),
                data['@odata.count']
              )
            ),
            catchError(() => of(ITSystemUsageActions.getItSystemUsagesError()))
          )
      )
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.updateGridState),
      map(({ gridState }) => ITSystemUsageActions.getItSystemUsages(toODataString(gridState)))
    );
  });

  getItSystemUsage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.getItSystemUsage),
      switchMap(({ systemUsageUuid }) =>
        this.apiV2ItSystemUsageService.getSingleItSystemUsageV2GetItSystemUsage({ systemUsageUuid }).pipe(
          map((itSystemUsage) => ITSystemUsageActions.getItSystemUsageSuccess(itSystemUsage)),
          catchError(() => of(ITSystemUsageActions.getItSystemUsageError()))
        )
      )
    );
  });

  removeItSystemUsage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeItSystemUsage),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid)),
      switchMap(([_, systemUsageUuid]) => {
        if (!systemUsageUuid) return of(ITSystemUsageActions.removeItSystemUsageError());

        return this.apiV2ItSystemUsageService.deleteSingleItSystemUsageV2DeleteItSystemUsage({ systemUsageUuid }).pipe(
          map(() => ITSystemUsageActions.removeItSystemUsageSuccess()),
          catchError(() => of(ITSystemUsageActions.removeItSystemUsageError()))
        );
      })
    );
  });

  removeItSystemUsageUsingUnit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeItSystemUsageUsingUnit),
      concatLatestFrom(() => [
        this.store.select(selectItSystemUsageResponsibleUnit),
        this.store.select(selectItSystemUsageUsingOrganizationUnits),
      ]),
      mergeMap(([{ usingUnitToRemoveUuid }, responsibleUnit, usingUnits]) => {
        const unitUuids = usingUnits?.filter((x) => x.uuid !== usingUnitToRemoveUuid).map((x) => x.uuid);
        const requestBody = {
          organizationUsage: {
            usingOrganizationUnitUuids: unitUuids,
            responsibleOrganizationUnitUuid: responsibleUnit?.uuid === usingUnitToRemoveUuid ? null : undefined,
          },
        } as APIUpdateItSystemUsageRequestDTO;

        return of(ITSystemUsageActions.patchItSystemUsage(requestBody, $localize`Relevant organisationsenhed fjernet`));
      })
    );
  });

  patchItSystemUsage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.patchItSystemUsage),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid)),
      mergeMap(([{ itSystemUsage, customSuccessText, customErrorText }, systemUsageUuid]) => {
        if (!systemUsageUuid) return of(ITSystemUsageActions.patchItSystemUsageError(customErrorText));

        return this.apiV2ItSystemUsageService
          .patchSingleItSystemUsageV2PatchSystemUsage({
            systemUsageUuid,
            request: itSystemUsage,
          })
          .pipe(
            map((itSystemUsage) => {
              return ITSystemUsageActions.patchItSystemUsageSuccess(itSystemUsage, customSuccessText);
            }),
            catchError(() => of(ITSystemUsageActions.patchItSystemUsageError(customErrorText)))
          );
      })
    );
  });

  getItSystemUsagePermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.getItSystemUsagePermissions),
      switchMap(({ systemUsageUuid }) =>
        this.apiV2ItSystemUsageService.getSingleItSystemUsageV2GetItSystemUsagePermissions({ systemUsageUuid }).pipe(
          map((permissions) => ITSystemUsageActions.getItSystemUsagePermissionsSuccess(permissions)),
          catchError(() => of(ITSystemUsageActions.getItSystemUsagePermissionsError()))
        )
      )
    );
  });

  addItSystemUsageRole$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.addItSystemUsageRole),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid).pipe(filterNullish())),
      mergeMap(([{ userUuid, roleUuid }, usageUuid]) =>
        this.apiV2ItSystemUsageService
          .patchSingleItSystemUsageV2PatchAddRoleAssignment({
            systemUsageUuid: usageUuid,
            request: { userUuid: userUuid, roleUuid: roleUuid },
          })
          .pipe(
            map((usage) => ITSystemUsageActions.addItSystemUsageRoleSuccess(usage)),
            catchError(() => of(ITSystemUsageActions.addItSystemUsageRoleError()))
          )
      )
    );
  });

  removeItSystemUsageRole$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeItSystemUsageRole),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid).pipe(filterNullish())),
      mergeMap(([{ userUuid, roleUuid }, usageUuid]) =>
        this.apiV2ItSystemUsageService
          .patchSingleItSystemUsageV2PatchRemoveRoleAssignment({
            systemUsageUuid: usageUuid,
            request: { userUuid: userUuid, roleUuid: roleUuid },
          })
          .pipe(
            map((usage) => ITSystemUsageActions.removeItSystemUsageRoleSuccess(usage)),
            catchError(() => of(ITSystemUsageActions.removeItSystemUsageRoleError()))
          )
      )
    );
  });

  addLocalKle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.addLocalKle),
      concatLatestFrom(() => [
        this.store.select(selectItSystemUsageLocallyAddedKleUuids),
        this.store.select(selectItSystemUsageUuid),
      ]),
      mergeMap(([addedKle, currentLocallyAddedKleUuids, systemUsageUuid]) => {
        if (addedKle && currentLocallyAddedKleUuids && systemUsageUuid) {
          const currentKle = currentLocallyAddedKleUuids ?? [];
          const allAddedKleIncludingCurrent = [...currentKle, addedKle.kleUuid];

          return of(
            ITSystemUsageActions.patchItSystemUsage(
              {
                localKleDeviations: {
                  addedKLEUuids: uniq(allAddedKleIncludingCurrent),
                },
              },
              $localize`Opgaven blev tilknyttet`,
              $localize`Opgaven kunne ikke tilknyttets`
            )
          );
        }
        return of();
      })
    );
  });

  removeLocalKle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeLocalKle),
      concatLatestFrom(() => [
        this.store.select(selectItSystemUsageLocallyAddedKleUuids),
        this.store.select(selectItSystemUsageUuid),
      ]),
      mergeMap(([addedKleToRemove, currentLocallyAddedKleUuids, systemUsageUuid]) => {
        if (addedKleToRemove && currentLocallyAddedKleUuids && systemUsageUuid) {
          const currentKle = currentLocallyAddedKleUuids ?? [];
          const allAddedKleIncludingCurrent = currentKle.filter((uuid) => uuid !== addedKleToRemove.kleUuid);

          return of(
            ITSystemUsageActions.patchItSystemUsage(
              {
                localKleDeviations: {
                  addedKLEUuids: uniq(allAddedKleIncludingCurrent),
                },
              },
              $localize`Den lokalt tilknyttede opgave blev fjernet`,
              $localize`Den lokalt tilknyttede opgave kunne ikke fjernes`
            )
          );
        }
        return of();
      })
    );
  });

  removeInheritedKle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeInheritedKle),
      concatLatestFrom(() => [
        this.store.select(selectItSystemUsageLocallyRemovedKleUuids),
        this.store.select(selectItSystemUsageUuid),
      ]),
      mergeMap(([inheritedKleToRemove, currentRemovedInheritedKleUuids, systemUsageUuid]) => {
        if (inheritedKleToRemove && currentRemovedInheritedKleUuids && systemUsageUuid) {
          const currentState = currentRemovedInheritedKleUuids ?? [];
          const removedKleUuids = [...currentState, inheritedKleToRemove.kleUuid];

          return of(
            ITSystemUsageActions.patchItSystemUsage(
              {
                localKleDeviations: {
                  removedKLEUuids: uniq(removedKleUuids),
                },
              },
              $localize`Den nedarvede opgave blev fjernet`,
              $localize`Den nedarvede opgave kunne ikke fjernes`
            )
          );
        }
        return of();
      })
    );
  });

  restoreInheritedKle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.restoreInheritedKle),
      concatLatestFrom(() => [
        this.store.select(selectItSystemUsageLocallyRemovedKleUuids),
        this.store.select(selectItSystemUsageUuid),
      ]),
      mergeMap(([inheritedKleToRestore, currentRemovedInheritedKleUuids, systemUsageUuid]) => {
        if (inheritedKleToRestore && currentRemovedInheritedKleUuids && systemUsageUuid) {
          const currentState = currentRemovedInheritedKleUuids ?? [];
          const removedKleUuids = currentState.filter((uuid) => uuid !== inheritedKleToRestore.kleUuid);

          return of(
            ITSystemUsageActions.patchItSystemUsage(
              {
                localKleDeviations: {
                  removedKLEUuids: uniq(removedKleUuids),
                },
              },
              $localize`Den nedarvede opgave blev gendannet`,
              $localize`Den nedarvede opgave kunne ikke gendannes`
            )
          );
        }
        return of();
      })
    );
  });

  addItSystemUsageRelation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.addItSystemUsageRelation),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid).pipe(filterNullish())),
      mergeMap(([{ request }, usageUuid]) =>
        this.apiV2ItSystemUsageService
          .postSingleItSystemUsageV2PostSystemUsageRelation({
            systemUsageUuid: usageUuid,
            request,
          })
          .pipe(
            map((relation) => ITSystemUsageActions.addItSystemUsageRelationSuccess(usageUuid, relation)),
            catchError(() => of(ITSystemUsageActions.addItSystemUsageRelationError()))
          )
      )
    );
  });

  patchItSystemUsageRelation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.patchItSystemUsageRelation),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid).pipe(filterNullish())),
      mergeMap(([{ relationUuid, request }, usageUuid]) =>
        this.apiV2ItSystemUsageService
          .putSingleItSystemUsageV2PutSystemUsageRelation({
            systemUsageUuid: usageUuid,
            systemRelationUuid: relationUuid,
            request: request,
          })
          .pipe(
            map((relation) => ITSystemUsageActions.patchItSystemUsageRelationSuccess(usageUuid, relation)),
            catchError(() => of(ITSystemUsageActions.patchItSystemUsageRelationError()))
          )
      )
    );
  });

  removeItSystemUsageRelation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeItSystemUsageRelation),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid).pipe(filterNullish())),
      mergeMap(([{ relationUuid }, usageUuid]) =>
        this.apiV2ItSystemUsageService
          .deleteSingleItSystemUsageV2DeleteSystemUsageRelation({
            systemUsageUuid: usageUuid,
            systemRelationUuid: relationUuid,
          })
          .pipe(
            map(() => ITSystemUsageActions.removeItSystemUsageRelationSuccess(usageUuid)),
            catchError(() => of(ITSystemUsageActions.removeItSystemUsageRelationError()))
          )
      )
    );
  });

  removeExternalReference$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeExternalReference),
      concatLatestFrom(() => [
        this.store.select(selectItSystemUsageExternalReferences),
        this.store.select(selectItSystemUsageUuid),
      ]),
      mergeMap(([referenceUuid, externalReferences, systemUsageUuid]) => {
        if (referenceUuid && externalReferences && systemUsageUuid) {
          const currentState = externalReferences.map<APIUpdateExternalReferenceDataWriteRequestDTO>(
            (externalReference) => ({
              masterReference: externalReference.masterReference,
              title: externalReference.title,
              documentId: externalReference.documentId,
              url: externalReference.url,
              uuid: externalReference.uuid,
            })
          );
          const nextState = currentState.filter((reference) => reference.uuid !== referenceUuid.referenceUuid);

          return of(
            ITSystemUsageActions.patchItSystemUsage(
              {
                externalReferences: nextState,
              },
              $localize`Den eksterne reference blev slettet`,
              $localize`Den eksterne reference kunne ikke slettes`
            )
          );
        }
        return of();
      })
    );
  });
}

import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, combineLatestWith, map, mergeMap, of, switchMap } from 'rxjs';
import { APIV2StsOrganizationSynchronizationInternalINTERNALService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { FkOrgActions } from './actions';

@Injectable()
export class FkOrgEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    @Inject(APIV2StsOrganizationSynchronizationInternalINTERNALService)
    private apiService: APIV2StsOrganizationSynchronizationInternalINTERNALService
  ) {}

  getSynchronizationStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FkOrgActions.getSynchronizationStatus),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([_, organizationUuid]) =>
        this.apiService
          .getSingleStsOrganizationSynchronizationInternalV2GetSynchronizationStatus({ organizationUuid })
          .pipe(
            map((synchronizationStatus) => FkOrgActions.getSynchronizationStatusSuccess(synchronizationStatus)),
            catchError(() => of(FkOrgActions.getSynchronizationStatusError()))
          )
      )
    );
  });

  getSnapshot$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FkOrgActions.getSnapshot),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([_, organizationUuid]) =>
        this.apiService
          .getSingleStsOrganizationSynchronizationInternalV2GetSnapshotFromStsOrganization({ organizationUuid })
          .pipe(
            map((snapshot) => FkOrgActions.getSnapshotSuccess(snapshot)),
            catchError(() => of(FkOrgActions.getSnapshotError()))
          )
      )
    );
  });

  createConnection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FkOrgActions.createConnection),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ request }, organizationUuid]) =>
        this.apiService
          .postSingleStsOrganizationSynchronizationInternalV2CreateConnection({ organizationUuid, request })
          .pipe(
            map(() => FkOrgActions.createConnectionSuccess()),
            catchError(() => of(FkOrgActions.createConnectionError()))
          )
      )
    );
  });

  previewConnectionUpdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FkOrgActions.previewConnectionUpdate),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ synchronizationDepth }, organizationUuid]) =>
        this.apiService
          .getSingleStsOrganizationSynchronizationInternalV2GetUpdateConsequences({
            organizationUuid,
            synchronizationDepth,
          })
          .pipe(
            map((snapshot) => FkOrgActions.previewConnectionUpdateSuccess(snapshot)),
            catchError(() => of(FkOrgActions.previewConnectionUpdateError()))
          )
      )
    );
  });

  updateConnection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FkOrgActions.updateConnection),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ request }, organizationUuid]) =>
        this.apiService
          .putSingleStsOrganizationSynchronizationInternalV2UpdateConnection({ organizationUuid, request })
          .pipe(
            map(() => FkOrgActions.updateConnectionSuccess()),
            catchError(() => of(FkOrgActions.updateConnectionError()))
          )
      )
    );
  });

  deleteAutomaticUpdateSubscription$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FkOrgActions.deleteAutomaticUpdateSubscription),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([_, organizationUuid]) =>
        this.apiService
          .deleteSingleStsOrganizationSynchronizationInternalV2DeleteSubscription({ organizationUuid })
          .pipe(
            map(() => FkOrgActions.deleteAutomaticUpdateSubscriptionSuccess()),
            catchError(() => of(FkOrgActions.deleteAutomaticUpdateSubscriptionError()))
          )
      )
    );
  });
}

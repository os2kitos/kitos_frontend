import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { APIItContractResponseDTO, APIV2ItContractService } from 'src/app/api/v2';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITContract } from 'src/app/shared/models/it-contract/it-contract.model';
import { OData } from 'src/app/shared/models/odata.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ExternalReferencesApiService } from 'src/app/shared/services/external-references-api-service.service';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ITContractActions } from './actions';
import {
  selectItContractDataProcessingRegistrations,
  selectItContractExternalReferences,
  selectItContractSystemAgreementElements,
  selectItContractSystemUsages,
  selectItContractUuid,
} from './selectors';

@Injectable()
export class ITContractEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private apiItContractService: APIV2ItContractService,
    private httpClient: HttpClient,
    private externalReferencesApiService: ExternalReferencesApiService
  ) {}

  getItContract$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.getITContract),
      switchMap(({ contractUuid }) =>
        this.apiItContractService.getSingleItContractV2GetItContractByContractuuid({ contractUuid }).pipe(
          map((itContract) => ITContractActions.getITContractSuccess(itContract)),
          catchError(() => of(ITContractActions.getITContractError()))
        )
      )
    );
  });

  getItContracts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.getITContracts),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid)),
      switchMap(([odataString, organizationUuid]) =>
        this.httpClient
          .get<OData>(
            `/odata/ItContractOverviewReadModels?organizationUuid=${organizationUuid}&${odataString.odataString}`
          )
          .pipe(
            map((data) =>
              ITContractActions.getITContractsSuccess(compact(data.value.map(adaptITContract)), data['@odata.count'])
            ),
            catchError(() => of(ITContractActions.getITContractsError()))
          )
      )
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.updateGridState),
      map(({ gridState }) => ITContractActions.getITContracts(toODataString(gridState)))
    );
  });

  deleteItContract$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.deleteITContract),
      concatLatestFrom(() => [this.store.select(selectItContractUuid)]),
      switchMap(([_, contractUuid]) => {
        if (!contractUuid) return of(ITContractActions.deleteITContractError());

        return this.apiItContractService.deleteSingleItContractV2DeleteItContractByContractuuid({ contractUuid }).pipe(
          map(() => ITContractActions.deleteITContractSuccess()),
          catchError(() => of(ITContractActions.deleteITContractError()))
        );
      })
    );
  });

  patchItContract$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.patchITContract),
      concatLatestFrom(() => this.store.select(selectItContractUuid)),
      switchMap(([{ itContract }, contractUuid]) => {
        if (!contractUuid) return of(ITContractActions.patchITContractError());

        return this.apiItContractService
          .patchSingleItContractV2PatchItContractByContractuuid({ contractUuid, request: itContract })
          .pipe(
            map((response) => ITContractActions.patchITContractSuccess(response)),
            catchError(() => of(ITContractActions.patchITContractError()))
          );
      })
    );
  });

  addItContractSystemAgreementElement$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.addITContractSystemAgreementElement),
      concatLatestFrom(() => [
        this.store.select(selectItContractUuid),
        this.store.select(selectItContractSystemAgreementElements).pipe(filterNullish()),
      ]),
      switchMap(([{ agreementElement }, contractUuid, existingAgreementElements]) => {
        if (!contractUuid) return of(ITContractActions.addITContractSystemAgreementElementError());

        const uuids = [...existingAgreementElements.map((element) => element.uuid), agreementElement.uuid];

        return this.apiItContractService
          .patchSingleItContractV2PatchItContractByContractuuid({
            contractUuid,
            request: { general: { agreementElementUuids: uuids } },
          })
          .pipe(
            map((response) => ITContractActions.addITContractSystemAgreementElementSuccess(response)),
            catchError(() => of(ITContractActions.addITContractSystemAgreementElementError()))
          );
      })
    );
  });

  removeItContractSystemAgreementElement$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.removeITContractSystemAgreementElement),
      concatLatestFrom(() => [
        this.store.select(selectItContractUuid),
        this.store.select(selectItContractSystemAgreementElements).pipe(filterNullish()),
      ]),
      switchMap(([{ agreementElementUuid }, contractUuid, agreementElements]) => {
        if (!contractUuid) return of(ITContractActions.removeITContractSystemAgreementElementError());

        const filteredElements = agreementElements.filter((element) => element.uuid !== agreementElementUuid);
        const uuids = filteredElements.map((element) => element.uuid);

        return this.apiItContractService
          .patchSingleItContractV2PatchItContractByContractuuid({
            contractUuid,
            request: { general: { agreementElementUuids: uuids } },
          })
          .pipe(
            map((response) => ITContractActions.removeITContractSystemAgreementElementSuccess(response)),
            catchError(() => of(ITContractActions.removeITContractSystemAgreementElementError()))
          );
      })
    );
  });

  addItContractSystemUsage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.addITContractSystemUsage),
      concatLatestFrom(() => [
        this.store.select(selectItContractUuid),
        this.store.select(selectItContractSystemUsages).pipe(filterNullish()),
      ]),
      switchMap(([{ systemUsageUuid }, contractUuid, existingSystemUsages]) => {
        if (!contractUuid) return of(ITContractActions.addITContractSystemUsageError());

        const uuids = [...existingSystemUsages.map((usage) => usage.uuid), systemUsageUuid];

        return this.apiItContractService
          .patchSingleItContractV2PatchItContractByContractuuid({
            contractUuid,
            request: { systemUsageUuids: uuids },
          })
          .pipe(
            map((response) => ITContractActions.addITContractSystemUsageSuccess(response)),
            catchError(() => of(ITContractActions.addITContractSystemUsageError()))
          );
      })
    );
  });

  removeItContractSystemUsage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.removeITContractSystemUsage),
      concatLatestFrom(() => [
        this.store.select(selectItContractUuid),
        this.store.select(selectItContractSystemUsages).pipe(filterNullish()),
      ]),
      switchMap(([{ systemUsageUuid }, contractUuid, systemUsages]) => {
        if (!contractUuid) return of(ITContractActions.removeITContractSystemUsageError());

        const filteredUsages = systemUsages.filter((element) => element.uuid !== systemUsageUuid);
        const uuids = filteredUsages.map((usage) => usage.uuid);

        return this.apiItContractService
          .patchSingleItContractV2PatchItContractByContractuuid({ contractUuid, request: { systemUsageUuids: uuids } })
          .pipe(
            map((response) => ITContractActions.removeITContractSystemUsageSuccess(response)),
            catchError(() => of(ITContractActions.removeITContractSystemUsageError()))
          );
      })
    );
  });

  addItContractDataProcessingRegistration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.addITContractDataProcessingRegistration),
      concatLatestFrom(() => [
        this.store.select(selectItContractUuid),
        this.store.select(selectItContractDataProcessingRegistrations),
      ]),
      switchMap(([{ dprUuid }, contractUuid, dataProcessingRegistrations]) => {
        if (!contractUuid) return of(ITContractActions.addITContractDataProcessingRegistrationError());

        const uuids = dataProcessingRegistrations
          ? [...dataProcessingRegistrations.map((dpr) => dpr.uuid), dprUuid]
          : [dprUuid];

        return this.apiItContractService
          .patchSingleItContractV2PatchItContractByContractuuid({
            contractUuid,
            request: { dataProcessingRegistrationUuids: uuids },
          })
          .pipe(
            map((response) => ITContractActions.addITContractDataProcessingRegistrationSuccess(response)),
            catchError(() => of(ITContractActions.addITContractDataProcessingRegistrationError()))
          );
      })
    );
  });

  removeItContractDataProcessingRegistration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.removeITContractDataProcessingRegistration),
      concatLatestFrom(() => [
        this.store.select(selectItContractUuid),
        this.store.select(selectItContractDataProcessingRegistrations),
      ]),
      switchMap(([{ dprUuid }, contractUuid, dataProcessingRegistrations]) => {
        if (!contractUuid || !dataProcessingRegistrations)
          return of(ITContractActions.removeITContractDataProcessingRegistrationError());

        const filteredDprs = dataProcessingRegistrations.filter((dpr) => dpr.uuid !== dprUuid);
        const uuids = filteredDprs.map((dpr) => dpr.uuid);

        return this.apiItContractService
          .patchSingleItContractV2PatchItContractByContractuuid({
            contractUuid,
            request: { dataProcessingRegistrationUuids: uuids },
          })
          .pipe(
            map((response) => ITContractActions.removeITContractDataProcessingRegistrationSuccess(response)),
            catchError(() => of(ITContractActions.removeITContractDataProcessingRegistrationError()))
          );
      })
    );
  });

  getContractPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.getITContractPermissions),
      switchMap(({ contractUuid }) => {
        return this.apiItContractService.getSingleItContractV2GetItContractPermissions({ contractUuid }).pipe(
          map((permissions) => ITContractActions.getITContractPermissionsSuccess(permissions)),
          catchError(() => of(ITContractActions.getITContractPermissionsError()))
        );
      })
    );
  });

  addExternalReference$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.addExternalReference),
      concatLatestFrom(() => [
        this.store.select(selectItContractExternalReferences),
        this.store.select(selectItContractUuid),
      ]),
      mergeMap(([newExternalReference, externalReferences, contractUuid]) => {
        return this.externalReferencesApiService
          .addExternalReference<APIItContractResponseDTO>(
            newExternalReference.externalReference,
            externalReferences,
            contractUuid,
            'it-contract'
          )
          .pipe(
            map((response) => ITContractActions.addExternalReferenceSuccess(response)),
            catchError(() => of(ITContractActions.addExternalReferenceError()))
          );
      })
    );
  });

  editExternalReference$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.editExternalReference),
      concatLatestFrom(() => [
        this.store.select(selectItContractExternalReferences),
        this.store.select(selectItContractUuid),
      ]),
      mergeMap(([editData, externalReferences, contractUuid]) => {
        return this.externalReferencesApiService
          .editExternalReference<APIItContractResponseDTO>(editData, externalReferences, contractUuid, 'it-contract')
          .pipe(
            map((response) => ITContractActions.editExternalReferenceSuccess(response)),
            catchError(() => of(ITContractActions.editExternalReferenceError()))
          );
      })
    );
  });

  removeExternalReference$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.removeExternalReference),
      concatLatestFrom(() => [
        this.store.select(selectItContractExternalReferences),
        this.store.select(selectItContractUuid),
      ]),
      mergeMap(([referenceUuid, externalReferences, contractUuid]) => {
        return this.externalReferencesApiService
          .deleteExternalReference<APIItContractResponseDTO>(
            referenceUuid.referenceUuid,
            externalReferences,
            contractUuid,
            'it-contract'
          )
          .pipe(
            map((response) => ITContractActions.removeExternalReferenceSuccess(response)),
            catchError(() => of(ITContractActions.removeExternalReferenceError()))
          );
      })
    );
  });
}

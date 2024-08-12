import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, combineLatestWith, map, mergeMap, of, switchMap } from 'rxjs';
import { APIV1GridLocalItContractRolesINTERNALService } from 'src/app/api/v1';
import {
  APIContractPaymentsDataResponseDTO,
  APIItContractResponseDTO,
  APIPaymentRequestDTO,
  APIPaymentResponseDTO,
  APIV2ItContractInternalINTERNALService,
  APIV2ItContractService,
} from 'src/app/api/v2';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITContract } from 'src/app/shared/models/it-contract/it-contract.model';
import { PaymentTypes } from 'src/app/shared/models/it-contract/payment-types.model';
import { OData } from 'src/app/shared/models/odata.model';
import { CONTRACT_COLUMNS_ID } from 'src/app/shared/persistent-state-constants';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ExternalReferencesApiService } from 'src/app/shared/services/external-references-api-service.service';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ITContractActions } from './actions';
import {
  selectItContractDataProcessingRegistrations,
  selectItContractExternalReferences,
  selectItContractPayments,
  selectItContractSystemAgreementElements,
  selectItContractSystemUsages,
  selectItContractUuid,
} from './selectors';

@Injectable()
export class ITContractEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    @Inject(APIV2ItContractService) private apiItContractService: APIV2ItContractService,
    @Inject(APIV2ItContractInternalINTERNALService)
    private apiInternalItContractService: APIV2ItContractInternalINTERNALService,
    private httpClient: HttpClient,
    private externalReferencesApiService: ExternalReferencesApiService,
    private statePersistingService: StatePersistingService,
    @Inject(APIV1GridLocalItContractRolesINTERNALService)
    private apiRoleService: APIV1GridLocalItContractRolesINTERNALService
  ) {}

  getItContract$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.getITContract),
      switchMap(({ contractUuid }) =>
        this.apiItContractService.getSingleItContractV2GetItContract({ contractUuid }).pipe(
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
            `/odata/ItContractOverviewReadModels?organizationUuid=${organizationUuid}&$expand=RoleAssignments($select=RoleId,UserId,UserFullName,Email),
            DataProcessingAgreements($select=DataProcessingRegistrationId,DataProcessingRegistrationName),
            ItSystemUsages($select=ItSystemUsageId,ItSystemUsageName,ItSystemIsDisabled)&${odataString.odataString}&$count=true`
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

  updateGridColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.updateGridColumns),
      map(({ gridColumns }) => {
        this.statePersistingService.set(CONTRACT_COLUMNS_ID, gridColumns);
        return ITContractActions.updateGridColumnsSuccess(gridColumns);
      })
    );
  });

  updateGridColumnsAndRoleColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.updateGridColumnsAndRoleColumns),
      map(({ gridColumns, gridRoleColumns }) => {
        const columns = gridColumns.concat(gridRoleColumns);
        this.statePersistingService.set(CONTRACT_COLUMNS_ID, columns);
        return ITContractActions.updateGridColumnsAndRoleColumnsSuccess(columns);
      })
    );
  });

  getItContractOverviewRoles = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.getItContractOverviewRoles),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([_, organizationUuid]) =>
        this.apiRoleService.getSingleGridLocalItContractRolesGetByOrganizationUuid({ organizationUuid }).pipe(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map((options: any) => ITContractActions.getItContractOverviewRolesSuccess(options.contractRoles)),
          catchError(() => of(ITContractActions.getItContractOverviewRolesError()))
        )
      )
    );
  });

  deleteItContract$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.deleteITContract),
      concatLatestFrom(() => [this.store.select(selectItContractUuid)]),
      switchMap(([_, contractUuid]) => {
        if (!contractUuid) return of(ITContractActions.deleteITContractError());

        return this.apiItContractService.deleteSingleItContractV2DeleteItContract({ contractUuid }).pipe(
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
          .patchSingleItContractV2PatchItContract({ contractUuid, request: itContract })
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
          .patchSingleItContractV2PatchItContract({
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
          .patchSingleItContractV2PatchItContract({
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
          .patchSingleItContractV2PatchItContract({
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
          .patchSingleItContractV2PatchItContract({ contractUuid, request: { systemUsageUuids: uuids } })
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
          .patchSingleItContractV2PatchItContract({
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
          .patchSingleItContractV2PatchItContract({
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

  getCollectionPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.getITContractCollectionPermissions),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([_, organizationUuid]) => {
        return this.apiItContractService
          .getSingleItContractV2GetItContractCollectionPermissions({ organizationUuid })
          .pipe(
            map((collectionPermissions) =>
              ITContractActions.getITContractCollectionPermissionsSuccess(collectionPermissions)
            ),
            catchError(() => of(ITContractActions.getITContractCollectionPermissionsError()))
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

  addItContractRole$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.addItContractRole),
      concatLatestFrom(() => this.store.select(selectItContractUuid).pipe(filterNullish())),
      mergeMap(([{ userUuid, roleUuid }, contractUuid]) =>
        this.apiInternalItContractService
          .patchSingleItContractInternalV2PatchAddRoleAssignment({
            contractUuid: contractUuid,
            request: { userUuid: userUuid, roleUuid: roleUuid },
          })
          .pipe(
            map((usage) => ITContractActions.addItContractRoleSuccess(usage)),
            catchError(() => of(ITContractActions.addItContractRoleError()))
          )
      )
    );
  });

  removeItContractRole$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.removeItContractRole),
      concatLatestFrom(() => this.store.select(selectItContractUuid).pipe(filterNullish())),
      mergeMap(([{ userUuid, roleUuid }, contractUuid]) =>
        this.apiInternalItContractService
          .patchSingleItContractInternalV2PatchRemoveRoleAssignment({
            contractUuid: contractUuid,
            request: { userUuid: userUuid, roleUuid: roleUuid },
          })
          .pipe(
            map((usage) => ITContractActions.removeItContractRoleSuccess(usage)),
            catchError(() => of(ITContractActions.removeItContractRoleError()))
          )
      )
    );
  });

  createItContract$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.createItContract),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid)),
      switchMap(([{ name, openAfterCreate }, organizationUuid]) =>
        this.apiItContractService.postSingleItContractV2PostItContract({ request: { name, organizationUuid } }).pipe(
          map(({ uuid }) => ITContractActions.createItContractSuccess(uuid, openAfterCreate)),
          catchError(() => of(ITContractActions.createItContractError()))
        )
      )
    );
  });

  addItContractPayment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.addItContractPayment),
      concatLatestFrom(() => [
        this.store.select(selectItContractUuid).pipe(filterNullish()),
        this.store.select(selectItContractPayments),
      ]),
      mergeMap(([{ payment, paymentType }, contractUuid, payments]) => {
        const request = getPaymentRequest(payments);
        if (paymentType === 'internal') {
          request.payments.internal.push(payment);
        } else {
          request.payments.external.push(payment);
        }
        return this.apiItContractService
          .patchSingleItContractV2PatchItContract({
            contractUuid: contractUuid,
            request,
          })
          .pipe(
            map((response) => ITContractActions.addItContractPaymentSuccess(response)),
            catchError(() => of(ITContractActions.addItContractPaymentError()))
          );
      })
    );
  });

  updateItContractPayment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.updateItContractPayment),
      concatLatestFrom(() => [
        this.store.select(selectItContractUuid).pipe(filterNullish()),
        this.store.select(selectItContractPayments),
      ]),
      switchMap(([{ paymentId, payment, paymentType }, contractUuid, payments]) => {
        const request = getPaymentChangeRequest(payments, paymentType, paymentId);
        if (paymentType === 'internal') {
          request.payments.internal.push(payment);
        } else {
          request.payments.external.push(payment);
        }

        return this.apiItContractService.patchSingleItContractV2PatchItContract({ contractUuid, request }).pipe(
          map((response) => ITContractActions.updateItContractPaymentSuccess(response)),
          catchError(() => of(ITContractActions.updateItContractPaymentError()))
        );
      })
    );
  });

  removeItContractPayment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.removeItContractPayment),
      concatLatestFrom(() => [
        this.store.select(selectItContractUuid).pipe(filterNullish()),
        this.store.select(selectItContractPayments),
      ]),
      switchMap(([{ paymentId, paymentType }, contractUuid, payments]) => {
        const request = getPaymentChangeRequest(payments, paymentType, paymentId);

        return this.apiItContractService.patchSingleItContractV2PatchItContract({ contractUuid, request }).pipe(
          map((response) => ITContractActions.removeItContractPaymentSuccess(response)),
          catchError(() => of(ITContractActions.removeItContractPaymentError()))
        );
      })
    );
  });
}

function getPaymentRequest(payments: APIContractPaymentsDataResponseDTO | undefined) {
  const paymentsObject = payments || { internal: [], external: [] };
  const internalPaymets = mapPayments([...paymentsObject.internal]);
  const externalPayments = mapPayments([...paymentsObject.external]);
  return { payments: { internal: internalPaymets, external: externalPayments } };
}

function getPaymentChangeRequest(
  payments: APIContractPaymentsDataResponseDTO | undefined,
  paymentType: PaymentTypes,
  paymentId: number
) {
  let internalPaymets = payments?.internal ?? [];
  let externalPaymets = payments?.external ?? [];
  if (paymentType === 'internal') {
    internalPaymets = filterPayments([...internalPaymets], paymentId);
  } else {
    externalPaymets = filterPayments([...externalPaymets], paymentId);
  }
  const newPayments = { internal: internalPaymets, external: externalPaymets };
  return getPaymentRequest(newPayments);
}

function filterPayments(payments: APIPaymentResponseDTO[], paymentId: number): APIPaymentRequestDTO[] {
  return payments.filter((p) => p.id !== paymentId);
}

function mapPayments(payments: APIPaymentResponseDTO[]): APIPaymentRequestDTO[] {
  return payments.map((p) => ({ ...p, organizationUnitUuid: p.organizationUnit?.uuid }));
}

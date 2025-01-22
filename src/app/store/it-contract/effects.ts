import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, combineLatestWith, map, mergeMap, of, switchMap } from 'rxjs';
import { APIBusinessRoleDTO } from 'src/app/api/v1';
import {
  APIContractPaymentsDataResponseDTO,
  APIItContractResponseDTO,
  APIPaymentRequestDTO,
  APIPaymentResponseDTO,
  APIV2GridLocalItContractRolesINTERNALService,
  APIV2ItContractInternalINTERNALService,
  APIV2ItContractService,
  APIV2OrganizationGridInternalINTERNALService,
} from 'src/app/api/v2';
import { CONTRACT_COLUMNS_ID } from 'src/app/shared/constants/persistent-state-constants';
import { filterByValidCache } from 'src/app/shared/helpers/observable-helpers';
import { replaceQueryByMultiplePropertyContains } from 'src/app/shared/helpers/odata-query.helpers';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITContract } from 'src/app/shared/models/it-contract/it-contract.model';
import { PaymentTypes } from 'src/app/shared/models/it-contract/payment-types.model';
import { OData } from 'src/app/shared/models/odata.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ExternalReferencesApiService } from 'src/app/shared/services/external-references-api-service.service';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { getNewGridColumnsBasedOnConfig } from '../helpers/grid-config-helper';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ITContractActions } from './actions';
import {
  selectAppliedProcurementPlansCache,
  selectContractGridColumns,
  selectItContractDataProcessingRegistrations,
  selectItContractExternalReferences,
  selectItContractPayments,
  selectItContractSystemAgreementElements,
  selectItContractSystemUsages,
  selectItContractUuid,
  selectOverviewContractRoles,
  selectOverviewContractRolesCache,
} from './selectors';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';

@Injectable()
export class ITContractEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    @Inject(APIV2ItContractService)
    private apiItContractService: APIV2ItContractService,
    @Inject(APIV2ItContractInternalINTERNALService)
    private apiInternalItContractService: APIV2ItContractInternalINTERNALService,
    private httpClient: HttpClient,
    private externalReferencesApiService: ExternalReferencesApiService,
    @Inject(APIV2GridLocalItContractRolesINTERNALService)
    private apiRoleService: APIV2GridLocalItContractRolesINTERNALService,
    @Inject(APIV2OrganizationGridInternalINTERNALService)
    private apiV2organizationalGridInternalService: APIV2OrganizationGridInternalINTERNALService,
    private gridColumnStorageService: GridColumnStorageService
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
      concatLatestFrom(() => [
        this.store.select(selectOrganizationUuid),
        this.store.select(selectOverviewContractRoles),
      ]),
      switchMap(([{ odataString }, organizationUuid, contractRoles]) => {
        const convertedString = applyQueryFixes(odataString, contractRoles);
        return this.httpClient
          .get<OData>(
            `/odata/ItContractOverviewReadModels?organizationUuid=${organizationUuid}&$expand=RoleAssignments($select=RoleId,UserId,UserFullName,Email),
            DataProcessingAgreements($select=DataProcessingRegistrationId,DataProcessingRegistrationName,DataProcessingRegistrationUuid),
            ItSystemUsages($select=ItSystemUsageUuid,ItSystemUsageName,ItSystemIsDisabled)&${convertedString}&$count=true`
          )
          .pipe(
            map((data) =>
              ITContractActions.getITContractsSuccess(compact(data.value.map(adaptITContract)), data['@odata.count'])
            ),
            catchError(() => of(ITContractActions.getITContractsError()))
          );
      })
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
        this.gridColumnStorageService.setColumns(CONTRACT_COLUMNS_ID, gridColumns);
        return ITContractActions.updateGridColumnsSuccess(gridColumns);
      })
    );
  });

  getItContractOverviewRoles = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.getItContractOverviewRoles),
      concatLatestFrom(() => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectOverviewContractRolesCache),
      ]),
      switchMap(([_, organizationUuid, cache]) => {
        if (hasValidCache(cache.cacheTime)) {
          return of(ITContractActions.getItContractOverviewRolesSuccess(cache.value));
        }
        return this.apiRoleService.getSingleGridLocalItContractRolesV2GetByOrganizationUuid({ organizationUuid }).pipe(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map((contractRoles: any) => ITContractActions.getItContractOverviewRolesSuccess(contractRoles)),
          catchError(() => of(ITContractActions.getItContractOverviewRolesError()))
        );
      })
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
      mergeMap(({ userUuid, roleUuid, contractUuid }) =>
        this.apiInternalItContractService
          .patchSingleItContractInternalV2PatchRemoveRoleAssignment({
            contractUuid: contractUuid,
            request: { userUuid: userUuid, roleUuid: roleUuid },
          })
          .pipe(
            map((usage) => ITContractActions.removeItContractRoleSuccess(usage, userUuid, roleUuid, contractUuid)),
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

  saveOrganizationalITContractColumnConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.saveOrganizationalITContractColumnConfiguration),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([{ columnConfig }, organizationUuid]) =>
        this.apiV2organizationalGridInternalService
          .postSingleOrganizationGridInternalV2SaveGridConfiguration({
            organizationUuid,
            overviewType: 'ItContract',
            config: {
              visibleColumns: columnConfig,
            },
          })
          .pipe(
            map(() => ITContractActions.saveOrganizationalITContractColumnConfigurationSuccess()),
            catchError(() => of(ITContractActions.saveOrganizationalITContractColumnConfigurationError()))
          )
      )
    );
  });

  deleteOrganizationalITContractColumnConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.deleteOrganizationalITContractColumnConfiguration),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([_, organizationUuid]) =>
        this.apiV2organizationalGridInternalService
          .deleteSingleOrganizationGridInternalV2DeleteGridConfiguration({
            organizationUuid,
            overviewType: 'ItContract',
          })
          .pipe(
            map(() => ITContractActions.deleteOrganizationalITContractColumnConfigurationSuccess()),
            catchError(() => of(ITContractActions.deleteOrganizationalITContractColumnConfigurationError()))
          )
      )
    );
  });

  resetToOrganizationalITContractColumnConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.resetToOrganizationITContractColumnConfiguration),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([_, organizationUuid]) =>
        this.apiV2organizationalGridInternalService
          .getSingleOrganizationGridInternalV2GetGridConfiguration({
            organizationUuid,
            overviewType: 'ItContract',
          })
          .pipe(
            map((response) => ITContractActions.resetToOrganizationITContractColumnConfigurationSuccess(response)),
            catchError(() => of(ITContractActions.resetToOrganizationITContractColumnConfigurationError()))
          )
      )
    );
  });

  resetToOrganizationITContractColumnConfigurationSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.resetToOrganizationITContractColumnConfigurationSuccess),
      concatLatestFrom(() => [this.store.select(selectContractGridColumns)]),
      map(([{ response }, columns]) => {
        const configColumns = response?.visibleColumns;
        if (!configColumns) return ITContractActions.resetToOrganizationITContractColumnConfigurationError();
        const newColumns = getNewGridColumnsBasedOnConfig(configColumns, columns);
        return ITContractActions.updateGridColumns(newColumns);
      })
    );
  });

  getOrganizationalGridConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.initializeITContractLastSeenGridConfiguration),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([_, organizationUuid]) =>
        this.apiV2organizationalGridInternalService
          .getSingleOrganizationGridInternalV2GetGridConfiguration({
            organizationUuid,
            overviewType: 'ItContract',
          })
          .pipe(
            map((response) => ITContractActions.initializeITContractLastSeenGridConfigurationSuccess(response)),
            catchError(() => of(ITContractActions.initializeITContractLastSeenGridConfigurationError()))
          )
      )
    );
  });

  getAppliedProcurementPlans$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractActions.getAppliedProcurementPlans),
      filterByValidCache(this.store.select(selectAppliedProcurementPlansCache)),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([_, organizationUuid]) => {
        return this.apiInternalItContractService
          .getManyItContractInternalV2GetAppliedProcurementPlans({ organizationUuid })
          .pipe(
            map((response) => ITContractActions.getAppliedProcurementPlansSuccess(response)),
            catchError(() => of(ITContractActions.getAppliedProcurementPlansError()))
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

function applyQueryFixes(odataString: string, roles: APIBusinessRoleDTO[] | undefined) {
  let convertedString = replaceProcurementFilter(odataString);
  convertedString = convertedString
    .replace(/CriticalityUuid eq '([\w-]+)'/, 'CriticalityUuid eq $1')
    .replace(/ContractTypeUuid eq '([\w-]+)'/, 'ContractTypeUuid eq $1')
    .replace(/ContractTemplateUuid eq '([\w-]+)'/, 'ContractTemplateUuid eq $1')
    .replace(/PurchaseFormUuid eq '([\w-]+)'/, 'PurchaseFormUuid eq $1')
    .replace(/ProcurementStrategyUuid eq '([\w-]+)'/, 'ProcurementStrategyUuid eq $1')
    .replace(/PaymentFrequencyUuid eq '([\w-]+)'/, 'PaymentFrequencyUuid eq $1')
    .replace(/PaymentModelUuid eq '([\w-]+)'/, 'PaymentModelUuid eq $1')
    .replace(/OptionExtendUuid eq '([\w-]+)'/, 'OptionExtendUuid eq $1')
    .replace(/TerminationDeadlineUuid eq '([\w-]+)'/, 'TerminationDeadlineUuid eq $1')
    .replace(/contains\(ItSystemUsages,(.*?)\)/, 'ItSystemUsages/any(c: contains(c/ItSystemUsageName,$1))')
    .replace(
      /contains\(DataProcessingAgreements,(.*?)\)/,
      'DataProcessingAgreements/any(c: contains(c/DataProcessingRegistrationName,$1))'
    )
    .replace("ItSystemUsageUuidsAsCsv", "ItSystemUsagesSystemUuidCsv");
  roles?.forEach((role) => {
    convertedString = convertedString.replace(
      new RegExp(`(\\w+\\()Roles[./]Role${role.id}(,.*?\\))`, 'i'),
      `RoleAssignments/any(d: $1d/UserFullName$2 and d/RoleId eq ${role.id})`
    );
  });

  const lastChangedByUserSearchedProperties = ['Name', 'LastName'];
  convertedString = replaceQueryByMultiplePropertyContains(
    convertedString,
    'ObjectOwner.Name',
    'ObjectOwner',
    lastChangedByUserSearchedProperties
  );

  return convertedString;
}

const replaceProcurementFilter = (filterUrl: string) => {
  const procurementPlanYearProperties = {
    year: 'ProcurementPlanYear',
    quarter: 'ProcurementPlanQuarter',
  };

  // Decode the URL-encoded string
  const decodedFilterUrl = decodeURIComponent(filterUrl);

  const pattern = new RegExp(`${procurementPlanYearProperties.year} eq 'Q([0-9]+)\\s\\|\\s([0-9]+)'`, 'i');
  const emptyOptionPattern = new RegExp(`${procurementPlanYearProperties.year} eq '(${Number.NaN})'`, 'i');
  const matchingFilterPart = pattern.exec(decodedFilterUrl);

  if (matchingFilterPart?.length !== 3) {
    const emptyOptionMatch = emptyOptionPattern.exec(decodedFilterUrl);

    if (emptyOptionMatch?.length === 2) {
      filterUrl = decodedFilterUrl.replace(
        emptyOptionPattern,
        `(${procurementPlanYearProperties.year} eq null and ${procurementPlanYearProperties.quarter} eq null)`
      );
    }
  } else {
    const quarter = matchingFilterPart[1];
    const year = matchingFilterPart[2];

    filterUrl = decodedFilterUrl.replace(
      pattern,
      `(${procurementPlanYearProperties.year} eq ${year} and ${procurementPlanYearProperties.quarter} eq ${quarter})`
    );
  }

  return filterUrl;
};

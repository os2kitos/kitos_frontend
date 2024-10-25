import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, combineLatest, combineLatestWith, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { APIBusinessRoleDTO, APIV1DataProcessingRegistrationINTERNALService } from 'src/app/api/v1';
import {
  APIDataProcessingRegistrationGeneralDataWriteRequestDTO,
  APIDataProcessingRegistrationOversightWriteRequestDTO,
  APIDataProcessingRegistrationResponseDTO,
  APIDataProcessorRegistrationSubDataProcessorResponseDTO,
  APIDataProcessorRegistrationSubDataProcessorWriteRequestDTO,
  APIV2DataProcessingRegistrationInternalINTERNALService,
  APIV2DataProcessingRegistrationService,
  APIV2OrganizationGridInternalINTERNALService,
} from 'src/app/api/v2';
import * as GridFields from 'src/app/shared/constants/data-processing-grid-column-constants';
import { DATA_PROCESSING_COLUMNS_ID } from 'src/app/shared/constants/persistent-state-constants';
import { adaptDataProcessingRegistration } from 'src/app/shared/models/data-processing/data-processing.model';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { OData } from 'src/app/shared/models/odata.model';
import { UIConfigGridApplication } from 'src/app/shared/models/ui-config/ui-config-grid-application';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ExternalReferencesApiService } from 'src/app/shared/services/external-references-api-service.service';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { UIConfigService } from 'src/app/shared/services/ui-config.service';
import { getNewGridColumnsBasedOnConfig } from '../helpers/grid-config-helper';
import { selectDprEnableMainContract, selectDprEnableRoles } from '../organization/ui-module-customization/selectors';
import { selectOrganizationUuid } from '../user-store/selectors';
import { DataProcessingActions } from './actions';
import {
  selectDataProcessingExternalReferences,
  selectDataProcessingGridColumns,
  selectDataProcessingUuid,
  selectOverviewRoles,
} from './selectors';

@Injectable()
export class DataProcessingEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    @Inject(APIV2DataProcessingRegistrationService)
    private dataProcessingService: APIV2DataProcessingRegistrationService,
    @Inject(APIV2DataProcessingRegistrationInternalINTERNALService)
    private apiInternalDataProcessingRegistrationService: APIV2DataProcessingRegistrationInternalINTERNALService,
    private httpClient: HttpClient,
    private externalReferencesApiService: ExternalReferencesApiService,
    private statePersistingService: StatePersistingService,
    @Inject(APIV1DataProcessingRegistrationINTERNALService)
    private apiv1DataProcessingService: APIV1DataProcessingRegistrationINTERNALService,
    @Inject(APIV2OrganizationGridInternalINTERNALService)
    private apiV2organizationalGridInternalService: APIV2OrganizationGridInternalINTERNALService,
    private uiConfigService: UIConfigService
  ) {}

  getDataProcessing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.getDataProcessing),
      switchMap(({ dataProcessingUuid }) =>
        this.dataProcessingService
          .getSingleDataProcessingRegistrationV2GetDataProcessingRegistration({ uuid: dataProcessingUuid })
          .pipe(
            map((dataProcessing) => DataProcessingActions.getDataProcessingSuccess(dataProcessing)),
            catchError(() => of(DataProcessingActions.getDataProcessingError()))
          )
      )
    );
  });

  getDataProcessings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.getDataProcessings),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid), this.store.select(selectOverviewRoles)]),
      switchMap(([{ odataString }, organizationUuid, overviewRoles]) => {
        const fixedOdataString = applyQueryFixes(odataString, overviewRoles);
        return this.httpClient
          .get<OData>(
            `/odata/DataProcessingRegistrationReadModels?organizationUuid=${organizationUuid}&$expand=RoleAssignments&${fixedOdataString}&$count=true`
          )
          .pipe(
            map((data) =>
              DataProcessingActions.getDataProcessingsSuccess(
                compact(data.value.map(adaptDataProcessingRegistration)),
                data['@odata.count']
              )
            ),
            catchError(() => of(DataProcessingActions.getDataProcessingsError()))
          );
      })
    );
  });

  getDataProcessingOverviewRoles = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.getDataProcessingOverviewRoles),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([_, organizationUuid]) =>
        this.apiv1DataProcessingService
          .getSingleDataProcessingRegistrationGetDataProcessingRegistrationOptionsByUuid({ organizationUuid })
          .pipe(
            map((result) => DataProcessingActions.getDataProcessingOverviewRolesSuccess(result.response.roles)),
            catchError(() => of(DataProcessingActions.getDataProcessingCollectionPermissionsError()))
          )
      )
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.updateGridState),
      switchMap(({ gridState }) => of(DataProcessingActions.getDataProcessings(toODataString(gridState))))
    );
  });

  updateGridColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.updateGridColumns),
      concatLatestFrom(() => this.getUIConfigApplications()),
      map(([{ gridColumns }, uiConfigApplications]) => {
        gridColumns = this.uiConfigService.applyAllUIConfigToGridColumns(uiConfigApplications, gridColumns);

        this.statePersistingService.set(DATA_PROCESSING_COLUMNS_ID, gridColumns);
        return DataProcessingActions.updateGridColumnsSuccess(gridColumns);
      })
    );
  });

  updateGridColumnsAndRoleColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.updateGridColumnsAndRoleColumns),
      map(({ gridColumns, gridRoleColumns }) => {
        const allColumns = gridColumns.concat(gridRoleColumns);
        this.statePersistingService.set(DATA_PROCESSING_COLUMNS_ID, allColumns);
        return DataProcessingActions.updateGridColumnsAndRoleColumnsSuccess(allColumns);
      })
    );
  });

  deleteDataProcessing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.deleteDataProcessing),
      concatLatestFrom(() => this.store.select(selectDataProcessingUuid).pipe(filterNullish())),
      switchMap(([_, uuid]) =>
        this.dataProcessingService
          .deleteSingleDataProcessingRegistrationV2DeleteDataProcessingRegistration({ uuid })
          .pipe(
            map(() => DataProcessingActions.deleteDataProcessingSuccess()),
            catchError(() => of(DataProcessingActions.deleteDataProcessingError()))
          )
      )
    );
  });

  createDataProcessing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.createDataProcessing),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid)),
      switchMap(([{ name, openAfterCreate }, organizationUuid]) =>
        this.dataProcessingService
          .postSingleDataProcessingRegistrationV2PostDataProcessingRegistration({ request: { name, organizationUuid } })
          .pipe(
            map(({ uuid }) => DataProcessingActions.createDataProcessingSuccess(uuid, openAfterCreate)),
            catchError(() => of(DataProcessingActions.createDataProcessingError()))
          )
      )
    );
  });

  getDataProcessingPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.getDataProcessingPermissions),
      switchMap(({ dataProcessingUuid }) =>
        this.dataProcessingService
          .getSingleDataProcessingRegistrationV2GetDataProcessingRegistrationPermissions({
            dprUuid: dataProcessingUuid,
          })
          .pipe(
            map((permissions) => DataProcessingActions.getDataProcessingPermissionsSuccess(permissions)),
            catchError(() => of(DataProcessingActions.getDataProcessingPermissionsError()))
          )
      )
    );
  });

  getDataProcessingCollectionPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.getDataProcessingCollectionPermissions),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([_, organizationUuid]) =>
        this.dataProcessingService
          .getSingleDataProcessingRegistrationV2GetDataProcessingRegistrationCollectionPermissions({ organizationUuid })
          .pipe(
            map((collectionPermissions) =>
              DataProcessingActions.getDataProcessingCollectionPermissionsSuccess(collectionPermissions)
            ),
            catchError(() => of(DataProcessingActions.getDataProcessingCollectionPermissionsError()))
          )
      )
    );
  });

  patchDataProcessing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.patchDataProcessing),
      combineLatestWith(this.store.select(selectDataProcessingUuid).pipe(filterNullish())),
      switchMap(([{ dataProcessing }, uuid]) =>
        this.dataProcessingService
          .patchSingleDataProcessingRegistrationV2PatchDataProcessingRegistration({ uuid, request: dataProcessing })
          .pipe(
            map((data) => DataProcessingActions.patchDataProcessingSuccess(data)),
            catchError(() => of(DataProcessingActions.patchDataProcessingError()))
          )
      )
    );
  });

  addDataProcessingThirdCountry$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.addDataProcessingThirdCountry),
      switchMap(({ country, existingCountries }) => {
        const countries = existingCountries ? [...existingCountries] : [];
        countries.push(country);
        const countryUuids = countries.map((country) => country.uuid);
        const transferToInsecureThirdCountries =
          APIDataProcessingRegistrationGeneralDataWriteRequestDTO.TransferToInsecureThirdCountriesEnum.Yes;
        return of(
          DataProcessingActions.patchDataProcessing({
            general: { transferToInsecureThirdCountries, insecureCountriesSubjectToDataTransferUuids: countryUuids },
          })
        );
      })
    );
  });

  removeDataProcessingThirdCountry$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.deleteDataProcessingThirdCountry),
      switchMap(({ countryUuid, existingCountries }) => {
        const countries = existingCountries ? [...existingCountries] : [];
        const listWithoutCountry = countries
          .filter((country) => country.uuid !== countryUuid)
          .map((country) => country.uuid);
        const transferToInsecureThirdCountries =
          listWithoutCountry.length > 0
            ? 'Yes'
            : ('No' as APIDataProcessingRegistrationGeneralDataWriteRequestDTO.TransferToInsecureThirdCountriesEnum);
        return of(
          DataProcessingActions.patchDataProcessing({
            general: {
              transferToInsecureThirdCountries,
              insecureCountriesSubjectToDataTransferUuids: listWithoutCountry,
            },
          })
        );
      })
    );
  });

  addDataProcessingProcessor$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.addDataProcessingProcessor),
      switchMap(({ processor, existingProcessors }) => {
        const processors = existingProcessors ? [...existingProcessors] : [];
        processors.push(processor);
        const processorUuids = processors.map((processor) => processor.uuid);
        return of(DataProcessingActions.patchDataProcessing({ general: { dataProcessorUuids: processorUuids } }));
      })
    );
  });

  removeDataProcessingProcessor$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.deleteDataProcessingProcessor),
      switchMap(({ processorUuid, existingProcessors }) => {
        const processors = existingProcessors ? [...existingProcessors] : [];
        const listWithoutProcessor = processors
          .filter((processor) => processor.uuid !== processorUuid)
          .map((processor) => processor.uuid);
        return of(DataProcessingActions.patchDataProcessing({ general: { dataProcessorUuids: listWithoutProcessor } }));
      })
    );
  });

  addDataProcessingSubProcessor$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.addDataProcessingSubProcessor),
      switchMap(({ subprocessor, existingSubProcessors }) => {
        const subProcessors = existingSubProcessors ? [...existingSubProcessors] : [];
        const mappedSubProcessors = mapSubDataProcessors(subProcessors);
        const hasSubDataProcessors =
          APIDataProcessingRegistrationGeneralDataWriteRequestDTO.HasSubDataProcessorsEnum.Yes;
        mappedSubProcessors.push(subprocessor);
        return of(
          DataProcessingActions.patchDataProcessing({
            general: { hasSubDataProcessors, subDataProcessors: mappedSubProcessors },
          })
        );
      })
    );
  });

  removeDataProcessingSubProcessor$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.deleteDataProcessingSubProcessor),
      switchMap(({ subProcessorUuid, existingSubProcessors }) => {
        const subProcessors = existingSubProcessors ? [...existingSubProcessors] : [];
        const listWithoutSubProcessor = subProcessors.filter(
          (subprocessor) => subprocessor.dataProcessorOrganization.uuid !== subProcessorUuid
        );
        const mappedSubProcessors = mapSubDataProcessors(listWithoutSubProcessor);
        const hasSubDataProcessors =
          mappedSubProcessors.length > 0
            ? 'Yes'
            : ('No' as APIDataProcessingRegistrationGeneralDataWriteRequestDTO.HasSubDataProcessorsEnum);
        return of(
          DataProcessingActions.patchDataProcessing({
            general: { hasSubDataProcessors, subDataProcessors: mappedSubProcessors },
          })
        );
      })
    );
  });

  patchDataProcessingSubProcessor$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.patchDataProcessingSubProcessor),
      switchMap(({ subprocessor, existingSubProcessors }) => {
        const subProcessors = existingSubProcessors ? [...existingSubProcessors] : [];
        const listWithoutSubProcessor = subProcessors.filter(
          (subprocessorToFilter) =>
            subprocessorToFilter.dataProcessorOrganization.uuid !== subprocessor.dataProcessorOrganizationUuid
        );
        const mappedSubProcessors = mapSubDataProcessors(listWithoutSubProcessor);
        mappedSubProcessors.push(subprocessor);
        return of(DataProcessingActions.patchDataProcessing({ general: { subDataProcessors: mappedSubProcessors } }));
      })
    );
  });

  addDataProcessingSystemUsage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.addDataProcessingSystemUsage),
      switchMap(({ systemUsageUuid, existingSystemUsageUuids }) => {
        const systemUsageUuids = existingSystemUsageUuids ? [...existingSystemUsageUuids] : [];
        systemUsageUuids.push(systemUsageUuid);
        return of(DataProcessingActions.patchDataProcessing({ systemUsageUuids: systemUsageUuids }));
      })
    );
  });

  deleteDataProcessingSystemUsage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.deleteDataProcessingSystemUsage),
      switchMap(({ systemUsageUuid, existingSystemUsageUuids }) => {
        const systemUsageUuids = existingSystemUsageUuids ? [...existingSystemUsageUuids] : [];
        const listWithoutSystemUsage = systemUsageUuids.filter((usage) => usage !== systemUsageUuid);
        return of(DataProcessingActions.patchDataProcessing({ systemUsageUuids: listWithoutSystemUsage }));
      })
    );
  });

  addDataProcessingRole$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.addDataProcessingRole),
      concatLatestFrom(() => this.store.select(selectDataProcessingUuid).pipe(filterNullish())),
      mergeMap(([{ userUuid, roleUuid }, dprUuid]) =>
        this.apiInternalDataProcessingRegistrationService
          .patchSingleDataProcessingRegistrationInternalV2PatchAddRoleAssignment({
            dprUuid: dprUuid,
            request: { userUuid: userUuid, roleUuid: roleUuid },
          })
          .pipe(
            map((role) => DataProcessingActions.addDataProcessingRoleSuccess(role)),
            catchError(() => of(DataProcessingActions.addDataProcessingRoleError()))
          )
      )
    );
  });

  removeDataProcessingRole$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.removeDataProcessingRole),
      mergeMap(({ userUuid, roleUuid, dataProcessingUuid }) =>
        this.apiInternalDataProcessingRegistrationService
          .patchSingleDataProcessingRegistrationInternalV2PatchRemoveRoleAssignment({
            dprUuid: dataProcessingUuid,
            request: { userUuid: userUuid, roleUuid: roleUuid },
          })
          .pipe(
            map((usage) =>
              DataProcessingActions.removeDataProcessingRoleSuccess(usage, userUuid, roleUuid, dataProcessingUuid)
            ),
            catchError(() => of(DataProcessingActions.removeDataProcessingRoleError()))
          )
      )
    );
  });

  addExternalReference$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.addExternalReference),
      concatLatestFrom(() => [
        this.store.select(selectDataProcessingExternalReferences),
        this.store.select(selectDataProcessingUuid),
      ]),
      mergeMap(([newExternalReference, externalReferences, dprUuid]) => {
        return this.externalReferencesApiService
          .addExternalReference<APIDataProcessingRegistrationResponseDTO>(
            newExternalReference.externalReference,
            externalReferences,
            dprUuid,
            'data-processing-registration'
          )
          .pipe(
            map((response) => DataProcessingActions.addExternalReferenceSuccess(response)),
            catchError(() => of(DataProcessingActions.addExternalReferenceError()))
          );
      })
    );
  });

  editExternalReference$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.editExternalReference),
      concatLatestFrom(() => [
        this.store.select(selectDataProcessingExternalReferences),
        this.store.select(selectDataProcessingUuid),
      ]),
      mergeMap(([editData, externalReferences, dprUuid]) => {
        return this.externalReferencesApiService
          .editExternalReference<APIDataProcessingRegistrationResponseDTO>(
            editData,
            externalReferences,
            dprUuid,
            'data-processing-registration'
          )
          .pipe(
            map((response) => DataProcessingActions.editExternalReferenceSuccess(response)),
            catchError(() => of(DataProcessingActions.editExternalReferenceError()))
          );
      })
    );
  });

  removeExternalReference$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.removeExternalReference),
      concatLatestFrom(() => [
        this.store.select(selectDataProcessingExternalReferences),
        this.store.select(selectDataProcessingUuid),
      ]),
      mergeMap(([referenceUuid, externalReferences, dprUuid]) => {
        return this.externalReferencesApiService
          .deleteExternalReference<APIDataProcessingRegistrationResponseDTO>(
            referenceUuid.referenceUuid,
            externalReferences,
            dprUuid,
            'data-processing-registration'
          )
          .pipe(
            map((response) => DataProcessingActions.removeExternalReferenceSuccess(response)),
            catchError(() => of(DataProcessingActions.removeExternalReferenceError()))
          );
      })
    );
  });

  addDataProcessingOversightOption$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.addDataProcessingOversightOption),
      switchMap(({ oversight, existingOversights }) => {
        const oversights = existingOversights ? [...existingOversights] : [];
        oversights.push(oversight);
        const request = { oversight: { oversightOptionUuids: oversights.map((option) => option.uuid) } };
        return of(DataProcessingActions.patchDataProcessing(request));
      })
    );
  });

  removeDataProcessingOversightOption$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.removeDataProcessingOversightOption),
      switchMap(({ oversightUuid, existingOversights }) => {
        const oversights = existingOversights ? [...existingOversights] : [];
        const listWithoutOversight = oversights.filter((oversight) => oversight.uuid !== oversightUuid);
        const request = { oversight: { oversightOptionUuids: listWithoutOversight.map((option) => option.uuid) } };
        return of(DataProcessingActions.patchDataProcessing(request));
      })
    );
  });

  addDataProcessingOversightDate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.addDataProcessingOversightDate),
      switchMap(({ oversightDate, existingOversightDates }) => {
        const oversightDates = existingOversightDates ? [...existingOversightDates] : [];
        oversightDates.push(oversightDate);
        const request = {
          oversight: {
            oversightDates: oversightDates,
            isOversightCompleted: APIDataProcessingRegistrationOversightWriteRequestDTO.IsOversightCompletedEnum.Yes,
          },
        };
        return of(DataProcessingActions.patchDataProcessing(request));
      })
    );
  });

  removeDataProcessingOversightDate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.removeDataProcessingOversightDate),
      switchMap(({ oversightDateUuid, existingOversightDates }) => {
        const oversightDates = existingOversightDates ? [...existingOversightDates] : [];
        const listWithoutSupervision = oversightDates.filter(
          (oversightDate) => oversightDate.uuid !== oversightDateUuid
        );
        return of(
          DataProcessingActions.patchDataProcessing({
            oversight: {
              oversightDates: listWithoutSupervision.map((oversightDate) => ({
                completedAt: oversightDate.completedAt,
                remark: oversightDate.remark,
              })),
              isOversightCompleted:
                listWithoutSupervision.length === 0
                  ? APIDataProcessingRegistrationOversightWriteRequestDTO.IsOversightCompletedEnum.No
                  : APIDataProcessingRegistrationOversightWriteRequestDTO.IsOversightCompletedEnum.Yes,
            },
          })
        );
      })
    );
  });

  patchDataProcessingOversightDate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.patchDataProcessingOversightDate),
      switchMap(({ oversightDate, existingOversightDates }) => {
        const oversightDates = existingOversightDates ? [...existingOversightDates] : [];
        const listWithoutSupervision = oversightDates.filter(
          (oversightDateToFilter) => oversightDateToFilter.uuid !== oversightDate.uuid
        );
        listWithoutSupervision.push(oversightDate);
        return of(
          DataProcessingActions.patchDataProcessing({
            oversight: {
              oversightDates: listWithoutSupervision.map((oversightDate) => ({
                completedAt: oversightDate.completedAt,
                remark: oversightDate.remark,
              })),
              isOversightCompleted: APIDataProcessingRegistrationOversightWriteRequestDTO.IsOversightCompletedEnum.Yes,
            },
          })
        );
      })
    );
  });

  saveOrganizationalDataProcessingColumnConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.saveOrganizationalDataProcessingColumnConfiguration),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([{ columnConfig }, organizationUuid]) =>
        this.apiV2organizationalGridInternalService
          .postSingleOrganizationGridInternalV2SaveGridConfiguration({
            organizationUuid,
            overviewType: 'DataProcessingRegistration',
            config: {
              visibleColumns: columnConfig,
            },
          })
          .pipe(
            map(() => DataProcessingActions.saveOrganizationalDataProcessingColumnConfigurationSuccess()),
            catchError(() => of(DataProcessingActions.saveOrganizationalDataProcessingColumnConfigurationError()))
          )
      )
    );
  });

  deleteOrganizationalDataProcessingColumnConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.deleteOrganizationalDataProcessingColumnConfiguration),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([_, organizationUuid]) =>
        this.apiV2organizationalGridInternalService
          .deleteSingleOrganizationGridInternalV2DeleteGridConfiguration({
            organizationUuid,
            overviewType: 'DataProcessingRegistration',
          })
          .pipe(
            map(() => DataProcessingActions.deleteOrganizationalDataProcessingColumnConfigurationSuccess()),
            catchError(() => of(DataProcessingActions.deleteOrganizationalDataProcessingColumnConfigurationError()))
          )
      )
    );
  });

  resetToOrganizationalDataProcessingColumnConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.resetToOrganizationDataProcessingColumnConfiguration),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([_, organizationUuid]) =>
        this.apiV2organizationalGridInternalService
          .getSingleOrganizationGridInternalV2GetGridConfiguration({
            organizationUuid,
            overviewType: 'DataProcessingRegistration',
          })
          .pipe(
            map((response) =>
              DataProcessingActions.resetToOrganizationDataProcessingColumnConfigurationSuccess(response)
            ),
            catchError(() => of(DataProcessingActions.resetToOrganizationDataProcessingColumnConfigurationError()))
          )
      )
    );
  });

  resetToOrganizationDataProcessingColumnConfigurationSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.resetToOrganizationDataProcessingColumnConfigurationSuccess),
      concatLatestFrom(() => [this.store.select(selectDataProcessingGridColumns)]),
      map(([{ response }, columns]) => {
        const configColumns = response?.visibleColumns;
        if (!configColumns) return DataProcessingActions.resetToOrganizationDataProcessingColumnConfigurationError();
        const newColumns = getNewGridColumnsBasedOnConfig(configColumns, columns);
        return DataProcessingActions.updateGridColumns(newColumns);
      })
    );
  });

  initializeDataProcessingLastSeenGridConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.initializeDataProcessingLastSeenGridConfiguration),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([_, organizationUuid]) =>
        this.apiV2organizationalGridInternalService
          .getSingleOrganizationGridInternalV2GetGridConfiguration({
            organizationUuid,
            overviewType: 'DataProcessingRegistration',
          })
          .pipe(
            map((response) => DataProcessingActions.initializeDataProcessingLastSeenGridConfigurationSuccess(response)),
            catchError(() => of(DataProcessingActions.initializeDataProcessingLastSeenGridConfigurationError()))
          )
      )
    );
  });

  private getUIConfigApplications(): Observable<UIConfigGridApplication[]> {
    const mainContract$ = this.store.select(selectDprEnableMainContract);
    const dprRolesEnabled$ = this.store.select(selectDprEnableRoles);

    return combineLatest([mainContract$, dprRolesEnabled$]).pipe(
      map(([mainContractEnabled, dprRolesEnabled]): UIConfigGridApplication[] => {
        return [
          {
            shouldEnable: mainContractEnabled,
            columnNamesToConfigure: [GridFields.ActiveAccordingToMainContract],
          },
          {
            shouldEnable: dprRolesEnabled,
            columnNamesToConfigure: [],
            columnNameSubstringsToConfigure: ['Roles.Role']
          }
        ];
      })
    );
  }
}

function mapSubDataProcessors(
  subProcessors: APIDataProcessorRegistrationSubDataProcessorResponseDTO[]
): APIDataProcessorRegistrationSubDataProcessorWriteRequestDTO[] {
  return subProcessors.map(
    (subprocessor) =>
      ({
        dataProcessorOrganizationUuid: subprocessor.dataProcessorOrganization.uuid,
        basisForTransferUuid: subprocessor.basisForTransfer?.uuid,
        transferToInsecureThirdCountry: subprocessor.transferToInsecureThirdCountry,
        insecureThirdCountrySubjectToDataProcessingUuid: subprocessor.insecureThirdCountrySubjectToDataProcessing?.uuid,
      } as APIDataProcessorRegistrationSubDataProcessorWriteRequestDTO)
  );
}

function applyQueryFixes(odataString: string, systemRoles: APIBusinessRoleDTO[] | undefined) {
  let fixedOdataString = odataString;

  systemRoles?.forEach((role) => {
    fixedOdataString = fixedOdataString
      .replace(
        new RegExp(`(\\w+\\()Roles[./]Role${role.id}(,.*?\\))`, 'i'),
        `RoleAssignments/any(c: $1c/UserFullName$2 and c/RoleId eq ${role.id})`
      )
      .replace(/BasisForTransferUuid eq '([\w-]+)'/, 'BasisForTransferUuid eq $1')
      .replace(/DataResponsibleUuid eq '([\w-]+)'/, 'DataResponsibleUuid eq $1')
      .replace(/OversightOptionNamesAsCsv eq '([^']*)'/, "contains(OversightOptionNamesAsCsv, '$1')");
  });

  return fixedOdataString;
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, combineLatestWith, map, of, switchMap } from 'rxjs';
import {
  APIDataProcessorRegistrationSubDataProcessorResponseDTO,
  APIDataProcessorRegistrationSubDataProcessorWriteRequestDTO,
  APIV2DataProcessingRegistrationService,
} from 'src/app/api/v2';
import { adaptDataProcessingRegistration } from 'src/app/shared/models/data-processing/data-processing.model';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { OData } from 'src/app/shared/models/odata.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../user-store/selectors';
import { DataProcessingActions } from './actions';
import { selectDataProcessingUuid } from './selectors';

@Injectable()
export class DataProcessingEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private dataProcessingService: APIV2DataProcessingRegistrationService,
    private httpClient: HttpClient
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
      concatLatestFrom(() => this.store.select(selectOrganizationUuid)),
      switchMap(([odataString, organizationUuid]) =>
        this.httpClient
          .get<OData>(
            `/odata/DataProcessingRegistrationReadModels?organizationUuid=${organizationUuid}&${odataString.odataString}`
          )
          .pipe(
            map((data) =>
              DataProcessingActions.getDataProcessingsSuccess(
                compact(data.value.map(adaptDataProcessingRegistration)),
                data['@odata.count']
              )
            ),
            catchError(() => of(DataProcessingActions.getDataProcessingsError()))
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
        return of(
          DataProcessingActions.patchDataProcessing({
            general: { insecureCountriesSubjectToDataTransferUuids: countryUuids },
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
        return of(
          DataProcessingActions.patchDataProcessing({
            general: { insecureCountriesSubjectToDataTransferUuids: listWithoutCountry },
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
        mappedSubProcessors.push(subprocessor);
        return of(DataProcessingActions.patchDataProcessing({ general: { subDataProcessors: mappedSubProcessors } }));
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
        return of(DataProcessingActions.patchDataProcessing({ general: { subDataProcessors: mappedSubProcessors } }));
      })
    );
  });
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

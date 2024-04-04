import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2ItContractService } from 'src/app/api/v2';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITContract } from 'src/app/shared/models/it-contract/it-contract.model';
import { OData } from 'src/app/shared/models/odata.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ITContractActions } from './actions';
import { selectItContractSystemAgreementElements, selectItContractUuid } from './selectors';

@Injectable()
export class ITContractEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private apiItContractService: APIV2ItContractService,
    private httpClient: HttpClient
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
      switchMap(([{ agreementElement }, contractUuid, agreementElements]) => {
        if (!contractUuid) return of(ITContractActions.addITContractSystemAgreementElementError());

        agreementElements.push(agreementElement);

        return this.apiItContractService
          .patchSingleItContractV2PatchItContract({ contractUuid, request: { general: { agreementElements } } })
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

        return this.apiItContractService
          .patchSingleItContractV2PatchItContract({ contractUuid, request: { general: { filteredElements } } })
          .pipe(
            map((response) => ITContractActions.removeITContractSystemAgreementElementSuccess(response)),
            catchError(() => of(ITContractActions.removeITContractSystemAgreementElementError()))
          );
      })
    );
  });
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, of, switchMap } from 'rxjs';
import { CONTRACT_SUPPLIERS_COLUMNS_ID } from 'src/app/shared/constants/persistent-state-constants';
import { adaptITContractSupplier } from 'src/app/shared/models/it-contract/it-contract-supplier.model';
import { OData } from 'src/app/shared/models/odata.model';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { GridDataCacheService } from 'src/app/shared/services/grid-data-cache.service';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { ITContractSupplierActions } from './actions';
import { selectSupplierPreviousGridState } from './selectors';

@Injectable()
export class ITContractSupplierEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private gridDataCacheService: GridDataCacheService,
    private httpClient: HttpClient,
    private gridColumnStorageService: GridColumnStorageService,
  ) {}

  getSuppliers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractSupplierActions.getSuppliers),
      concatLatestFrom(() => [
        this.store.select(selectSupplierPreviousGridState),
        this.store.select(selectOrganizationUuid),
      ]),
      switchMap(([{ gridState }, previousGridState, organizationUuid]) => {
        this.gridDataCacheService.tryResetOnGridStateChange(gridState, previousGridState);

        const cachedRange = this.gridDataCacheService.get(gridState);
        if (cachedRange.data !== undefined) {
          return of(ITContractSupplierActions.getSuppliersSuccess(cachedRange.data, cachedRange.total));
        }

        const cacheableOdataString = this.gridDataCacheService.toChunkedODataString(gridState);
        const fixedOdataString = applyQueryFixes(cacheableOdataString);
        return this.httpClient
          .get<OData>(
            `/odata/ItContractSupplierOverviewReadModels?organizationUuid=${organizationUuid}&$expand=Organization($select=Name,Uuid),ContractsAtHighestCriticality($select=ContractUuid,ContractName)&${fixedOdataString}&$count=true`,
          )
          .pipe(
            map((data) => {
              const suppliers = compact(data.value.map(adaptITContractSupplier));
              const total = data['@odata.count'];
              this.gridDataCacheService.set(gridState, suppliers, total);

              const returnData = this.gridDataCacheService.gridStateSliceFromArray(suppliers, gridState);
              return ITContractSupplierActions.getSuppliersSuccess(returnData, total);
            }),
            catchError(() => of(ITContractSupplierActions.getSuppliersError())),
          );
      }),
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractSupplierActions.updateGridState),
      map(({ gridState }) => ITContractSupplierActions.getSuppliers(gridState)),
    );
  });

  updateGridColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractSupplierActions.updateGridColumns),
      map(({ gridColumns }) => {
        this.gridColumnStorageService.setColumns(CONTRACT_SUPPLIERS_COLUMNS_ID, gridColumns);
        return ITContractSupplierActions.updateGridColumnsSuccess(gridColumns);
      }),
    );
  });
}

function applyQueryFixes(odataString: string) {
  return odataString
    .replace(/HighestCriticalityUuid eq '([\w-]+)'/, 'HighestCriticalityUuid eq $1')
    .replace(
      /contains\(ContractsAtHighestCriticality,\s*([^)]*)\)/g,
      'ContractsAtHighestCriticality/any(c: contains(c/ContractName,$1))',
    );
}

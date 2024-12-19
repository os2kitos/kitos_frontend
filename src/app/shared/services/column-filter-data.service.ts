import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { selectAppliedProcurementPlans } from 'src/app/store/it-contract/selectors';
import { FilterDropdownOption } from '../components/grid/dropdown-filter/dropdown-filter.component';
import { formatProcurementPlan } from '../helpers/procurement-plan.helpers';
import { filterNullish } from '../pipes/filter-nullish';

/**
 * The purpose of ths service is to provide a key-value store for observables.
 * Kendo grid do not allow to pass observables through the gridColumns, so we can instead provide them here.
 */
@Injectable({ providedIn: 'root' })
export class ColumnFilterDataService {
  constructor(private store: Store) {}

  public get(key: GridDataKey): Observable<FilterDropdownOption[]> {
    switch (key) {
      case GridDataKey.appliedProcurementPlans:
        return this.store.select(selectAppliedProcurementPlans).pipe(
          filterNullish(),
          map((plans) => plans.map((plan) => formatProcurementPlan(plan.year, plan.quarter))),
          map((plans) => plans.map((plan) => ({ name: plan, value: plan })))
        );
    }
  }
}

export enum GridDataKey {
  appliedProcurementPlans = 'appliedProcurementPlans',
}

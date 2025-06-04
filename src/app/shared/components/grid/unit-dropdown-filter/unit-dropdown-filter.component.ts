import { Component, Input, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { first } from 'rxjs';
import { initializeApplyFilterSubscription } from 'src/app/shared/helpers/grid-filter.helpers';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { createNode, TreeNodeModel } from 'src/app/shared/models/tree-node.model';
import { selectPagedOrganizationUnits } from 'src/app/store/organization/organization-unit/selectors';
import { OrgUnitSelectComponent } from '../../org-unit-select/org-unit-select.component';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';

@Component({
  selector: 'app-unit-dropdown-filter',
  templateUrl: './unit-dropdown-filter.component.html',
  styleUrl: './unit-dropdown-filter.component.scss',
  imports: [OrgUnitSelectComponent],
})
export class UnitDropdownFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  @Input() entityType!: RegistrationEntityTypes;

  public chosenOption?: TreeNodeModel;

  public readonly units$ = this.store.select(selectPagedOrganizationUnits);

  constructor(filterService: FilterService, private actions$: Actions, private store: Store) {
    super(filterService);
  }

  ngOnInit(): void {
    this.updateMethod(this.getColumnFilter() ?? undefined);

    this.subscriptions.add(
      initializeApplyFilterSubscription(this.actions$, this.entityType, this.column.field, this.updateMethod.bind(this))
    );
  }

  private updateMethod(filter: FilterDescriptor | undefined): void {
    this.subscriptions.add(
      this.units$.pipe(first()).subscribe((units) => {
        const matchingUnit = units?.find((unit) => unit.uuid === filter?.value);
        this.chosenOption = matchingUnit ? createNode(matchingUnit) : undefined;
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public didChange(option?: any): void {
    this.applyFilter(
      option === undefined || option === null
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'eq',
            value: option.id,
          })
    );
  }
}

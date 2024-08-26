import { Component, Input, OnInit } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor, isCompositeFilterDescriptor } from '@progress/kendo-data-query';
import { TreeNodeModel } from 'src/app/shared/models/tree-node.model';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { Actions, ofType } from '@ngrx/effects';
import { getApplyFilterAction } from '../../filter-options-button/filter-options-button.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-unit-dropdown-filter',
  templateUrl: './unit-dropdown-filter.component.html',
  styleUrl: './unit-dropdown-filter.component.scss',
})
export class UnitDropdownFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  @Input() entityType!: RegistrationEntityTypes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  public chosenOption?: TreeNodeModel;

  constructor(filterService: FilterService, private actions$: Actions) {
    super(filterService);
  }

  ngOnInit(): void {
    this.chosenOption = this.getColumnFilter()?.value;

    this.actions$
      .pipe(
        ofType(getApplyFilterAction(this.entityType)),
        map((action) => action.state.filter)
      )
      .subscribe((compFilter) => {
        if (!compFilter) return;
        const matchingFilter = compFilter.filters.find((filter) => !isCompositeFilterDescriptor(filter) && filter.field === this.column.field) as FilterDescriptor | undefined;
        const newValue = matchingFilter?.value;
        const newOption = newValue as TreeNodeModel;
        this.chosenOption = newOption;
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public didChange(option?: any): void {
    this.applyFilter(
      option === undefined || option === null
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'eq',
            value: option.name,
          })
    );
  }
}

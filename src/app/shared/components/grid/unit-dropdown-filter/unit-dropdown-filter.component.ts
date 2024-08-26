import { Component, Input, OnInit } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { TreeNodeModel } from 'src/app/shared/models/tree-node.model';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { Actions } from '@ngrx/effects';
import { initializeApplyFilterSubscription } from '../../filter-options-button/filter-options-button.component';

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

    const updateMethod: (filter: FilterDescriptor | undefined) => void = (filter) => {
      const newValue = filter?.value;
        const newOption = newValue as TreeNodeModel;
        this.chosenOption = newOption;
    };

    initializeApplyFilterSubscription(this.actions$, this.entityType, this.column.field, updateMethod);

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

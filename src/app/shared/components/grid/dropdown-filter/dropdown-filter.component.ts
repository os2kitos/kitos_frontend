import { Component, Input, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { initializeApplyFilterSubscription } from 'src/app/shared/helpers/grid-filter.helpers';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';

export interface FilterDropdownOption {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

@Component({
  selector: 'app-dropdown-filter',
  templateUrl: './dropdown-filter.component.html',
  styleUrl: './dropdown-filter.component.scss',
})
export class DropdownFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  @Input() public entityType!: RegistrationEntityTypes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() options!: FilterDropdownOption[];
  @Input() searchByNames = false;

  public chosenOption?: FilterDropdownOption;

  constructor(filterService: FilterService, private actions$: Actions) {
    super(filterService);
  }

  ngOnInit(): void {
    const value = this.getColumnFilter()?.value;
    this.chosenOption = this.options.find((option) => option.value === value);

    const updateMethod: (filter: FilterDescriptor | undefined) => void = (filter) => {
      const newValue = filter?.value;
      const newOption = this.options.find((option) => option.value === newValue);
      this.chosenOption = newOption;
    };

    if (this.entityType) {
      initializeApplyFilterSubscription(this.actions$, this.entityType, this.column.field, updateMethod);
    }
  }

  public didChange(option?: FilterDropdownOption | null): void {
    this.applyFilter(
      option === undefined || option === null
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'eq',
            value: this.searchByNames === false ? (option.value as number) : option.name,
          })
    );
  }
}

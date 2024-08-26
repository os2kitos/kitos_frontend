import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { Actions } from '@ngrx/effects';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { initializeApplyFilterSubscription } from '../../filter-options-button/filter-options-button.component';
import { NumericInputComponent } from '../../numeric-input/numeric-input.component';

@Component({
  selector: 'app-numeric-filter',
  templateUrl: './numeric-filter.component.html',
  styleUrl: './numeric-filter.component.scss',
})
export class NumericFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @ViewChild(NumericInputComponent) public numericInput!: NumericInputComponent;
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  @Input() public entityType!: RegistrationEntityTypes;

  public value: number | undefined = undefined;

  constructor(filterService: FilterService, private actions$: Actions) {
    super(filterService);
  }

  ngOnInit(): void {
    this.value = this.getColumnFilter()?.value ?? undefined;

    const updateMethod: (filter: FilterDescriptor | undefined) => void = (filter) => {
      this.value = filter ? filter.value as number : undefined;
    };

    initializeApplyFilterSubscription(this.actions$, this.entityType, this.column.field, updateMethod);
  }

  public valueChange(value: string) {
    this.applyFilter(
      !value
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'eq',
            value: value,
          })
    );
  }
}

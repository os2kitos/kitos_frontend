import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, isCompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { Actions, ofType } from '@ngrx/effects';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { getApplyFilterAction } from '../../filter-options-button/filter-options-button.component';
import { map } from 'rxjs';
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

    this.actions$
      .pipe(
        ofType(getApplyFilterAction(this.entityType)),
        map((action) => action.state.filter)
      )
      .subscribe((compFilter) => {
        if (!compFilter) return;
        const matchingFilter = compFilter.filters.find(
          (filter) => !isCompositeFilterDescriptor(filter) && filter.field === this.column.field
        );
        //Don't think it can be a Composite filter ever for the grids we have, but the check satisfies TS
        if (!matchingFilter || isCompositeFilterDescriptor(matchingFilter)) {
          this.numericInput.clear();
          return;
        }
        this.valueChange(matchingFilter.value as string);
      });
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
    this.value = (value as unknown) as number;
  }
}

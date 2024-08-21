import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, isCompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { Actions, ofType } from '@ngrx/effects';
import { getApplyFilterAction } from '../../filter-options-button/filter-options-button.component';
import { map } from 'rxjs';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { DropdownComponent } from '../../dropdowns/dropdown/dropdown.component';

export interface DropdownOption {
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
  @ViewChild(DropdownComponent) public dropdown!: DropdownComponent<DropdownOption>;
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  @Input() public entityType!: RegistrationEntityTypes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() options!: DropdownOption[];

  public chosenOption?: DropdownOption;

  constructor(filterService: FilterService, private actions$: Actions) {
    super(filterService);
  }

  ngOnInit(): void {
    const value = this.getColumnFilter()?.value;
    this.chosenOption = this.options.find((option) => option.value === value);
    console.log(this.options);

    this.actions$
      .pipe(
        ofType(getApplyFilterAction(this.entityType)),
        map((action) => action.state.filter)
      )
      .subscribe((compFilter) => {
        if (!compFilter) return;
        const matchingFilter = compFilter.filters.find((filter) => !isCompositeFilterDescriptor(filter) && filter.field === this.column.field);
        //Don't think it can be a Composite filter ever for the grids we have, but the check satisfies TS
        if (!matchingFilter || isCompositeFilterDescriptor(matchingFilter)) {
          //this.dropdown.internalClear();
          return;
        }
        const newValue = matchingFilter.value as number;
        this.chosenOption = this.options.find((option) => option.value === newValue);
        if (!this.chosenOption) return;
        this.dropdown.set(this.chosenOption);
        this.didChange(this.chosenOption);
      });
  }

  public didChange(option?: DropdownOption | null): void {
    this.applyFilter(
      option === undefined || option === null
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'eq',
            value: option.value as number,
          })
    );
  }
}

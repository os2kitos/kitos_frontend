import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { first, Observable } from 'rxjs';
import { initializeApplyFilterSubscription } from 'src/app/shared/helpers/grid-filter.helpers';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { ColumnFilterDataService, GridDataKey } from 'src/app/shared/services/column-filter-data.service';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { DropdownFilterComponent, FilterDropdownOption } from '../dropdown-filter/dropdown-filter.component';

@Component({
  selector: 'app-dropdown-column-data-filter',
  templateUrl: './dropdown-column-data-filter.component.html',
  styleUrl: './dropdown-column-data-filter.component.scss',
})
export class DropdownColumnDataFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @ViewChild(DropdownFilterComponent) dropdownFilter!: DropdownFilterComponent;
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  @Input() columnName!: string;
  @Input() serviceKey!: GridDataKey;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() entityType!: RegistrationEntityTypes;

  public options$!: Observable<FilterDropdownOption[]>;

  constructor(
    filterService: FilterService,
    private actions$: Actions,
    private columnFilterDataService: ColumnFilterDataService
  ) {
    super(filterService);
  }

  ngOnInit(): void {
    this.options$ = this.columnFilterDataService.get(this.serviceKey);

    const updateMethod: (filter: FilterDescriptor | undefined) => void = (filter) => {
      this.options$.pipe(first()).subscribe((options) => {
        const newValue = filter?.value;
        const newOption = options.find((option) => option.value === newValue);
        this.dropdownFilter.chosenOption = newOption;
      });
    };
    initializeApplyFilterSubscription(this.actions$, this.entityType, this.column.field, updateMethod);
  }
}

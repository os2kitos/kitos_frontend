import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ColumnComponent, FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { first, Observable } from 'rxjs';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { DropdownFilterComponent, DropdownOption } from '../dropdown-filter/dropdown-filter.component';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { initializeApplyFilterSubscription } from '../../filter-options-button/filter-options-button.component';
import { Actions, ofType } from '@ngrx/effects';
import { GridSavedFilterActions } from 'src/app/store/grid/actions';
import { Store } from '@ngrx/store';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() data$!: Observable<GridDataResult | null>;
  @Input() options: DropdownOption[] = [];
  @Input() entityType!: RegistrationEntityTypes;

  constructor(filterService: FilterService, private actions$: Actions, private store: Store) {
    super(filterService);
  }

  ngOnInit(): void {
    this.data$.subscribe((gridData) => {
      const dataObject = gridData?.data as object[];
      const possibleOptions: string[] = [];
      dataObject.forEach((data) => {
        const columnData = this.getProperty(data, this.columnName as keyof typeof data);
        possibleOptions.push(columnData);
      });
      const uniqueOptions = Array.from(new Set(possibleOptions)).filter((option) => option);
      this.options = uniqueOptions.map((option) => ({ name: option, value: option } as DropdownOption));
      this.store.dispatch(GridSavedFilterActions.dropdownDataOptionsUpdated(this.columnName, this.entityType));
    });

    const updateMethod: (filter: FilterDescriptor | undefined) => void = (filter) => {
      this.actions$.pipe(ofType(GridSavedFilterActions.dropdownDataOptionsUpdated)).subscribe(payload => {
        if (payload.column !== this.columnName || this.entityType !== payload.entityType) {
          return;
        }
        const newValue = filter?.value;
        const newOption = this.options.find((option) => option.value === newValue);
        this.dropdownFilter.chosenOption = newOption;
      });
    };

    initializeApplyFilterSubscription(this.actions$, this.entityType, this.column.field, updateMethod);
  }

  private getProperty<T, K extends keyof T>(obj: T, propName: K): T[K] {
    return obj[propName];
  }
}

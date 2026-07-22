import { Component, Input, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { DropDownListComponent, ValueTemplateDirective } from '@progress/kendo-angular-dropdowns';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { initializeApplyFilterSubscription } from 'src/app/shared/helpers/grid-filter.helpers';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { DatePickerComponent } from '../../datepicker/datepicker.component';
import { FilterIconComponent } from '../../icons/filter.component';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';

interface DateFilterOption {
  text: string;
  operator: string;
}

@Component({
  selector: 'app-date-filter',
  templateUrl: 'date-filter.component.html',
  styleUrls: ['date-filter.component.scss'],
  imports: [DatePickerComponent, DropDownListComponent, ValueTemplateDirective, FilterIconComponent],
})
export class DateFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  @Input() public entityType!: RegistrationEntityTypes;
  @Input() public columnConfig?: GridColumn;

  public value: Date | undefined = undefined;

  public readonly options: DateFilterOption[] = [
    { text: $localize`Fra og med`, operator: 'gte' },
    { text: $localize`Til og med`, operator: 'lte' },
  ];

  public chosenOption!: DateFilterOption;

  constructor(filterService: FilterService, private actions$: Actions) {
    super(filterService);
  }

  ngOnInit(): void {
    const columnFilter = this.getColumnFilter();
    this.value = columnFilter?.value;
    const defaultOperator = this.columnConfig?.defaultDateFilterOperator || this.options[0].operator;
    this.chosenOption = this.options.find((option) => option.operator === columnFilter?.operator) ||
      this.options.find((option) => option.operator === defaultOperator) ||
      this.options[0];

    const updateMethod: (filter: FilterDescriptor | undefined) => void = (filter) => {
      const defaultOperator = this.columnConfig?.defaultDateFilterOperator || this.options[0].operator;
      const savedChosenOption = this.options.find((option) => option.operator === filter?.operator) ||
        this.options.find((option) => option.operator === defaultOperator) ||
        this.options[0];
      const savedDate = filter ? new Date(filter.value) : undefined;
      this.value = savedDate;
      this.chosenOption = savedChosenOption || this.options[0];
    };
    this.subscriptions.add(
      initializeApplyFilterSubscription(this.actions$, this.entityType, this.column.field, updateMethod)
    );
  }

  public valueChange(value?: Date) {
    this.applyFilter(
      !value
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
          field: this.column.field,
          operator: this.chosenOption.operator,
          value: value,
        })
    );
  }

  public optionChange() {
    this.valueChange(this.value);
  }
}

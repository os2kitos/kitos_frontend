import { Component, Input, OnInit } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { Actions } from '@ngrx/effects';
import { initializeApplyFilterSubscription } from '../../filter-options-button/filter-options-button.component';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';

interface DateFilterOption {
  text: string;
  operator: string;
}

@Component({
  selector: 'app-date-filter',
  templateUrl: 'date-filter.component.html',
  styleUrls: ['date-filter.component.scss'],
})
export class DateFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  @Input() public entityType!: RegistrationEntityTypes;

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
    this.chosenOption = this.options.find((option) => option.operator === columnFilter?.operator) || this.options[0];

    const updateMethod: (filter: FilterDescriptor | undefined) => void = (filter) => {
      const savedChosenOption = this.options.find((option) => option.operator === filter?.operator) || this.options[0];
      const savedDate = filter ? new Date(filter.value) : undefined;
      this.value = savedDate;
      this.chosenOption = savedChosenOption || this.options[0];
    };

    initializeApplyFilterSubscription(this.actions$, this.entityType, this.column.field, updateMethod);
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

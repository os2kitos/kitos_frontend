import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, isCompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { Actions, ofType } from '@ngrx/effects';
import { getApplyFilterAction } from '../../filter-options-button/filter-options-button.component';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { map } from 'rxjs';
import { DatePickerComponent } from '../../datepicker/datepicker.component';
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
  @ViewChild(DatePickerComponent) public datePicker!: DatePickerComponent;
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


    /* this.actions$
      .pipe(
        ofType(getApplyFilterAction(this.entityType)),
        map((action) => action.state.filter)
      )
      .subscribe((compFilter) => {
        console.log(compFilter);
        if (!compFilter) return;
        const matchingFilter = compFilter.filters.find((filter) => !isCompositeFilterDescriptor(filter) && filter.field === this.column.field);
        //Don't think it can be a Composite filter ever for the grids we have, but the check satisfies TS
        console.log("Matching filter: ", matchingFilter);
        if (!matchingFilter || isCompositeFilterDescriptor(matchingFilter)) {
          this.value = undefined;
          return;
        }
        console.log("Foudn matching filter: ", matchingFilter);
        const savedDate = matchingFilter.value as Date;
        console.log("Saved date: ", savedDate);
        this.chosenOption = this.options.find((option) => option.operator === matchingFilter.operator) || this.options[0];
        this.datePicker.value = savedDate;
        this.valueChange(savedDate);
      }); */
  }

  public valueChange(value?: Date) {
    console.log('valueChange', value);
    this.applyFilter(
      !value
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: this.chosenOption.operator,
            value: value,
          })
    );
    this.value = value;
  }

  public optionChange() {
    this.valueChange(this.value);
  }
}

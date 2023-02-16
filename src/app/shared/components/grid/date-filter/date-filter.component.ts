import { Component, Input, OnInit } from '@angular/core';
import { DateInputFillMode } from '@progress/kendo-angular-dateinputs';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { DEFAULT_DATE_FORMAT } from 'src/app/shared/constants';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';

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

  public value: Date = new Date();

  public readonly fillMode: DateInputFillMode = 'outline';

  public readonly DEFAULT_DATE_FORMAT = DEFAULT_DATE_FORMAT;

  public readonly options: DateFilterOption[] = [
    { text: $localize`Lig med`, operator: 'eq' },
    { text: $localize`Fra og med`, operator: 'gte' },
    { text: $localize`Til og med`, operator: 'lte' },
  ];

  public chosenOption!: DateFilterOption;

  constructor(filterService: FilterService) {
    super(filterService);
  }

  ngOnInit(): void {
    const columnFilter = this.getColumnFilter();
    this.value = columnFilter?.value;
    this.chosenOption = this.options.find((option) => option.operator === columnFilter?.operator) || this.options[0];
  }

  public valueChange(value: Date) {
    this.applyFilter(
      !value
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: this.chosenOption.operator,
            value,
          })
    );
  }

  public optionChange() {
    this.valueChange(this.value);
  }
}

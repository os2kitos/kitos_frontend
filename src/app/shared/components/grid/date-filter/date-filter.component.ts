import { Component, Input, OnInit } from '@angular/core';
import { DateInputFillMode } from '@progress/kendo-angular-dateinputs';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';

@Component({
  selector: 'app-date-filter',
  templateUrl: 'date-filter.component.html',
  styleUrls: ['date-filter.component.scss'],
})
export class DateFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;

  public value: Date = new Date();

  public fillMode: DateInputFillMode = 'outline';

  constructor(filterService: FilterService) {
    super(filterService);
  }

  ngOnInit(): void {
    this.value = this.getColumnFilter()?.value;
  }

  public valueChange(value: string) {
    this.applyFilter(
      value === null
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'gte',
            value: value,
          })
    );
  }
}

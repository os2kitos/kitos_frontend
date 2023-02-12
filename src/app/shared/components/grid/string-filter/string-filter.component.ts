import { Component, Input, OnInit } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';

@Component({
  selector: 'app-string-filter',
  templateUrl: 'string-filter.component.html',
  styleUrls: ['string-filter.component.scss'],
})
export class StringFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;

  public value = '';

  constructor(filterService: FilterService) {
    super(filterService);
  }

  ngOnInit(): void {
    this.value = this.getColumnFilter()?.value ?? '';
  }

  public valueChange(value: string) {
    this.applyFilter(
      value === null
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'contains',
            value: value,
          })
    );
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';

@Component({
  selector: 'app-boolean-filter',
  templateUrl: 'boolean-filter.component.html',
  styleUrls: ['boolean-filter.component.scss'],
})
export class BooleanFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;

  public checked = false;

  constructor(filterService: FilterService) {
    super(filterService);
  }

  ngOnInit(): void {
    this.checked = this.getColumnFilter()?.value;
  }

  public switchChange(checked: boolean): void {
    this.applyFilter(
      checked === null
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'eq',
            value: checked,
          })
    );
  }
}

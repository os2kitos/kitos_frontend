import { Component, Input, OnInit } from '@angular/core';
import { ColumnComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { DropdownOption } from '../dropdown-filter/dropdown-filter.component';

@Component({
  selector: 'app-dropdown-column-data-filter',
  templateUrl: './dropdown-column-data-filter.component.html',
  styleUrl: './dropdown-column-data-filter.component.scss',
})
export class DropdownColumnDataFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() data!: GridDataResult;
  @Input() options: DropdownOption[] = [];

  ngOnInit(): void {
    this.data.data.forEach((item) => {
      console.log(item);
    });
  }
}

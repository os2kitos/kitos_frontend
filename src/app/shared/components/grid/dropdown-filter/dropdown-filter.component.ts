import { Component, Input, OnInit } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';

export interface DropdownOption {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

@Component({
  selector: 'app-dropdown-filter',
  templateUrl: './dropdown-filter.component.html',
  styleUrl: './dropdown-filter.component.scss',
})
export class DropdownFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() options!: DropdownOption[];

  public chosenOption?: DropdownOption;

  constructor(filterService: FilterService) {
    super(filterService);
  }

  ngOnInit(): void {
    const value = this.getColumnFilter()?.value;
    this.chosenOption = this.options.find((option) => option.value === value);
  }

  public didChange(option?: DropdownOption | null): void {
    this.applyFilter(
      option === undefined || option === null
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'eq',
            value: option.value as number,
          })
    );
  }
}

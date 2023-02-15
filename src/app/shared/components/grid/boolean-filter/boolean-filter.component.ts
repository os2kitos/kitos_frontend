import { Component, Input, OnInit } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';

interface BooleanOption {
  name: string;
  value: boolean;
}

@Component({
  selector: 'app-boolean-filter',
  templateUrl: 'boolean-filter.component.html',
  styleUrls: ['boolean-filter.component.scss'],
})
export class BooleanFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;

  public chosenOption?: BooleanOption;

  public options: BooleanOption[] = [
    {
      name: $localize`Sand`,
      value: true,
    },
    {
      name: $localize`Falsk`,
      value: false,
    },
  ];

  constructor(filterService: FilterService) {
    super(filterService);
  }

  ngOnInit(): void {
    const value = this.getColumnFilter()?.value;
    this.chosenOption = this.options.find((option) => option.value === value);
  }

  public didChange(option: BooleanOption): void {
    this.applyFilter(
      option === undefined
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'eq',
            value: option.value,
          })
    );
  }
}

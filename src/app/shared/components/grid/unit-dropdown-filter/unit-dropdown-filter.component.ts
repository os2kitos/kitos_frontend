import { Component, Input, OnInit } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { TreeNodeModel } from 'src/app/shared/models/tree-node.model';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';

@Component({
  selector: 'app-unit-dropdown-filter',
  templateUrl: './unit-dropdown-filter.component.html',
  styleUrl: './unit-dropdown-filter.component.scss',
})
export class UnitDropdownFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  public chosenOption?: TreeNodeModel;

  constructor(filterService: FilterService) {
    super(filterService);
  }

  ngOnInit(): void {
    this.chosenOption = this.getColumnFilter()?.value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public didChange(option?: any): void {
    this.applyFilter(
      option === undefined || option === null
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'eq',
            value: option.name,
          })
    );
  }
}

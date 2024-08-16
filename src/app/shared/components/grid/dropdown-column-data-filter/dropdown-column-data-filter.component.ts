import { Component, Input, OnInit } from '@angular/core';
import { ColumnComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
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
  @Input() columnName!: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() data$!: Observable<GridDataResult | null>;
  @Input() options: DropdownOption[] = [];

  ngOnInit(): void {
    this.data$.subscribe((gridData) => {
      const dataObject = gridData?.data as object[];
      this.options = [];
      const possibleOptions: string[] = [];
      dataObject.forEach((data) => {
        const columnData = this.getProperty(data, this.columnName as keyof typeof data);
        possibleOptions.push(columnData);
      });
      const uniqueOptions = Array.from(new Set(possibleOptions)).filter((option) => option);
      this.options = uniqueOptions.map((option) => ({ name: option, value: option } as DropdownOption));
    });
  }

  private getProperty<T, K extends keyof T>(obj: T, propName: K): T[K] {
    return obj[propName];
  }
}

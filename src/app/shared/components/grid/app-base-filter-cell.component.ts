import { BaseFilterCellComponent, ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor, isCompositeFilterDescriptor } from '@progress/kendo-data-query';

export class AppBaseFilterCellComponent extends BaseFilterCellComponent {
  override filter!: CompositeFilterDescriptor;

  public column!: ColumnComponent;

  constructor(filterService: FilterService) {
    super(filterService);

  }
  public getColumnFilter(): FilterDescriptor | null {
    if (this.filter === undefined) {
      return null;
    }

    const filter = this.filter.filters.find((filter) => {
      if (isCompositeFilterDescriptor(filter)) {
        return false;
      } else {
        return filter.field === this.column.field;
      }
    });

    if (filter === undefined || isCompositeFilterDescriptor(filter)) {
      return null;
    }
    return filter;
  }
}

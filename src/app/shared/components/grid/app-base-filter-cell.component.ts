import { Component, OnDestroy } from '@angular/core';
import { BaseFilterCellComponent, ColumnComponent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor, isCompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs';

@Component({
  template: '',
})
export class AppBaseFilterCellComponent extends BaseFilterCellComponent implements OnDestroy {
  override filter!: CompositeFilterDescriptor;

  public column!: ColumnComponent;
  public subscriptions = new Subscription();

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

  override ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

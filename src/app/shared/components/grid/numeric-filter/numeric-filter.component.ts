import { Component, Input, OnInit } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { Actions, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

@Component({
  selector: 'app-numeric-filter',
  templateUrl: './numeric-filter.component.html',
  styleUrl: './numeric-filter.component.scss',
})
export class NumericFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;

  public value = undefined;

  constructor(private actions$: Actions, filterService: FilterService) {
    super(filterService);
  }

  ngOnInit(): void {
    this.value = this.getColumnFilter()?.value ?? undefined;

    this.actions$.pipe(
      ofType(ITSystemUsageActions.applyITSystemFilter),
      map(action => action.filter)
    ).subscribe(filter => {
      this.filter = filter.compFilter ?? { logic: 'and', filters: [] };
      this.value = this.getColumnFilter()?.value ?? undefined;
    });
  }

  public valueChange(value: string) {
    this.applyFilter(
      !value
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'eq',
            value: Number(value),
          })
    );
  }
}

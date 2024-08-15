import { Component, Input, OnInit } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { Actions, ofType } from '@ngrx/effects';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { map } from 'rxjs';

@Component({
  selector: 'app-string-filter',
  templateUrl: './string-filter.component.html',
  styleUrl: './string-filter.component.scss',
})
export class StringFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;

  public value = '';

  constructor(private actions$: Actions, filterService: FilterService) {
    super(filterService);
  }

  ngOnInit(): void {
    this.value = this.getColumnFilter()?.value ?? '';

    this.actions$.pipe(
      ofType(ITSystemUsageActions.applyITSystemFilter),
      map(action => action.filter)
    ).subscribe(filter => {
      this.filter = filter.compFilter ?? { logic: 'and', filters: [] };
      this.value = this.getColumnFilter()?.value ?? '';
    });
  }

  public valueChange(value: string) {
    console.log('valueChange', value);
    this.applyFilter(
      !value
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'contains',
            value: value,
          })
    );
  }
}

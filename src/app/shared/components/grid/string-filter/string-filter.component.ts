import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { Actions, ofType } from '@ngrx/effects';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';

@Component({
  selector: 'app-string-filter',
  templateUrl: './string-filter.component.html',
  styleUrl: './string-filter.component.scss',
})
export class StringFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;

  public value = '';

  constructor(filterService: FilterService, private actions$: Actions, private cdr: ChangeDetectorRef) {
    super(filterService);
  }

  ngOnInit(): void {
    this.value = this.getColumnFilter()?.value ?? '';
    this.actions$.pipe(
      ofType(ITSystemUsageActions.applyITSystemFilter)
    ).subscribe(() => {
      if (this.column.field !== 'SystemName') return;
      console.log("yo");
      this.value = "1";
    });
  }

  public valueChange(value: string) {
    this.applyFilter(
      !value
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'contains',
            value: value,
          })
    );
    console.log('valueChange', value);
    console.log('this.filter', this.filter);
  }
}

